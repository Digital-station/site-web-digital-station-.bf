import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { SERVICES } from '@/content/services';
import { site } from '@/config/site.config';

/**
 * Sitemap, generated from the same route data the pages are built from — so
 * it cannot drift out of date when a service is added or removed.
 *
 * Each entry declares its counterpart in the other language via `alternates`,
 * which Next.js renders as `xhtml:link rel="alternate" hreflang="…"`. That
 * pairs with the hreflang tags in each page's <head> and tells Google the two
 * URLs are the same page in different languages rather than duplicates.
 *
 * Privacy, Terms and Cookies are intentionally excluded: all three pages set
 * `robots: { index: false }`, so listing them would contradict the page
 * itself. Legal (mentions légales) is NOT excluded — it is indexed, since its
 * entity/RCCM/IFU/address content is a genuine trust signal rather than a
 * policy annex.
 */

/**
 * When each route's CONTENT last changed — not when the site was last built.
 *
 * This used to be `new Date()`, which stamped every URL with the build time.
 * A sitemap that claims every page changed the moment you deployed is a
 * sitemap crawlers learn to ignore, and it destroys the one signal
 * `lastModified` exists to carry.
 *
 * ⚠️  BUMP THE DATE FOR A ROUTE WHEN YOU CHANGE THAT ROUTE'S CONTENT — the
 * page copy, its service description, its images. Not for a styling tweak,
 * and never for all of them at once. Format: YYYY-MM-DD.
 */
const CONTENT_UPDATED: Record<string, string> = {
  '': '2026-09-20',
  '/services': '2026-08-29',
  '/solutions': '2026-09-20',
  '/about': '2026-09-20',
  '/contact': '2026-09-20',
  '/legal': '2026-10-06',
};

/** Fallback for any route missing from the map above (all service pages). */
const DEFAULT_UPDATED = '2026-08-29';

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const STATIC_ROUTES: Entry[] = [
  { path: '', changeFrequency: 'monthly', priority: 1.0 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/solutions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/legal', changeFrequency: 'yearly', priority: 0.3 },
];

const SERVICE_ROUTES: Entry[] = SERVICES.map((s) => ({
  path: `/services/${s.slug}`,
  changeFrequency: 'monthly',
  priority: 0.8,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...STATIC_ROUTES, ...SERVICE_ROUTES].flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${entry.path}`,
      lastModified: CONTENT_UPDATED[entry.path] ?? DEFAULT_UPDATED,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        // x-default matches the <head> hreflang set in lib/seo.ts.
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [l, `${site.url}/${l}${entry.path}`]),
          ['x-default', `${site.url}/${routing.defaultLocale}${entry.path}`],
        ]),
      },
    })),
  );
}
