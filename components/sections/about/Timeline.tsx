'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Brain,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/layout/Container';

const MILESTONE_KEYS = ['2018', '2019', '2021', '2023', '2024', '2025', '2026'] as const;
const MILESTONE_ICONS: LucideIcon[] = [
  Rocket,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Brain,
  Zap,
];

/**
 * Preserved component, ready for activation — moved out of AboutContent.tsx
 * (now a server component) because this still needs a real client boundary:
 * Next's RSC compiler rejects a server file that merely IMPORTS useRef /
 * useInView, even for a function that is never called. Re-activating this
 * means uncommenting `<Timeline />` in AboutContent.tsx; the internal
 * useInView/motion.li animation is untouched from before that move.
 */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const t = useTranslations('about.timeline');

  return (
    <section
      ref={ref}
      className="lg:pl-16 border-t border-brand-border py-24 lg:py-32 overflow-hidden"
    >
      <Container>
        <div className="mb-14 md:mb-20">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold flex items-center gap-2">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.15] text-balance break-words">
            {t.rich('title', {
              accent: (chunks) => (
                <span className="text-brand-accent italic font-serif font-light lowercase">
                  {chunks}
                </span>
              ),
            })}
          </h2>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 h-px bg-brand-border hidden md:block"
          />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10">
            {MILESTONE_KEYS.map((year, i) => {
              const Icon = MILESTONE_ICONS[i];
              return (
                <motion.li
                  key={year}
                  className="relative"
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div className="w-12 h-12 rounded-full border border-brand-border bg-brand-primary flex items-center justify-center mb-5 relative z-10">
                    <Icon className="w-5 h-5 text-brand-accent" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-2">
                    {year}
                  </h3>
                  <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-light">
                    {t(`items.${year}`)}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
