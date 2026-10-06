import Script from 'next/script';

import { analyticsProvider, analyticsSiteId } from '@/lib/analytics';

/**
 * Injects the GA4 script — or nothing at all.
 *
 * A server component: the provider is decided at render time from environment
 * variables, so an unconfigured build emits no script tag, no preconnect, and
 * makes no third-party request.
 *
 * Configure with:
 *   NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4
 *   NEXT_PUBLIC_ANALYTICS_SITE_ID=G-XXXXXXX
 */
export function Analytics() {
  const provider = analyticsProvider();
  const siteId = analyticsSiteId();

  if (!provider || !siteId) return null;

  /**
   * The measurement ID is interpolated into an inline script below, so it is
   * validated against GA4's actual format first. The value comes from an
   * environment variable rather than a visitor, but a typo'd or malformed one
   * should fail closed rather than emit broken — or injectable — JavaScript.
   */
  if (!/^G-[A-Z0-9]{4,20}$/i.test(siteId)) {
    console.warn(
      `[analytics] NEXT_PUBLIC_ANALYTICS_SITE_ID="${siteId}" is not a valid GA4 measurement ID (expected G-XXXXXXX). Analytics disabled.`,
    );
    return null;
  }

  /**
   * Loaded with Google Consent Mode v2 defaulting to DENIED for every storage
   * type. In that state GA4 sets no cookies and sends only cookieless pings,
   * which is the only lawful default in the EU and the only setting that keeps
   * this site's privacy policy ("only the cookies necessary for it to work")
   * truthful.
   *
   * Consent starts denied on every load. `components/ui/CookieConsent.tsx`
   * calls `updateAnalyticsConsent()` (lib/analytics.ts) once the visitor
   * accepts, which pushes `consent update` onto the dataLayer this script
   * sets up — until then, GA4 collects nothing meaningful.
   *
   * Everything is `afterInteractive`. The consent default used to be a separate
   * `beforeInteractive` script, which Next.js places ahead of all of the site's
   * own code on every page. It doesn't need to run that early, only before
   * gtag.js reads the queue: this one inline script is injected ahead of the
   * async gtag.js and runs as soon as it is inserted, so `consent default` is
   * always the first command in `dataLayer`.
   */
  return (
    <>
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${siteId}', { anonymize_ip: true });
`,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${siteId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
