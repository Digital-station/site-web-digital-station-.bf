import { notFound } from 'next/navigation';

/**
 * Catch-all for unmatched paths INSIDE a locale.
 *
 * Without this, /fr/nope has no matching route, so Next.js falls back to the
 * root app/not-found.tsx — a bare page with no navbar, no footer and no way
 * back into the site in the visitor's own language.
 *
 * Calling notFound() from a page that IS inside the [locale] segment makes
 * Next.js render app/[locale]/not-found.tsx instead, which sits inside the
 * locale layout and therefore keeps the chrome and the language. The response
 * is still a real 404, not a soft one.
 *
 * DO NOT add `generateMetadata` here expecting it to title the 404 page: it was
 * tried against a production build and Next discards this segment's metadata as
 * soon as notFound() throws, falling back to the locale layout's. The served
 * HTML therefore carries the site's default <title>, and the localized one that
 * app/[locale]/not-found.tsx renders as a <title> element only lands once React
 * has hydrated. Next injects `<meta name="robots" content="noindex">` on the
 * 404 by itself, so this costs nothing in search; it only shows up in a share
 * preview of a dead link.
 */
export default function CatchAllNotFound() {
  notFound();
}
