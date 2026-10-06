'use client';

import { useTranslations } from 'next-intl';

import { resetStoredConsent } from '@/components/ui/CookieConsent';

/**
 * The right-of-withdrawal control on /cookies. Clears the stored decision
 * and re-opens CookieConsent — a link-only "clear your browser settings"
 * instruction is not a real withdrawal mechanism.
 */
export function CookieSettingsButton() {
  const t = useTranslations('cookies');

  return (
    <button
      type="button"
      onClick={resetStoredConsent}
      className="btn-outline px-5 py-3 text-xs uppercase font-bold tracking-wider"
    >
      {t('manageButton')}
    </button>
  );
}
