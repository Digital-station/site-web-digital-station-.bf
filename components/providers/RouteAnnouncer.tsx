'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

import { usePathname } from '@/i18n/routing';

/**
 * Announces route/locale changes to screen readers.
 *
 * Navigating between locales (LocaleToggle) and between pages both happen as
 * client-side transitions with `scroll: false`, so nothing tells assistive
 * tech that the content changed — only `<html lang>` updates. This mirrors
 * `document.title` into a visually-hidden `aria-live="polite"` region after
 * each transition so the new page/language gets announced the way a full
 * page load would.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const locale = useLocale();
  const liveRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Give next-intl/next/document a tick to update <title> before reading it.
    const id = window.setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = document.title;
    }, 100);
    return () => window.clearTimeout(id);
  }, [pathname, locale]);

  return <div ref={liveRef} role="status" aria-live="polite" className="sr-only" />;
}
