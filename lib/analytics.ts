/**
 * Analytics — GA4, and OFF unless explicitly configured.
 *
 * Nothing loads and no requests are made unless
 * `NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4` and a site ID are set, so the default
 * build ships with no tracking of any kind.
 *
 * GA4 is deliberately hard to enable accidentally: it requires consent.
 * `components/ui/CookieConsent.tsx` is the banner that grants it; see
 * `updateAnalyticsConsent` below for how that grant reaches gtag.
 */

export type AnalyticsProvider = 'ga4';

export const analyticsProvider = (): AnalyticsProvider | null => {
  const p = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  return p === 'ga4' ? p : null;
};

export const analyticsSiteId = (): string =>
  process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID ?? '';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Grants or denies GA4 analytics storage consent.
 *
 * Pushes directly onto `window.dataLayer` rather than calling
 * `window.gtag(...)`: the GA4 init script in `Analytics.tsx` loads with
 * `strategy="afterInteractive"`, so a fast hydration can call this before
 * `window.gtag` exists — the optional-call form would then silently drop
 * the update. Pushing to the queue is safe at any time: gtag.js drains it in
 * order once it loads, and `consent default` is always pushed first by the
 * init script itself, so this never races ahead of it.
 *
 * Only `analytics_storage` is ever touched — the site runs no ads, so
 * `ad_storage` / `ad_user_data` / `ad_personalization` stay denied.
 */
export function updateAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: granted ? 'granted' : 'denied' },
  ]);
}

/**
 * Record a custom event, whichever provider is configured.
 *
 * Safe to call unconditionally: if no provider is set, or the script has not
 * loaded, or the visitor blocks it, this is a no-op. Components should never
 * have to check first — the Vite build open-coded `window.gtag` checks at
 * each call site, which meant every new call had to remember the guard.
 */
export function trackEvent(
  name: string,
  props: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === 'undefined') return;

  try {
    if (analyticsProvider() === 'ga4') {
      window.gtag?.('event', name, props);
    }
  } catch {
    // Analytics must never break the page it is measuring.
  }
}
