import { z } from 'zod';

/**
 * ONE definition of what a lead looks like, shared by the contact form
 * (client, localized messages) and `/api/leads` (server, generic messages).
 * The Vite build kept two schemas that silently disagreed on limits.
 *
 * Contract (do not rename exports — several files import them):
 *   - `LEAD_LIMITS`   max lengths, mirrored on inputs as `maxLength`
 *   - `LeadMessages`  the five error strings a caller supplies
 *   - `buildLeadSchema(messages)` → zod schema for `LeadInput`
 *   - `LeadInput`     the parsed shape
 *
 * Rules: `name` is required; `email` OR `phone` is required (at least one);
 * `brief` is required; `objective`/`budget` optional; `company` is a honeypot
 * that must stay empty.
 */
export const LEAD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  objective: 120,
  budget: 60,
  brief: 5000,
} as const;

export type LeadMessages = {
  name: string;
  email: string;
  phone: string;
  contactRequired: string;
  brief: string;
  tooLong: string;
};

const optionalText = (max: number, tooLong: string) =>
  z.string().trim().max(max, tooLong).optional().or(z.literal(''));

export function buildLeadSchema(m: LeadMessages) {
  return z
    .object({
      name: z.string().trim().min(2, m.name).max(LEAD_LIMITS.name, m.tooLong),
      email: z
        .string()
        .trim()
        .max(LEAD_LIMITS.email, m.tooLong)
        .refine((v) => v === '' || z.email().safeParse(v).success, m.email)
        .optional()
        .or(z.literal('')),
      phone: z
        .string()
        .trim()
        .max(LEAD_LIMITS.phone, m.tooLong)
        .refine((v) => v === '' || v.replace(/[^\d+]/g, '').length >= 8, m.phone)
        .optional()
        .or(z.literal('')),
      objective: optionalText(LEAD_LIMITS.objective, m.tooLong),
      budget: optionalText(LEAD_LIMITS.budget, m.tooLong),
      brief: z.string().trim().min(10, m.brief).max(LEAD_LIMITS.brief, m.tooLong),
      /** Honeypot: real users never see this field, bots fill it in. */
      company: z.string().max(0).optional(),
    })
    .refine((d) => Boolean(d.email) || Boolean(d.phone), {
      message: m.contactRequired,
      path: ['email'],
    });
}

export type LeadInput = z.infer<ReturnType<typeof buildLeadSchema>>;

/** Server-side instance; messages are never shown to visitors. */
export const serverLeadSchema = buildLeadSchema({
  name: 'name',
  email: 'email',
  phone: 'phone',
  contactRequired: 'contact_required',
  brief: 'brief',
  tooLong: 'too_long',
});
