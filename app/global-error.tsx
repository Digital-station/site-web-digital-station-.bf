'use client';

import { useEffect } from 'react';

import { fontVariables } from '@/lib/fonts';
import './globals.css';

/**
 * Same text as `common.promise` in messages/fr.json and messages/en.json —
 * keep them in sync. Written out rather than imported: this is a client
 * component, and importing the message files would ship both of them (~85 KB)
 * in its bundle for the sake of two short strings.
 */
const PROMISE = {
  fr: 'Devis gratuit · réponse sous 24 h',
  en: 'Free quote · reply within 24 h',
} as const;

/**
 * Last-resort error boundary.
 *
 * This fires only when the ROOT layout itself fails, which means no provider
 * has mounted: no translations, no theme context, no navbar. It therefore
 * renders its own <html>/<body> and cannot use next-intl — so the copy here
 * is bilingual by hand rather than translated, since the visitor's language
 * is unknowable at this point.
 *
 * Everything else is caught by app/[locale]/error.tsx, which keeps the site
 * chrome and the visitor's language.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error]', error.digest ?? '(no digest)', error);
  }, [error]);

  return (
    <html lang="fr" data-theme="dark" className={fontVariables}>
      <body>
        <main className="min-h-svh flex items-center justify-center p-6 text-center">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-6">
              Une erreur est survenue
            </h1>
            <p className="text-brand-muted mb-2">
              Le site a rencontré un problème inattendu. Réessayez dans un instant.
            </p>
            {/* lang="en" so screen readers switch voice for the English half. */}
            <p lang="en" className="text-brand-faint text-sm mb-10">
              Something went wrong. Please try again in a moment.
            </p>
            {error.digest ? (
              <p className="font-mono text-xs text-brand-faint mb-8">
                Réf. / <span lang="en">Ref</span>: {error.digest}
              </p>
            ) : null}
            <button type="button" onClick={reset} className="btn-primary">
              Réessayer / <span lang="en">Retry</span>
            </button>
            {/* No footer at this level, so the site-wide promise is rendered
                here. */}
            <p className="mt-10 text-xs md:text-sm text-brand-muted font-light">
              {PROMISE.fr} / <span lang="en">{PROMISE.en}</span>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
