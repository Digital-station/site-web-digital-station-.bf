import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The banner's i18n imports need a Next runtime; only its storage helpers are under test.
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/routing', () => ({ Link: () => null }));

import { updateAnalyticsConsent } from '@/lib/analytics';
import { CONSENT_RESET_EVENT, resetStoredConsent } from '@/components/ui/CookieConsent';

type Win = { dataLayer?: unknown[]; dispatchEvent: ReturnType<typeof vi.fn> };

let win: Win;
let store: Map<string, string>;

beforeEach(() => {
  store = new Map([['ds-cookie-consent', '{"v":1,"analytics":true,"at":1}']]);
  win = { dispatchEvent: vi.fn() };
  vi.stubGlobal('window', win);
  vi.stubGlobal('Event', class FakeEvent { constructor(public type: string) {} });
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('updateAnalyticsConsent', () => {
  it('pushes a granted update onto dataLayer even before gtag.js has loaded', () => {
    updateAnalyticsConsent(true);
    expect(win.dataLayer).toEqual([['consent', 'update', { analytics_storage: 'granted' }]]);
  });

  it('pushes denied on refusal and never touches ad storage', () => {
    updateAnalyticsConsent(false);
    const [, , payload] = (win.dataLayer as unknown[][])[0];
    expect(payload).toEqual({ analytics_storage: 'denied' });
  });

  it('appends to an existing queue instead of replacing it', () => {
    win.dataLayer = [['consent', 'default', {}]];
    updateAnalyticsConsent(true);
    expect(win.dataLayer).toHaveLength(2);
  });
});

describe('resetStoredConsent', () => {
  it('clears the stored decision and signals the banner to reopen', () => {
    resetStoredConsent();
    expect(store.has('ds-cookie-consent')).toBe(false);
    const event = win.dispatchEvent.mock.calls[0][0] as { type: string };
    expect(event.type).toBe(CONSENT_RESET_EVENT);
  });

  it('still signals the banner when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      removeItem: () => {
        throw new Error('blocked');
      },
    });
    expect(() => resetStoredConsent()).not.toThrow();
    expect(win.dispatchEvent).toHaveBeenCalledTimes(1);
  });
});
