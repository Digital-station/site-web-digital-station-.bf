import { getTranslations } from 'next-intl/server';
import { Home } from 'lucide-react';

import { Link } from '@/i18n/routing';
import { site } from '@/config/site.config';

/**
 * Localized 404, rendered inside the locale layout — so it keeps the navbar,
 * footer and the visitor's language, unlike the bare root-level not-found.
 *
 * A server component. The Vite version had a "Go Back" button calling
 * `window.history.back()`, which is dropped: it needed a client bundle for a
 * control that duplicates the browser's own back button, and it can send
 * someone straight back to the broken link they just came from.
 */
export default async function LocaleNotFound() {
  const t = await getTranslations('notFound');

  /**
   * `not-found.tsx` cannot export `generateMetadata`, so the tab title has to
   * be rendered as an element — React 19 hoists a <title> from anywhere in the
   * tree into <head>. Without it every 404 inherits the layout's default
   * title and reads as a real page in browser history and in a share preview.
   *
   * `t.markup` rather than `t`, because the heading message carries a <br>
   * for its line break and a <title> must be plain text.
   */
  const documentTitle = t.markup('title', { br: () => ' ' });

  return (
    <div className="min-h-svh flex items-center justify-center p-6 lg:pl-16 relative overflow-hidden">
      <title>{`${documentTitle} | ${site.name}`}</title>
      <div className="max-w-xl text-center relative z-10">
        <span className="text-brand-accent font-mono text-sm uppercase tracking-[0.5em] block mb-6">
          {t('code')}
        </span>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8">
          {t.rich('title', { br: () => <br /> })}
        </h1>
        <p className="text-brand-muted text-lg mb-12 font-light">{t('body')}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/"
            className="btn-primary group flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            {t('ctaHome')}
          </Link>
          <Link
            href="/services"
            className="btn-outline flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            {t('ctaServices')}
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-brand-faint/10 pointer-events-none select-none italic"
      >
        404
      </div>
    </div>
  );
}
