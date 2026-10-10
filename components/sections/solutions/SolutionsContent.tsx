'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { SOLUTIONS, SOLUTIONS_PER_PAGE } from '@/content/solutions';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

const PAGE_COUNT = Math.ceil(SOLUTIONS.length / SOLUTIONS_PER_PAGE);

export function SolutionsContent() {
  const t = useTranslations('solutions');
  const ti = useTranslations('solutions.items');
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = SOLUTIONS.slice(
    (page - 1) * SOLUTIONS_PER_PAGE,
    page * SOLUTIONS_PER_PAGE,
  );
  // Empty cells keep the last, shorter page on the same three-column grid
  // instead of letting the grid's border-coloured background show through.
  const fillers = SOLUTIONS_PER_PAGE - visible.length;

  const goTo = (next: number) => {
    if (next < 1 || next > PAGE_COUNT || next === page) return;
    setPage(next);
    // The pager sits below the cards: bring the new page's first card back
    // into view when the top of the list has scrolled off screen.
    const top = listRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="lg:pl-16 pt-32 md:pt-44 pb-24 lg:pb-32">
      <Container>
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 md:mb-8 font-mono font-bold flex items-center gap-2 justify-center md:justify-start">
            <Sparkles className="w-3.5 h-3.5" />
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

        <div
          ref={listRef}
          className="scroll-mt-32 grid md:grid-cols-3 gap-px bg-brand-border border border-brand-border overflow-hidden rounded-2xl md:rounded-[2rem]"
        >
          {visible.map((s) => {
            const name = ti(`${s.id}.name`);
            const tags = Array.from({ length: s.tagCount }, (_, i) =>
              ti(`${s.id}.tags.${i}`),
            );
            const features = Array.from({ length: s.featureCount }, (_, i) =>
              ti(`${s.id}.features.${i}`),
            );

            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-brand-primary p-6 sm:p-8 lg:p-10 flex flex-col"
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] uppercase font-bold tracking-wide text-brand-accent border border-brand-accent/40 px-3 py-1 rounded-full shrink-0"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl md:text-3xl font-black uppercase mb-3 leading-[1.15] break-words">
                  {name}
                </h2>
                <p className="text-base md:text-lg font-black italic mb-4 leading-tight text-brand-muted">
                  {ti(`${s.id}.tagline`)}
                </p>
                <p className="text-brand-muted text-sm md:text-base mb-6 leading-relaxed font-light">
                  {ti(`${s.id}.desc`)}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm leading-snug">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-brand-accent" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact?product=${s.id}`}
                  aria-label={t('ctaAria', { name })}
                  className="btn-primary mt-auto self-start inline-flex items-center gap-2.5 px-5 py-3 text-xs uppercase font-bold tracking-wider"
                >
                  <span>{t('cta')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.article>
            );
          })}
          {Array.from({ length: fillers }, (_, i) => (
            <div key={`filler-${i}`} aria-hidden className="hidden md:block bg-brand-primary" />
          ))}
        </div>

        {PAGE_COUNT > 1 && (
          <nav
            aria-label={t('pagination.label')}
            className="mt-8 flex flex-wrap items-center justify-end gap-3"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-brand-muted mr-2" aria-live="polite">
              {t('pagination.status', { page, total: PAGE_COUNT })}
            </p>
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              aria-label={t('pagination.previous')}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-brand-border hover:border-brand-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: PAGE_COUNT }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goTo(n)}
                aria-label={t('pagination.page', { page: n })}
                aria-current={n === page ? 'page' : undefined}
                className={cn(
                  'w-10 h-10 inline-flex items-center justify-center rounded-full border text-sm font-bold transition-colors',
                  n === page
                    ? 'bg-brand-accent-strong border-brand-accent-strong text-brand-on-accent'
                    : 'border-brand-border hover:border-brand-accent',
                )}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page === PAGE_COUNT}
              aria-label={t('pagination.next')}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-brand-border hover:border-brand-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </Container>
    </div>
  );
}
