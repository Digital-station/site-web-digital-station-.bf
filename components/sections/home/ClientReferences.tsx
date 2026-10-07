import type { CSSProperties } from 'react';
import { MapPin, Quote } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { Container } from '@/components/layout/Container';
import { REFERENCES } from '@/content/references';

/**
 * "Ils nous font confiance" — client logos/monograms and a few testimonials.
 *
 * NOT RENDERED YET. The home page keeps its import and usage commented out
 * until Digital Station has real customers to name (README › Client
 * references). `content/references.ts` holds fictional Burkinabè samples so
 * the layout can be reviewed in the meantime.
 *
 * A server component — no interactivity, so it ships zero JS. The scroll
 * reveal is `data-rv` (see RevealRoot), staggered across the logo grid.
 */

/** "Clinique Wendpanga" → "CW"; "Hôtel Les Manguiers" → "HL". */
function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export async function ClientReferences() {
  const t = await getTranslations('home.references');

  const testimonials = REFERENCES.filter((r) => r.hasTestimonial);

  return (
    <section
      id="references"
      aria-labelledby="home-references-heading"
      className="lg:pl-16 border-t border-brand-border py-24 lg:py-32 overflow-hidden"
    >
      <Container>
        <div data-rv className="max-w-3xl mb-12 md:mb-16">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold">
            {t('eyebrow')}
          </p>
          <h2
            id="home-references-heading"
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.15] mb-6 text-balance break-words"
          >
            {t.rich('title', {
              accent: (chunks) => (
                <span className="text-brand-accent italic font-serif font-light lowercase">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p className="text-brand-muted text-base md:text-lg leading-relaxed">
            {t('body')}
          </p>
        </div>

        {/* Logo wall. Monogram fallback keeps the grid even when a client has
            not sent a logo yet, which is the common case at signing time. */}
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {REFERENCES.map((r, i) => (
            <li
              key={r.id}
              data-rv
              style={{ '--rv-delay': `${Math.min(i * 0.06, 0.4)}s` } as CSSProperties}
              className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col items-center text-center gap-3 hover:border-brand-accent/50 transition-colors"
            >
              {r.logo ? (
                <Image
                  src={r.logo}
                  alt={r.name}
                  width={120}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="h-12 w-12 rounded-full bg-brand-accent/15 text-brand-accent font-black text-lg flex items-center justify-center"
                >
                  {monogram(r.name)}
                </span>
              )}
              <span className="text-sm font-bold uppercase tracking-tight text-balance">
                {r.name}
              </span>
              <span className="text-[11px] text-brand-muted flex flex-wrap items-center justify-center gap-x-1">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                <span>{r.city}</span>
                <span aria-hidden="true">·</span>
                <span>{t(`sectors.${r.sector}`)}</span>
              </span>
            </li>
          ))}
        </ul>

        {testimonials.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h3 className="sr-only">{t('testimonialsTitle')}</h3>
            <ul className="grid md:grid-cols-3 gap-6">
              {testimonials.map((r, i) => (
                <li
                  key={r.id}
                  data-rv
                  style={{ '--rv-delay': `${0.1 + i * 0.1}s` } as CSSProperties}
                  className="bg-brand-surface border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-6"
                >
                  <Quote className="w-6 h-6 text-brand-accent" aria-hidden="true" />
                  <blockquote className="text-base md:text-lg leading-relaxed flex-1">
                    {t(`items.${r.id}.quote`)}
                  </blockquote>
                  <footer className="text-sm">
                    <span className="block font-bold">{t(`items.${r.id}.author`)}</span>
                    <span className="block text-brand-muted">
                      {t(`items.${r.id}.role`)}, {r.name}
                    </span>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
