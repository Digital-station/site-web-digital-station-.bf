'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { Link } from '@/i18n/routing';
import { SOLUTIONS } from '@/content/solutions';
import { Container } from '@/components/layout/Container';
import { ProductPreviewModal } from './ProductPreviewModal';
import { SOLUTIONS_INTERACTIVE_DATA, type ProductDetail } from '@/content/solutions-data';

export function SolutionsContent() {
  const t = useTranslations('solutions');
  const ti = useTranslations('solutions.items');
  const locale = useLocale() as 'fr' | 'en';
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);

  const handleOpenPreview = (id: string) => {
    const data = SOLUTIONS_INTERACTIVE_DATA[id]?.[locale] || SOLUTIONS_INTERACTIVE_DATA[id]?.fr;
    if (data) {
      setSelectedProduct(data);
    }
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
                    priority={i === 0}
                    className="object-cover transition-all duration-700 lg:grayscale lg:opacity-60 lg:group-hover:grayscale-0 lg:group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-brand-primary/20" />
                  
                  {/* Overlay button to trigger interactive preview directly on image */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(s.id)}
                      className="px-5 py-2.5 rounded-full bg-brand-accent text-brand-on-accent text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Aperçu Interactif</span>
                    </button>
                  </div>
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

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(s.id)}
                      className="btn-outline inline-flex items-center gap-2.5 px-5 py-3 text-xs uppercase font-bold tracking-wider hover:border-brand-accent"
                    >
                      <Eye className="w-4 h-4 text-brand-accent" />
                      <span>Aperçu des Écrans</span>
                    </button>

                    <Link
                      href={`/contact?product=${s.id}`}
                      aria-label={`${t('cta')} — ${t('ctaAria', { name })}`}
                      className="btn-primary inline-flex items-center gap-2.5 px-5 py-3 text-xs uppercase font-bold tracking-wider"
                    >
                      <span>{t('cta')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>

      {/* Interactive Modal */}
      <ProductPreviewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
