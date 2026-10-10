import { z } from 'zod';

/**
 * ONE definition of what a lead looks like, shared by the contact form
 * (client, localized messages) and `/api/leads` (server, generic messages).
 * The Vite build kept two schemas that silently disagreed on limits.
 *
 * Contract (do not rename exports — several files import them):
 *   - `LEAD_LIMITS`   max lengths, mirrored on inputs as `maxLength`
 *   - `LeadMessages`  the five error strings a caller supplies
 *   - `leadFields(messages)` → the per-field rules, for forms that only
 *                     need a subset (the meeting scheduler asks for name +
 *                     email and nothing else)
 *   - `buildLeadSchema(messages)` → zod schema for `LeadInput`
 *   - `LeadInput`     the parsed shape
 *
 * Rules: `name` is required; `email` OR `phone` is required (at least one);
 * `brief` is required; `objective`/`budget` optional; `hp_website` is a
 * honeypot that must stay empty; `ts` is the client's mount time, which the
 * server compares with the arrival time (see app/api/leads/route.ts).
 */
export const LEAD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  objective: 120,
  budget: 60,
  brief: 5000,
} as const;

/**
 * Whole-string phone check. An optional leading "+", then at least eight of
 * digits, spaces, dots, dashes and parentheses — the characters people
 * actually type into a phone field. The previous rule stripped everything but
 * digits and counted, so "abc12345678xyz" passed.
 */
export const PHONE_PATTERN = /^\+?[\d\s().-]{8,}$/;

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

export function leadFields(m: LeadMessages) {
  return {
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
      .refine((v) => v === '' || PHONE_PATTERN.test(v), m.phone)
      .optional()
      .or(z.literal('')),
    objective: optionalText(LEAD_LIMITS.objective, m.tooLong),
    budget: optionalText(LEAD_LIMITS.budget, m.tooLong),
    brief: z.string().trim().min(10, m.brief).max(LEAD_LIMITS.brief, m.tooLong),
    /** Honeypot: real users never see this field, bots fill it in. */
    hp_website: z.string().max(0).optional(),
    /** `Date.now()` when the form mounted. A number, not `z.coerce`: coercion
     *  widens the input type to `unknown`, which the form's resolver rejects;
     *  the hidden input is registered with `valueAsNumber` instead. */
    ts: z.number().optional(),
  };
}

export function buildLeadSchema(m: LeadMessages) {
  return z.object(leadFields(m)).superRefine((d, ctx) => {
    /**
     * `superRefine` rather than `.refine()`: zod only ran the object-level
     * refinement once every field had passed, so a visitor who left name
     * AND both contact fields empty saw the name error, fixed it, and only
     * then learnt a contact was required. Now every error shows at once.
     * Both fields are marked, since either one fixes it.
     */
    if (!d.email && !d.phone) {
      for (const path of ['email', 'phone'] as const) {
        ctx.addIssue({ code: 'custom', message: m.contactRequired, path: [path] });
      }
    }
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
