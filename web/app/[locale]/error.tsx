'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { site, mailHref } from '@/config/site.config';

/**
 * Error boundary for the localized routes.
 *
 * Verified against a deliberately throwing route: responds 500, renders in the
 * visitor's language, and shows the contact address from site.config, instead
 * of a bare Next.js error screen.
 *
 * Note the site chrome is only PARTLY retained in the server-rendered error
 * response — the locale layout's skip link, theme attribute and brand assets
 * are present, but <nav> and <footer> are not. Good enough for a page that
 * should be rare; worth revisiting if these errors ever become common.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errorPage');
  const tc = useTranslations('common');

  useEffect(() => {
    // Surfaced in the server logs (and in any error reporter added later).
    // `digest` is the only identifier shared with the visitor, so it is the
    // one thing that lets a support request be matched to a real stack trace.
    console.error('[error boundary]', error.digest ?? '(no digest)', error);
  }, [error]);

  return (
    <div className="min-h-svh flex items-center justify-center p-6 lg:pl-16">
      <div className="max-w-xl text-center">
        <span className="text-brand-accent font-mono text-sm uppercase tracking-[0.5em] block mb-6">
          {t('eyebrow')}
        </span>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">
          {t('title')}
        </h1>
        <p className="text-brand-muted text-lg mb-4 font-light">{t('body')}</p>
        <p className="text-brand-faint text-sm mb-12">
          {t('contactBody')}{' '}
          <a href={mailHref()} className="text-brand-accent underline underline-offset-4">
            {site.contact.email}
          </a>
          {error.digest ? (
            <>
              {' '}
              <span className="font-mono text-xs">({t('reference')}: {error.digest})</span>
            </>
          ) : null}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button type="button" onClick={reset} className="btn-primary flex items-center gap-3 w-full sm:w-auto justify-center">
            <RefreshCw className="w-4 h-4" />
            {t('retry')}
          </button>
          <Link href="/" className="btn-outline w-full sm:w-auto text-center">
            {t('home')}
          </Link>
        </div>

        {/* This boundary renders without the footer, so the site-wide promise
            has to be carried here explicitly. */}
        <p className="mt-10 text-xs md:text-sm text-brand-muted font-light">
          {tc('promise')}
        </p>
      </div>
    </div>
  );
}
