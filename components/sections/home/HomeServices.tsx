import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { SERVICES } from '@/content/services';
import { getServiceIcon } from '@/lib/service-icons';

/**
 * Service catalogue grid. A server component — no interactivity, so it ships
 * zero JS. The scroll reveal is `data-rv` (see RevealRoot), staggered down
 * the grid the way the old GSAP tween was.
 */
export async function HomeServices() {
  const ts = await getTranslations('services.items');
  const t = await getTranslations('home.services');
  const tn = await getTranslations('nav');

  return (
    <section
      id="services"
      aria-labelledby="home-services-heading"
      className="lg:pl-16 border-t border-brand-border overflow-hidden"
    >
      {/*
        The grid used to open straight onto <h3> cards with no <h2> above them,
        so the document outline jumped a level. Visually hidden rather than
        rendered: the cards themselves are the section's visual heading.
      */}
      <h2 id="home-services-heading" className="sr-only">
        {tn('servicesEyebrow')}
      </h2>

      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = getServiceIcon(s.slug);
            const title = ts(`${s.slug}.title`);

            return (
              <div
                key={s.slug}
                data-rv
                style={{ '--rv-delay': `${Math.min(i * 0.06, 0.4)}s` } as CSSProperties}
                className="group p-6 sm:p-8 md:p-10 lg:p-14 border-r border-b border-brand-border hover:bg-brand-accent-soft transition-all duration-500 relative h-full flex flex-col"
              >
                <Icon className="w-5 h-5 md:w-8 md:h-8 text-brand-accent mb-4 md:mb-8 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />

                <span className="absolute top-4 right-6 sm:top-8 sm:right-8 md:top-10 md:right-10 font-mono text-[11px] md:text-xs text-brand-muted">
                  {s.num}
                </span>

                <div className="flex items-start justify-between gap-4 mb-2 sm:mb-0">
                  {/*
                    No `line-clamp`, no `hyphens-auto`: the French titles are
                    longer than the English ones and were being cut mid-word,
                    which is worse than a taller card. `text-balance` evens the
                    lines out and the card grows to fit.
                  */}
                  <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-black uppercase leading-[1.15] group-hover:text-brand-accent transition-colors text-balance break-words sm:mb-4 md:mb-6">
                    {title}
                  </h3>
                  {/* Mobile-only arrow, inline with the title */}
                  <Link
                    href={`/services/${s.slug}`}
                    aria-label={t('learnMore', { service: title })}
                    className="h-11 w-11 sm:hidden rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-brand-accent-strong text-brand-on-accent transition-transform hover:scale-110"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="hidden sm:block text-brand-muted text-[11px] md:text-sm leading-relaxed mb-6 md:mb-10 flex-1 font-light">
                  {ts(`${s.slug}.desc`)}
                </p>

                <Link
                  href={`/services/${s.slug}`}
                  aria-label={t('learnMore', { service: title })}
                  className="hidden sm:flex h-11 w-11 md:h-12 md:w-12 rounded-full items-center justify-center overflow-hidden self-start mt-auto bg-brand-accent-strong text-brand-on-accent transition-transform hover:scale-110"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
