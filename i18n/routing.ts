import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Locale routing for Digital Station.
 *
 * `localePrefix: 'always'` puts the language in the URL for BOTH languages:
 *   /fr/services   and   /en/services
 *
 * That is what lets Google index the two languages separately, makes links
 * shareable in a specific language, and allows hreflang tags to be emitted.
 * The proxy redirects a bare "/" to the default locale.
 *
 * French is the default because Digital Station operates in Burkina Faso.
 */
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',

  /**
   * Locale detection is OFF, and so is the locale cookie.
   *
   * With detection on, "/" resolved to whatever the visitor's browser
   * happened to send in Accept-Language, and the answer was then pinned in a
   * NEXT_LOCALE cookie. Two consequences, both bad here: a shared link to "/"
   * showed a different language to each recipient, and every response had to
   * carry Vary: Accept-Language + Set-Cookie, which makes the whole site
   * uncacheable at any CDN edge.
   *
   * Digital Station operates in Burkina Faso, so "/" now always lands on
   * French and the visitor switches language explicitly — a choice that lives
   * in the URL, where it can be shared, bookmarked and indexed.
   */
  localeDetection: false,
  localeCookie: false,

  /**
   * The `Link: …rel="alternate" hreflang` RESPONSE header is off because every
   * page already emits hreflang in its <head> via lib/seo.ts. Emitting both
   * meant two sources of truth for the same signal, and the header version was
   * generated from the URL rather than from the page's own metadata — so the
   * moment a route was renamed (see the redirects in next.config.ts) the
   * header would still have advertised a URL the page no longer claimed.
   */
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

/**
 * Locale-aware navigation primitives.
 *
 * Import `Link` / `useRouter` / `usePathname` FROM HERE, never from `next/link`
 * or `next/navigation` directly — these variants keep the active locale in the
 * URL automatically, so <Link href="/contact"> resolves to /fr/contact or
 * /en/contact without any component needing to know which language it is in.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
