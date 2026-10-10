import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The guard ORDER in /api/leads is the point of these tests: bots and
 * malformed requests must be refused before they can spend the rate-limit
 * allowance shared with real visitors, and the honeypot/timing checks must
 * look like a success to the caller.
 *
 * SMTP_HOST is left unset, so a request that passes every guard ends in a
 * 503 — that is the "got through" signal here, and no email is attempted.
 */
vi.mock('nodemailer', () => ({ default: { createTransport: vi.fn() } }));

const { POST } = await import('@/app/api/leads/route');

const lead = {
  name: 'Adama Ouédraogo',
  email: 'adama@example.com',
  phone: '',
  objective: '',
  budget: '',
  brief: 'We need a ticketing platform for three sites.',
  hp_website: '',
  ts: Date.now() - 60_000,
};

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sec-fetch-site': 'same-origin',
        'x-forwarded-for': headers['x-forwarded-for'] ?? `10.0.0.${Math.floor(Math.random() * 250)}`,
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

describe('POST /api/leads', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('lets a valid lead through to the transport (503 with SMTP unset)', async () => {
    const res = await post(lead);
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ error: 'email_not_configured' });
  });

  it('rejects an oversized body even when Content-Length lies', async () => {
    const res = await post(JSON.stringify({ ...lead, brief: 'x'.repeat(20_000) }), {
      'content-length': '10',
    });
    expect(res.status).toBe(413);
  });

  it('returns invalid_json for a body that is not JSON', async () => {
    const res = await post('{not json');
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'invalid_json' });
  });

  it('answers a filled honeypot with a fake 201 and logs it', async () => {
    const res = await post({ ...lead, hp_website: 'https://bot.example' });
    expect(res.status).toBe(201);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('honeypot'));
  });

  it('answers a too-fast submission with a fake 201 and logs it', async () => {
    const res = await post({ ...lead, ts: Date.now() - 500 });
    expect(res.status).toBe(201);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('timing'));
  });

  it('treats a missing mount time as a bot', async () => {
    const res = await post({ ...lead, ts: undefined });
    expect(res.status).toBe(201);
  });

  it('does not refuse a visitor whose clock runs ahead of the server', async () => {
    const res = await post({ ...lead, ts: Date.now() + 30_000 });
    expect(res.status).toBe(503);
  });

  it('names the failing fields on a validation error', async () => {
    const res = await post({ ...lead, name: '', email: '', phone: '' });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { fields: string[] };
    expect(body.fields).toEqual(expect.arrayContaining(['name', 'email', 'phone']));
  });

  it('rate-limits per IP only after the request passed every other guard', async () => {
    const ip = '203.0.113.7';
    // Invalid requests from this IP must not count …
    for (let i = 0; i < 10; i++) {
      expect((await post({ ...lead, brief: '' }, { 'x-forwarded-for': ip })).status).toBe(400);
      expect((await post({ ...lead, hp_website: 'x' }, { 'x-forwarded-for': ip })).status).toBe(201);
    }
    // … so five valid ones still get through, and the sixth is refused.
    for (let i = 0; i < 5; i++) {
      expect((await post(lead, { 'x-forwarded-for': ip })).status).toBe(503);
    }
    const sixth = await post(lead, { 'x-forwarded-for': ip });
    expect(sixth.status).toBe(429);
  });
});
