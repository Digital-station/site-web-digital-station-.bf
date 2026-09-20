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

/**
 * Request timestamps per client IP.
 *
 * Deliberately a module-level Map — that is, PER NODE PROCESS. The site is
 * deployed as a single Node process on the owner's cPanel host, so one
 * process sees every request and the count is exact. If this ever moves to a
 * multi-instance or serverless platform, each instance would keep its own
 * count and the effective limit would multiply by the instance count; that is
 * the point at which this needs to become Redis or an upstream WAF rule.
 *
 * Memory is bounded by pruning: entries older than the window are dropped on
 * every call, so the map only ever holds IPs seen in the last 10 minutes.
 */
const requestLog = new Map<string, number[]>();

/**
 * Timestamps of every POST that cleared the rate-limit check, regardless of
 * claimed IP. This counts *attempts admitted for processing* — it is written
 * before the honeypot, the schema and Resend have had their say, so a request
 * counted here may still end as a 400, a 503 or a discarded bot submission. It
 * is a throttle ledger, not a record of delivered leads.
 *
 * Same per-process caveat as `requestLog` above: exact on the
 * single cPanel Node instance, and it would need Redis or an upstream WAF the
 * day this runs on more than one process.
 *
 * Always appended with `Date.now()`, so it stays sorted and pruning is a shift
 * from the front.
 */
const globalLog: number[] = [];

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
 * Both buckets are checked before either is written to, so a request refused
 * by the global cap does not also burn the caller's per-IP allowance.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  // Prune every IP, not just this one, so the map cannot grow unbounded.
  for (const [key, times] of requestLog) {
    const recent = times.filter((t) => t > cutoff);
    if (recent.length === 0) requestLog.delete(key);
    else requestLog.set(key, recent);
  }

  // Same pruning for the global log; it is sorted, so drop from the front.
  while (globalLog.length > 0 && globalLog[0] <= cutoff) globalLog.shift();

  const times = requestLog.get(ip) ?? [];
  if (times.length >= RATE_LIMIT_MAX) return true;
  if (globalLog.length >= GLOBAL_RATE_LIMIT_MAX) return true;

  requestLog.set(ip, [...times, now]);
  globalLog.push(now);
  return false;
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
  if (isRateLimited(ip)) {
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
