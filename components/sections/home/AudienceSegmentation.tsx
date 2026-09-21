import type { CSSProperties } from 'react';
import { Building2, Globe2, Landmark, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';

/**
 * Audience segmentation — structure lives here, ALL prose lives in
 * messages under `home.segments`, so the section renders in both
 * languages like every other part of the site.
 *
 * A server component: the old Motion `whileInView` fade is `data-rv`
 * (see RevealRoot), so this ships zero JS.
 */
const SEGMENT_IDS = ['regional', 'nearshore', 'public'] as const;
const SEGMENT_ICONS = [Building2, Globe2, Landmark] as const;
const SEGMENT_LINKS = ['/services', '/contact', '/services/cybersecurite-conformite'] as const;

export async function AudienceSegmentation() {
  const t = await getTranslations('home.segments');
  const ti = await getTranslations('home.segments.items');

  return (
    <section className="py-20 lg:py-24 border-t border-brand-border bg-brand-primary/40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-balance">
            {t('title')}
          </h2>
          <p className="text-brand-muted text-sm sm:text-base font-light mt-3">
            {t('intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {SEGMENT_IDS.map((id, idx) => {
            const Icon = SEGMENT_ICONS[idx];
            return (
              <div
                key={id}
                data-rv
                style={{ '--rv-delay': `${idx * 0.1}s` } as CSSProperties}
                className="bg-brand-surface border border-brand-border rounded-2xl p-7 flex flex-col justify-between hover:border-brand-accent/50 transition-all group shadow-card"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent group-hover:scale-110 group-hover:border-brand-accent transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-[11px] font-mono uppercase tracking-wider text-brand-accent font-bold">
                    {ti(`${id}.badge`)}
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-brand-text">
                    {ti(`${id}.title`)}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                    {ti(`${id}.description`)}
                  </p>

                  <ul className="space-y-2 pt-3 border-t border-brand-border/60">
                    {(ti.raw(`${id}.highlights`) as unknown as string[]).map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-brand-text font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-brand-border/60">
                  <Link
                    href={SEGMENT_LINKS[idx]}
                    className="text-xs uppercase font-mono font-bold tracking-wider text-brand-text group-hover:text-brand-accent flex items-center justify-between"
                  >
                    <span>{ti(`${id}.cta`)}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
