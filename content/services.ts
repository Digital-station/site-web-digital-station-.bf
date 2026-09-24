/**
 * Service catalogue — STRUCTURE ONLY.
 *
 * All prose (title, description, benefits, process, hero copy…) lives in
 * messages/fr.json and messages/en.json under `services.items.<slug>`, so the
 * same catalogue renders in both languages. What stays here is the data that
 * is identical regardless of language: the slug, the display number, the
 * accent class and the hero image.
 *
 * Slugs are intentionally the SAME in both locales, so /fr/services/<slug> and
 * /en/services/<slug> resolve to the same service.
 */

export type ServiceMeta = {
  slug: string;
  /** Two-digit display number shown in the navbar dropdown and service grid. */
  num: string;
  /**
   * Tailwind text-colour classes used as a per-service accent. The -400 shades
   * are for charcoal; on cream they fall to 1.7-3:1, so each carries a darker
   * `light:` shade (see the variant in app/globals.css).
   */
  accentColor: string;
  /** Hero image. Local placeholder under public/placeholders/. */
  image: string;
};

export const SERVICES: readonly ServiceMeta[] = [
  {
    slug: 'software-development',
    num: '01',
    accentColor: 'text-blue-400 light:text-blue-700',
    image: '/placeholders/service-software-development.jpg',
  },
  {
    slug: 'social-media-management',
    num: '02',
    accentColor: 'text-fuchsia-400 light:text-fuchsia-700',
    image: '/placeholders/service-social-media-management.jpg',
  },
  {
    slug: 'integration-solutions',
    num: '03',
    accentColor: 'text-emerald-400 light:text-emerald-700',
    image: '/placeholders/service-integration-solutions.jpg',
  },
  {
    slug: 'licences-editeurs',
    num: '04',
    accentColor: 'text-amber-400 light:text-amber-700',
    image: '/placeholders/service-licences-editeurs.jpg',
  },
  {
    slug: 'support-infogerance',
    num: '05',
    accentColor: 'text-pink-400 light:text-pink-700',
    image: '/placeholders/service-support-infogerance.jpg',
  },
  {
    slug: 'formation-accompagnement',
    num: '06',
    accentColor: 'text-purple-400 light:text-purple-700',
    image: '/placeholders/service-formation-accompagnement.jpg',
  },
  {
    slug: 'transformation-digitale',
    num: '07',
    accentColor: 'text-cyan-400 light:text-cyan-700',
    image: '/placeholders/service-transformation-digitale.jpg',
  },
  {
    slug: 'cybersecurite-conformite',
    num: '08',
    accentColor: 'text-indigo-400 light:text-indigo-700',
    image: '/placeholders/service-cybersecurite-conformite.jpg',
  },
  {
    slug: 'cloud-hebergement',
    num: '09',
    accentColor: 'text-rose-400 light:text-rose-700',
    image: '/placeholders/service-cloud-hebergement.jpg',
  },
  {
    slug: 'intelligence-artificielle',
    num: '10',
    accentColor: 'text-blue-500 light:text-blue-700',
    image: '/placeholders/service-intelligence-artificielle.jpg',
  },
  {
    slug: 'negoce',
    num: '11',
    accentColor: 'text-orange-400 light:text-orange-700',
    image: '/placeholders/service-negoce.jpg',
  },
] as const;

/** Look up a service by slug. Returns undefined for unknown slugs. */
export const getService = (slug: string): ServiceMeta | undefined =>
  SERVICES.find((s) => s.slug === slug);

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
