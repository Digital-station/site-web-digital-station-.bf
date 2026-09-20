'use client';

import { Download, FileText, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations, useLocale } from 'next-intl';

export type TrustDocSizes = { capabilities: number; nda: number };

/**
 * Downloadable company documents.
 *
 * The size line is derived from the REAL file on disk (passed in by the
 * server-rendered page) and can therefore never overstate what the visitor
 * downloads — the previous build advertised "1.2 Mo" for a 1 Ko stub.
 * All prose lives in messages under `about.trust`.
 */
export function TrustDocuments({ sizes }: { sizes: TrustDocSizes }) {
  const t = useTranslations('about.trust');
  const locale = useLocale();

  const fmt = (bytes: number): string => {
    const kb = bytes / 1024;
    if (kb < 1024) {
      const n = Math.max(1, Math.round(kb));
      return locale === 'fr' ? `${n} Ko` : `${n} KB`;
    }
    const mo = (kb / 1024).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
      maximumFractionDigits: 1,
    });
    return locale === 'fr' ? `${mo} Mo` : `${mo} MB`;
  };

  const DOCS = [
    {
      id: 'capabilities',
      title: t('capabilities.title'),
      subtitle: t('capabilities.subtitle'),
      desc: t('capabilities.desc'),
      size: `${fmt(sizes.capabilities)} • ${t('version')}`,
      href: '/docs/digital-station-capabilities-deck.pdf',
      badge: t('capabilities.badge'),
    },
    {
      id: 'nda',
      title: t('nda.title'),
      subtitle: t('nda.subtitle'),
      desc: t('nda.desc'),
      size: `${fmt(sizes.nda)} • ${t('version')}`,
      href: '/docs/digital-station-mutual-nda.pdf',
      badge: t('nda.badge'),
    },
  ];

  return (
    <section className="py-16 border-t border-brand-border bg-brand-primary/40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-brand-accent text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('eyebrow')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-balance">
              {t('title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md font-light">{t('intro')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {DOCS.map((doc, idx) => (
            <motion.a
              key={doc.id}
              href={doc.href}
              download
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-7 flex flex-col gap-4 hover:border-brand-accent/50 transition-all shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent group-hover:border-brand-accent transition-all shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-accent-soft text-brand-accent border border-brand-accent/30">
                  {doc.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-brand-text">
                  {doc.title}
                </h3>
                <p className="text-[11px] font-mono text-brand-muted mt-1">{doc.subtitle}</p>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                {doc.desc}
              </p>

              <div className="pt-4 mt-auto border-t border-brand-border/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-brand-muted">{doc.size}</span>
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-text group-hover:text-brand-accent transition-colors">
                  PDF
                  <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
