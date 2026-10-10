import { describe, expect, it } from 'vitest';

import { buildLeadSchema, LEAD_LIMITS, leadFields } from '@/lib/lead-schema';

const messages = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  contactRequired: 'contactRequired',
  brief: 'brief',
  tooLong: 'tooLong',
};

const schema = buildLeadSchema(messages);

const valid = {
  name: 'Adama Ouédraogo',
  email: 'adama@example.com',
  phone: '',
  objective: '',
  budget: '',
  brief: 'We need a ticketing platform for three sites.',
  hp_website: '',
  ts: 1_700_000_000_000,
};

const issuesOf = (input: unknown) => {
  const r = schema.safeParse(input);
  return r.success ? [] : r.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
};

describe('lead schema', () => {
  it('accepts a complete lead with an email', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it('accepts a lead with only a phone number', () => {
    const r = schema.safeParse({ ...valid, email: '', phone: '+226 70 00 00 00' });
    expect(r.success).toBe(true);
  });

  it('requires at least one of email or phone, flagging both fields', () => {
    const issues = issuesOf({ ...valid, email: '', phone: '' });
    expect(issues).toEqual(
      expect.arrayContaining([
        { path: 'email', message: messages.contactRequired },
        { path: 'phone', message: messages.contactRequired },
      ]),
    );
  });

  it('reports the contact rule alongside other field errors', () => {
    // Used to be a `.refine()` that only ran once every field passed, so an
    // empty form revealed its errors one submit at a time.
    const issues = issuesOf({ ...valid, name: '', email: '', phone: '' });
    const paths = issues.map((i) => i.path);
    expect(paths).toContain('name');
    expect(paths).toContain('email');
    expect(paths).toContain('phone');
  });

  it('rejects a malformed email', () => {
    const r = schema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('rejects a phone number with fewer than 8 characters', () => {
    const r = schema.safeParse({ ...valid, email: '', phone: '+226 12' });
    expect(r.success).toBe(false);
  });

  it('rejects a phone number containing letters', () => {
    const r = schema.safeParse({ ...valid, email: '', phone: 'call 70 00 00 00' });
    expect(r.success).toBe(false);
    expect(issuesOf({ ...valid, email: '', phone: 'call 70 00 00 00' })).toContainEqual({
      path: 'phone',
      message: messages.phone,
    });
  });

  it('accepts the punctuation people type into phone fields', () => {
    for (const phone of ['+226 70 00 00 00', '(226) 70-00-00-00', '70.00.00.00', ' 70000000 ']) {
      expect(schema.safeParse({ ...valid, email: '', phone }).success).toBe(true);
    }
  });

  it('rejects a brief shorter than 10 characters', () => {
    const r = schema.safeParse({ ...valid, brief: 'too short' });
    expect(r.success).toBe(false);
  });

  it('enforces the shared length limits', () => {
    const r = schema.safeParse({ ...valid, name: 'a'.repeat(LEAD_LIMITS.name + 1) });
    expect(r.success).toBe(false);
  });

  it('rejects a filled honeypot field', () => {
    const r = schema.safeParse({ ...valid, hp_website: 'https://bot.example' });
    expect(r.success).toBe(false);
  });

  it('accepts a lead without a mount timestamp (the server checks it separately)', () => {
    expect(schema.safeParse({ ...valid, ts: undefined }).success).toBe(true);
  });

  it('exposes per-field rules for forms that only need a subset', () => {
    const fields = leadFields(messages);
    expect(fields.name.safeParse('A').success).toBe(false);
    expect(fields.email.safeParse('nope').success).toBe(false);
    expect(fields.email.safeParse('ok@example.com').success).toBe(true);
  });
});
