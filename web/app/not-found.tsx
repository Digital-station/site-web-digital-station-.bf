import Link from 'next/link';
import { site } from '@/config/site.config';
import fr from '@/messages/fr.json';
import en from '@/messages/en.json';
import { fontVariables } from '@/lib/fonts';
import { ThemeScript } from '@/components/providers/ThemeProvider';
import './globals.css';

/**
 * Root-level 404, for requests that never reach the locale proxy
 * (a malformed path, or a file-like URL the matcher skips).
 *
 * It carries its own <html>/<body> because the root layout is a pass-through,
 * and it is deliberately BILINGUAL: there is no locale segment here, so there
 * is no way to know which language the visitor reads. Anything inside a
 * locale renders app/[locale]/not-found.tsx instead, which is localized and
 * keeps the site chrome.
 */
export default function NotFound() {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <title>{`Page introuvable / Page not found | ${site.name}`}</title>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-brand-primary px-6 text-center">
          <p className="font-mono text-sm tracking-[0.3em] text-brand-accent">404</p>
          <h1 className="type-display">Page introuvable</h1>
          <p className="max-w-md text-brand-muted">
            Cette page n&apos;existe pas ou a été déplacée.
            <br />
            {/* lang="en" so screen readers switch voice for the English half. */}
            <span lang="en" className="text-brand-faint">
              This page does not exist or has moved.
            </span>
          </p>
          {/*
            The label used to be the company name, which reads as a logo, not
            as an action — the one control on the page did not say what it did.
          */}
          <Link href="/fr" className="btn-primary">
            Retour à l&apos;accueil / <span lang="en">Back to home</span>
          </Link>
          {/* No layout, so no footer: the site-wide promise is rendered here,
              read from the message files so the wording cannot drift. */}
          <p className="text-xs md:text-sm text-brand-muted font-light">
            {fr.common.promise} / <span lang="en">{en.common.promise}</span>
          </p>
        </main>
      </body>
    </html>
  );
}
