/**
 * The contact-page FAQ, in display order. Each key maps to
 * `contact.faq.items.<key>.{q,a}` in messages/*.json.
 *
 * Lives here rather than in ContactForm.tsx because the contact page (a server
 * component) builds its FAQPage JSON-LD from the same list, and a value
 * imported from a 'use client' module is not usable on the server.
 */
export const FAQ_KEYS = ['response', 'quote', 'remote', 'payment'] as const;
