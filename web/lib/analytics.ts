/**
 * Analytics — GA4, and OFF unless explicitly configured.
 *
 * Nothing loads and no requests are made unless
 * `NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4` and a site ID are set, so the default
 * build ships with no tracking of any kind.
 *
 * GA4 is deliberately hard to enable accidentally: it requires a consent
 * banner that this site does NOT yet have. See `Analytics.tsx`.
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
  }
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
