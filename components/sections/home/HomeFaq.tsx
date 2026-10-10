import { getTranslations } from 'next-intl/server';
import { HelpCircle } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { HOME_FAQ_KEYS } from '@/content/faq';

/**
 * Home-page FAQ. A server component: plain <details> disclosures, zero JS.
 *
 * The questions are phrased the way people actually ask search engines and
 * AI assistants ("quelle agence pour créer un site web à Ouagadougou ?",
 * "qui peut implémenter Odoo au Burkina Faso ?"), and the same pairs feed
 * the FAQPage JSON-LD in app/[locale]/page.tsx, so the answer a crawler
 * reads is the one a visitor sees.
 */
export async function HomeFaq() {
  const t = await getTranslations('home.faq');

  return (
    <section
      id="faq"
      className="lg:pl-16 border-t border-brand-border py-24 lg:py-32"
    >
      <Container data-rv>
        <div className="grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">
          <div>
            <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
              {t('eyebrow')}
            </p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.15] text-balance break-words mb-6">
              {t.rich('title', {
                accent: (chunks) => (
                  <span className="text-brand-accent italic font-serif font-light lowercase">
                    {chunks}
                  </span>
                ),
              })}
            </h2>
            <p className="text-brand-muted text-sm md:text-base font-light leading-relaxed max-w-md">
              {t('intro')}
            </p>
          </div>

          <div className="divide-y divide-brand-border border-y border-brand-border">
            {HOME_FAQ_KEYS.map((key) => (
              <details key={key} className="group py-5">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base md:text-lg font-bold leading-snug">
                    {t(`items.${key}.q`)}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 mt-1 w-6 h-6 rounded-full border border-brand-border flex items-center justify-center text-brand-accent transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pt-3 pr-12 text-brand-muted text-sm md:text-base font-light leading-relaxed">
                  {t(`items.${key}.a`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
