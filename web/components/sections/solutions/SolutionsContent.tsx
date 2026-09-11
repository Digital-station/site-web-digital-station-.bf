'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { SOLUTIONS } from '@/content/solutions';
import { Container } from '@/components/layout/Container';

export function SolutionsContent() {
  const t = useTranslations('solutions');
  const ti = useTranslations('solutions.items');

  return (
    <div className="lg:pl-16 pt-32 md:pt-44 pb-24 lg:pb-32">
      <Container>
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 md:mb-8 font-mono font-bold">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.15] mb-8 md:mb-12 text-balance break-words">
            {t.rich('title', {
              br: () => <br />,
              accent: (chunks) => <span className="text-brand-accent">{chunks}</span>,
            })}
          </h1>
          <p className="text-brand-muted text-base md:text-xl max-w-2xl font-light mx-auto md:mx-0">
            {t('intro')}
          </p>
        </div>

        <div className="grid gap-px bg-brand-border border border-brand-border overflow-hidden rounded-2xl md:rounded-[2rem]">
          {SOLUTIONS.map((s, i) => {
            const name = ti(`${s.id}.name`);
            const tags = Array.from({ length: s.tagCount }, (_, ti2) =>
              ti(`${s.id}.tags.${ti2}`),
            );

            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-brand-primary group grid md:grid-cols-2 overflow-hidden"
              >
                <div className="relative aspect-video md:aspect-auto md:min-h-[22rem] overflow-hidden order-last md:order-first border-t md:border-t-0 border-brand-border">
                  <Image
                    src={s.image}
                    alt={`${name} — ${ti(`${s.id}.tagline`)}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    /* Above-the-fold on first paint, so the first card's
                       image is eager; the rest stay lazy. */
                    priority={i === 0}
                    className="object-cover transition-all duration-700 lg:grayscale lg:opacity-60 lg:group-hover:grayscale-0 lg:group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-brand-primary/20" />
                </div>

                <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] md:text-xs uppercase font-bold tracking-wide text-brand-accent border border-brand-accent/40 px-3 py-1 rounded-full shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-4xl font-black uppercase mb-4 md:mb-6 leading-[1.15] text-balance break-words">
                    {name}
                  </h2>
                  <p className="text-lg md:text-xl font-black italic mb-4 md:mb-6 leading-tight text-brand-muted">
                    {ti(`${s.id}.tagline`)}
                  </p>
                  <p className="text-brand-muted text-sm md:text-base mb-8 md:mb-12 leading-relaxed font-light">
                    {ti(`${s.id}.desc`)}
                  </p>

                  {/*
                    "Demander une démo" now carries WHICH product to the contact
                    form (`?product=<slug>`), so the visitor does not have to
                    retype it. The Vite build sent every card to a bare
                    /contact and labelled it "Read Full Transformation".
                  */}
                  <Link
                    href={`/contact?product=${s.id}`}
                    aria-label={`${t('cta')} — ${t('ctaAria', { name })}`}
                    className="inline-flex items-center gap-3 font-bold uppercase tracking-wide text-[11px] md:text-xs group-hover:gap-6 transition-all duration-300 min-h-11 self-start"
                  >
                    {t('cta')}
                    <ArrowRight className="text-brand-accent w-4 h-4 md:w-5 md:h-5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
