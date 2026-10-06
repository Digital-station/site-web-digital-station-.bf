import type { ReactNode } from 'react';
import { getFormatter, getTranslations } from 'next-intl/server';

import { site, mailHref } from '@/config/site.config';

/**
 * When the privacy and terms TEXT last changed (messages/*.json).
 *
 * This used to be `new Date()`, which stamped the build time, so the date
 * moved on every deploy while the policy stayed the same. A policy's date
 * tells visitors when its terms changed; bump this only when they do.
 * Format: YYYY-MM-DD.
 */
const LEGAL_UPDATED = '2026-10-06';

/**
 * Shared shell for the Privacy, Terms, Legal Notice and Cookies pages.
 *
 * A server component — these pages are static prose with one mailto link, so
 * they ship no JavaScript. The Vite versions wrapped everything in a Motion
 * fade, which cost a client bundle for a one-off entrance animation on a page
 * nobody scrolls for pleasure.
 */
export async function LegalPage({
  namespace,
  sectionKeys,
  values,
  footerSlot,
}: {
  namespace: 'privacy' | 'terms' | 'legal' | 'cookies';
  sectionKeys: readonly string[];
  /** Interpolated into every section's title/body — lets legal copy pull
   *  RCCM/IFU/capital/etc. from config/site.config.ts instead of being
   *  retyped into the message files. */
  values?: Record<string, string>;
  /** Rendered after the contact section — e.g. the "change your choice"
   *  control on /cookies. */
  footerSlot?: ReactNode;
}) {
  const t = await getTranslations(namespace);
  const format = await getFormatter();

  return (
    <div className="lg:pl-16 pt-36 md:pt-44 pb-20 md:pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.4em] block mb-6">
          {t('eyebrow')}
        </span>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
          {t.rich('title', { br: () => <br /> })}
        </h1>
        <p className="text-brand-faint text-sm mb-12">
          {/* The month is formatted from the active locale, so French reads
              "septembre 2026" and English "September 2026" without a hardcoded
              string per language. The date itself is LEGAL_UPDATED above.
              timeZone UTC: the constant is a calendar date, and formatting it
              in a zone behind UTC would show the previous day's month. */}
          {t('lastUpdated', {
            date: format.dateTime(new Date(`${LEGAL_UPDATED}T00:00:00Z`), {
              year: 'numeric',
              month: 'long',
              timeZone: 'UTC',
            }),
          })}
        </p>

        <div className="max-w-none space-y-8 text-brand-muted font-light leading-relaxed">
          {sectionKeys.map((key, i) => (
            <section key={key}>
              <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-brand-text">
                {i + 1}. {t(`sections.${key}.title`, values)}
              </h2>
              <p>{t(`sections.${key}.body`, values)}</p>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-brand-text">
              {sectionKeys.length + 1}. {t('contactTitle')}
            </h2>
            <p>
              {t('contactBody')}{' '}
              {/* Reads from config. The Vite privacy page printed
                  "info@digitalstation.bf" — missing the "s" — so the address
                  people were told to write to for data requests did not exist. */}
              <a
                href={mailHref()}
                className="text-brand-accent underline underline-offset-4"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </section>
          {footerSlot}
        </div>
      </div>
    </div>
  );
}
