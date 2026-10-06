import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { site } from '@/config/site.config';
import { serverLeadSchema } from '@/lib/lead-schema';

/**
 * Lead intake endpoint.
 *
 * This is the only unauthenticated write surface on the site, so it is also
 * the only thing worth attacking. The guards below run in order, cheapest
 * first, and each one exists because of a specific failure the endpoint had:
 *
 *  1. SIZE CAP — the handler used to `await request.json()` on anything.
 *     A multi-megabyte body was parsed in full before validation rejected it.
 *  2. ORIGIN CHECK — a form on any other site could POST here directly and
 *     use the company's own inbox as a spam relay.
 *  3. RATE LIMIT — nothing stopped one client from posting continuously.
 *     Two buckets: per-IP, plus a site-wide cap that still holds when the
 *     client-supplied X-Forwarded-For is rotated to fake a new IP each time.
 *  4. HONEYPOT — bots that fill the hidden `company` field get a cheerful
 *     201 and no email. Telling them they were caught only teaches them.
 *  5. VALIDATION — one shared schema with the form (lib/lead-schema.ts), so
 *     the two can no longer disagree about what a valid lead is.
 *  6. HTML ESCAPING — user input used to be interpolated raw into the email.
 *  7. HONEST STATUS CODES — a 201 means an email was accepted for delivery.
 *     It used to be returned even when RESEND_API_KEY was missing.
 */

/* ── 1. Size cap ─────────────────────────────────────────────────────────── */

/**
 * 16 KB. The schema's own limits add up to roughly 5.5 KB of text; this
 * leaves room for JSON overhead and multi-byte characters while still
 * rejecting anything absurd before it is parsed.
 */
const MAX_BODY_BYTES = 16384;

/* ── 3. Rate limit ───────────────────────────────────────────────────────── */

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Site-wide ceiling on accepted submissions in the same window.
 *
 * TWO buckets, because they stop two different things:
 *   - the per-IP bucket stops one visitor hammering the form;
 *   - this one bounds a script that rotates a fake `X-Forwarded-For` on every
 *     request. That header is client-supplied, so a per-IP limit alone is only
 *     as trustworthy as the client — a new spoofed IP means a fresh allowance.
 *     A global cap does not care what the attacker claims to be.
 *
 * 30 per 10 minutes is far above any plausible real volume for this site and
 * far below what makes a spam relay worth building.
 */
const GLOBAL_RATE_LIMIT_MAX = 30;
const GLOBAL_RATE_LIMIT_KEY = 'leads:global';

/**
 * Where hit counts live — pluggable, because the right answer depends on
 * where this is deployed.
 *
 * A module-level Map is correct on a single long-lived Node process — the
 * cPanel/Docker/PM2 target this repo's `deploy/` scripts build for — because
 * one process sees every request and the count is exact. It is WRONG on
 * Vercel's serverless functions, where an invocation can run in its own
 * process: every instance would keep its own count, and the effective limit
 * would silently multiply by however many instances handled a burst.
 *
 * When `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set —
 * which Vercel's Upstash marketplace integration does automatically — counts
 * move to Redis instead, shared across every instance. Without them, the
 * in-memory store below is used, which is exactly what the VPS path needs.
 */
interface RateLimitStore {
  /** Increments `key`'s count for the current window and reports whether
   *  that push took it over `max`. */
  hit(key: string, max: number, windowMs: number): Promise<boolean>;
}

/**
 * Sliding-window-by-timestamp-list store, per process. Memory is bounded by
 * pruning: entries older than the window are dropped on every call, so the
 * map only ever holds keys seen within the last window.
 */
class MemoryRateLimitStore implements RateLimitStore {
  private log = new Map<string, number[]>();

  async hit(key: string, max: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const cutoff = now - windowMs;

    // Prune every key, not just this one, so the map cannot grow unbounded.
    for (const [k, times] of this.log) {
      const recent = times.filter((t) => t > cutoff);
      if (recent.length === 0) this.log.delete(k);
      else this.log.set(k, recent);
    }

    const times = this.log.get(key) ?? [];
    if (times.length >= max) return true;
    this.log.set(key, [...times, now]);
    return false;
  }
}

/**
 * Fixed-window counter via Upstash's Redis REST API — plain `fetch`, no SDK
 * dependency. Slightly less precise at window boundaries than the
 * sliding-window memory store above (a burst can straddle two windows),
 * which is an accepted trade-off for the same reason the global cap already
 * is one: this bounds a spam relay, it does not need to be exact.
 *
 * Fails OPEN on any network or auth error — logged, but a transient Redis
 * outage should never be able to block a real visitor from reaching the
 * contact form.
 */
class UpstashRateLimitStore implements RateLimitStore {
  constructor(
    private url: string,
    private token: string,
  ) {}

  async hit(key: string, max: number, windowMs: number): Promise<boolean> {
    try {
      const res = await fetch(`${this.url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          // NX: only arms the expiry on the FIRST hit in a window, so a
          // steady stream of requests cannot keep pushing it back and
          // extend the window indefinitely.
          ['PEXPIRE', key, String(windowMs), 'NX'],
        ]),
      });
      if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
      const [incr] = (await res.json()) as { result: number }[];
      return (incr?.result ?? 0) > max;
    } catch (err) {
      console.error('[leads] rate limit store unreachable, failing open:', err);
      return false;
    }
  }
}

function createRateLimitStore(): RateLimitStore {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new UpstashRateLimitStore(url, token);
  return new MemoryRateLimitStore();
}

const rateLimitStore = createRateLimitStore();

/** First entry of x-forwarded-for, else x-real-ip, else 'unknown'. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * True when this IP has used its own allowance, OR when the site as a whole
 * has used the global allowance, for the current window.
 *
 * The two `hit()` calls are not atomic with each other — under concurrent
 * requests, one could in theory burn its per-IP allowance and then
 * separately be refused by the global cap. That is a deliberate relaxation
 * of the single-process version's check-both-then-write-either ordering, in
 * exchange for a store that works on serverless; the global cap still holds
 * regardless of how the two land relative to each other.
 */
async function isRateLimited(ip: string): Promise<boolean> {
  const [ipLimited, globalLimited] = await Promise.all([
    rateLimitStore.hit(`leads:ip:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS),
    rateLimitStore.hit(GLOBAL_RATE_LIMIT_KEY, GLOBAL_RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS),
  ]);
  return ipLimited || globalLimited;
}

/* ── 2. Origin check ─────────────────────────────────────────────────────── */

/**
 * Is this request plausibly coming from our own pages?
 *
 * `Sec-Fetch-Site` is set by the browser itself and cannot be forged by page
 * script, which makes it the reliable signal:
 *   same-origin → our own fetch()          ✓
 *   none        → typed/bookmarked         ✓
 *   cross-site / same-site → someone else's page  ✗
 *
 * Older browsers and non-browser clients (curl, a monitoring probe) send it
 * not at all; for those we fall back to `Origin`, and accept the request when
 * there is no Origin either — a request with neither header did not come from
 * a page, so there is no cross-site attack to prevent.
 */
function isAllowedOrigin(request: Request): boolean {
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite) {
    return secFetchSite === 'same-origin' || secFetchSite === 'none';
  }

  const origin = request.headers.get('origin');
  // Deliberate, accepted trade-off: a scripted client can omit both headers and
  // walk past this check. Rejecting it would break legitimate visitors behind
  // odd proxies, and on cPanel/Passenger the socket IP is the proxy's, so the
  // client-supplied XFF is genuinely needed. The global cap above is what
  // bounds the abuse this leaves open.
  if (!origin) return true;

  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }

  return (
    host === new URL(site.url).hostname ||
    host === 'localhost' ||
    host === '127.0.0.1'
  );
}

/* ── 6. HTML escaping ────────────────────────────────────────────────────── */

/** Escape the five characters that can break out of HTML text content. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

/* ── Handler ─────────────────────────────────────────────────────────────── */

export async function POST(request: Request) {
  // 1. Size — checked from the header, before anything is read off the socket.
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: 'payload_too_large' },
      { status: 413 },
    );
  }

  // 2. Origin.
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { success: false, error: 'forbidden_origin' },
      { status: 403 },
    );
  }

  // 3. Rate limit.
  const ip = clientIp(request);
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'rate_limited' },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  // 4. Honeypot — checked BEFORE the schema, so the bot sees a plain success
  //    rather than a validation error naming the field that gave it away.
  const honeypot = (payload as { company?: unknown } | null)?.company;
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    console.warn('[leads] honeypot hit');
    return NextResponse.json({ success: true }, { status: 201 });
  }

  // 5. Validation — the same schema the form uses, with generic messages.
  const parsed = serverLeadSchema.safeParse(payload);
  if (!parsed.success) {
    // Field names only — the visitor already sees localized messages from the
    // matching client-side schema, so there is nothing to translate here.
    return NextResponse.json(
      {
        success: false,
        error: 'validation_failed',
        fields: parsed.error.issues.map((i) => i.path.join('.')),
      },
      { status: 400 },
    );
  }

  const { name, email, phone, objective, budget, brief } = parsed.data;

  const resend = getResend();
  if (!resend) {
    console.error(
      '[leads] RESEND_API_KEY is not set — the message was NOT delivered.',
      { receivedAt: new Date().toISOString() },
    );
    return NextResponse.json(
      { success: false, error: 'email_not_configured' },
      { status: 503 },
    );
  }

  const destination = process.env.CONTACT_EMAIL || site.leadInbox;
  const from = process.env.LEADS_FROM || `${site.name} <onboarding@resend.dev>`;

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 12px;font-size:15px;"><strong style="color:#144F97;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;

  const html = `
    <div style="font-family:system-ui,sans-serif;background:#ffffff;color:#191919;padding:32px;border:1px solid #afaba1;border-radius:12px;max-width:640px;">
      <h1 style="color:#144F97;font-size:20px;text-transform:uppercase;letter-spacing:1px;margin:0 0 24px;">
        Nouveau message — ${escapeHtml(site.name)}
      </h1>
      ${row('Nom', name)}
      ${row('Email', email || '—')}
      ${row('Téléphone', phone || '—')}
      ${row('Service', objective || '—')}
      ${row('Budget', budget || '—')}
      <hr style="border:0;border-top:1px solid #afaba1;margin:24px 0;">
      <p style="font-size:13px;color:#666;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Description du projet</p>
      <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0;">${escapeHtml(brief)}</p>
    </div>
  `;

  /**
   * A newline anywhere in a mail header lets the sender append headers of
   * their own — a Bcc, a different Reply-To. `name` and `objective` are
   * visitor-supplied and land in the Subject, so every CR/LF is collapsed to
   * a space and the result is capped at a length no MTA will fold or reject.
   */
  const subject = `${site.name} — ${name}${objective ? ` · ${objective}` : ''}`
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 150);

  try {
    const { error } = await resend.emails.send({
      from,
      to: [destination],
      // Only set when there is an address to reply to; phone-only leads have none.
      ...(email ? { replyTo: email } : {}),
      subject,
      html,
    });

    if (error) {
      console.error('[leads] Resend rejected the message:', error);
      return NextResponse.json(
        { success: false, error: 'delivery_failed' },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error('[leads] Resend threw:', err);
    return NextResponse.json(
      { success: false, error: 'delivery_failed' },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
