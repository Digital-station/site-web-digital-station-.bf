import { describe, expect, it } from 'vitest';

import { buildLeadSchema, LEAD_LIMITS } from '@/lib/lead-schema';

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
  company: '',
};

describe('lead schema', () => {
  it('accepts a complete lead with an email', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it('accepts a lead with only a phone number', () => {
    const r = schema.safeParse({ ...valid, email: '', phone: '+226 70 00 00 00' });
    expect(r.success).toBe(true);
  });

  it('requires at least one of email or phone', () => {
    const r = schema.safeParse({ ...valid, email: '', phone: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.map((i) => i.message)).toContain(messages.contactRequired);
    }
  });

  it('rejects a malformed email', () => {
    const r = schema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('rejects a phone number with fewer than 8 digits', () => {
    const r = schema.safeParse({ ...valid, email: '', phone: '+226 12' });
    expect(r.success).toBe(false);
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
    const r = schema.safeParse({ ...valid, company: 'Bot Inc.' });
    expect(r.success).toBe(false);
  });
});
