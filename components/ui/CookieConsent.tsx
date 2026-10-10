'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { analyticsProvider, analyticsSiteId, updateAnalyticsConsent } from '@/lib/analytics';

const STORAGE_KEY = 'ds-cookie-consent';
const STORAGE_VERSION = 1;
/** Re-prompt after this long even if a decision was stored — the
 *  CNIL-aligned convention for an analytics consent record. */
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;

/** Dispatched by the "change your choice" control on /cookies
 *  (CookieSettingsButton.tsx) so this banner re-opens without a reload. */
export const CONSENT_RESET_EVENT = 'ds-cookie-consent-reset';

type StoredConsent = { v: number; analytics: boolean; at: number };

function readStored(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.v !== STORAGE_VERSION) return null;
    if (Date.now() - parsed.at > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(analytics: boolean) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: STORAGE_VERSION, analytics, at: Date.now() }),
    );
  } catch {
    // Private mode / storage quota — the choice still applies this session
    // via component state, it just will not be remembered next visit.
  }
}

/** Clears the stored decision and tells any mounted banner to reopen. */
export function resetStoredConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
}

type Phase = 'checking' | 'open' | 'saved' | 'closed';

/**
 * Bottom-left GA4 consent prompt.
 *
 * Server-renders an empty, zero-size, fixed wrapper so hydration matches,
 * then fills it in an effect — localStorage is unreadable on the server, and
 * i18n/routing.ts already explains why this codebase refuses a cookie for
 * anything request-coupled, which rules out reading the decision earlier.
 *
 * `position: fixed` plus opacity/translate/visibility transitions only:
 * nothing around this element ever moves, on entry or exit, so it cannot
 * contribute to CLS no matter when it appears — see this repo's prior
 * "Fix CLS 0.155" history, which is exactly the regression this avoids.
 *
 * Renders nothing when analytics is unconfigured, so an untracked build
 * never shows a prompt for a choice that would not do anything.
 */
export function CookieConsent() {
  const [phase, setPhase] = useState<Phase>('checking');
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations('cookieConsent');

  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const savedRef = useRef<HTMLParagraphElement>(null);
  /**
   * Set by the reset event only. The banner also opens on a first visit,
   * and stealing focus from the page a visitor just landed on is exactly
   * the pattern consent prompts are hated for — so the title is focused
   * only when the visitor asked for the banner back from /cookies.
   */
  const focusTitleOnOpen = useRef(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      // gtag.js does not remember a prior visit's consent.update call across
      // page loads — only what this page's own dataLayer carries — so a
      // returning "granted" visitor has to be re-sent every time.
      updateAnalyticsConsent(stored.analytics);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase('closed');
    } else {
      setPhase('open');
    }

    const onReset = () => {
      focusTitleOnOpen.current = true;
      setPhase('open');
    };
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);

  /**
   * Focus follows the phase: the "saved" line after a choice (so the
   * confirmation is read, and focus is not left on a button that no longer
   * exists), the title after a reset re-open. Both are tabIndex -1.
   */
  useEffect(() => {
    if (phase === 'saved') {
      savedRef.current?.focus();
    } else if (phase === 'open' && focusTitleOnOpen.current) {
      focusTitleOnOpen.current = false;
      titleRef.current?.focus();
    }
  }, [phase]);

  /**
   * Hide while a modal is up. The nav drawer makes this banner `inert`, but
   * `inert` does not stop it painting: at z-[90] it sat on top of the open
   * drawer (z-[60]). Same `aria-modal` signal StickyCTA watches, for the
   * same reason — any future modal gets the behaviour for free.
   */
  useEffect(() => {
    if (typeof MutationObserver !== 'function') return;

    const sync = () =>
      setModalOpen(document.querySelector('[aria-modal="true"]') !== null);
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal'],
    });
    return () => observer.disconnect();
  }, []);

  if (!analyticsProvider() || !analyticsSiteId()) return null;

  const choose = (analytics: boolean) => {
    writeStored(analytics);
    updateAnalyticsConsent(analytics);
    setPhase('saved');
    window.setTimeout(() => {
      // The banner is about to become `invisible`; if focus is still on the
      // "saved" line it would otherwise drop to <body>, and the next Tab
      // would start the page over. #main-content is the skip link's target
      // and is already focusable (tabIndex -1, see the layout).
      const active = document.activeElement;
      if (active && rootRef.current?.contains(active)) {
        document.getElementById('main-content')?.focus();
      }
      setPhase('closed');
    }, 1800);
  };

  const visible = (phase === 'open' || phase === 'saved') && !modalOpen;

  return (
    /* `data-state` is the public "is the banner showing" signal StickyCTA
       reads, so the FAB can step aside — the two would otherwise stack in
       the same bottom corner on narrow screens. */
    <div
      ref={rootRef}
      id="cookie-consent"
      role="region"
      aria-live="polite"
      aria-label={t('aria')}
      data-state={visible ? 'open' : 'closed'}
      className={`fixed bottom-4 left-4 lg:left-24 z-[90] w-[calc(100%-2rem)] max-w-sm transition-[opacity,translate,visibility] duration-300 motion-reduce:transition-none ${
        visible
          ? 'opacity-100 translate-y-0 visible'
          : 'opacity-0 translate-y-4 invisible pointer-events-none'
      }`}
    >
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 shadow-2xl">
        {phase === 'saved' ? (
          <p ref={savedRef} tabIndex={-1} className="text-sm text-brand-text outline-none">
            {t('saved')}
          </p>
        ) : (
          <>
            <p
              ref={titleRef}
              tabIndex={-1}
              className="text-xs font-mono uppercase tracking-wider text-brand-accent mb-2 outline-none"
            >
              {t('title')}
            </p>
            <p className="text-sm text-brand-muted leading-relaxed mb-4">
              {t('body')}{' '}
              <Link
                href="/cookies"
                className="text-brand-accent underline underline-offset-4"
              >
                {t('details')}
              </Link>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => choose(false)}
                className="btn-outline flex-1 px-4 py-2.5 text-xs uppercase font-bold tracking-wider"
              >
                {t('refuse')}
              </button>
              <button
                type="button"
                onClick={() => choose(true)}
                className="btn-primary flex-1 px-4 py-2.5 text-xs uppercase font-bold tracking-wider"
              >
                {t('accept')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
