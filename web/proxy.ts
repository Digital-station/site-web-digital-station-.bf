import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

/**
 * Locale prefixing.
 *
 * Next.js 16 renamed the `middleware` file convention to `proxy`; this is the
 * same job under the new name.
 *
 * Every URL carries its language (`/fr/…`, `/en/…`). An unprefixed path is
 * redirected to the DEFAULT locale — French — and not to a guess based on the
 * visitor's browser: `localeDetection` and `localeCookie` are both off in
 * i18n/routing.ts. See the note there for why.
 *
 * Because the target no longer varies per visitor, this file no longer needs
 * to add `Vary: Accept-Language`. The redirect for a given path is now the
 * same for everyone and is safe for a CDN to cache.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Run on every path EXCEPT:
   *   /api/…      → route handlers must not be locale-prefixed
   *   /_next/…    → build output
   *   /_vercel/…  → platform internals
   *   anything containing a dot (favicon.ico, /brand/icon.webp, /logo/*.svg …)
   */
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
