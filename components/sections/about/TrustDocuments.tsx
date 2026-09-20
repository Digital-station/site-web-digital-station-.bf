'use client';

import { Download, FileText, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function TrustDocuments() {
  const DOCS = [
    {
      id: 'capabilities',
      title: 'Dossier de Présentation & Capacités Techniques',
      subtitle: 'Company Profile & Capabilities Deck (PDF)',
      desc: 'Présentation complète de notre organisation, méthodologies d’ingénierie, stack technologique et produits éditeurs.',
      size: '1.2 Mo • Version 2026',
      href: '/docs/digital-station-capabilities-deck.pdf',
      badge: 'Officiel',
    },
    {
      id: 'nda',
      title: 'Accord de Confidentialité Type (Mutual NDA)',
      subtitle: 'Standard Non-Disclosure Agreement (PDF)',
      desc: 'Modèle d’engagement de confidentialité mutuel protégeant vos données sensibles, codes sources et concepts avant tout cadrage.',
      size: '280 Ko • Bilingue FR/EN',
      href: '/docs/digital-station-mutual-nda.pdf',
      badge: 'Protection Juridique',
    },
  ];

  return (
    <section className="py-16 border-t border-brand-border bg-brand-primary/40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-brand-accent text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparence & Documents Contractuels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-balance">
              Documents d'entreprise en libre accès
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md font-light">
            Téléchargez nos documents officiels pour instruire vos comités d'achat ou cadrer immédiatement nos échanges sous protection juridique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {DOCS.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col justify-between hover:border-brand-accent/50 transition-all group shadow-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-brand-accent-soft text-brand-accent border border-brand-accent/30 font-bold">
                    {doc.badge}
                  </span>
                  <span className="text-xs font-mono text-brand-muted">
                    {doc.size}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent shrink-0 group-hover:scale-110 group-hover:border-brand-accent transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-tight text-brand-text group-hover:text-brand-accent transition-colors">
                      {doc.title}
                    </h3>
                    <div className="text-xs text-brand-faint font-mono mt-0.5">
                      {doc.subtitle}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-brand-muted font-light leading-relaxed pt-1">
                  {doc.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-brand-border/60">
                <a
                  href={doc.href}
                  download
                  className="btn-outline w-full py-3 text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 group-hover:border-brand-accent group-hover:text-brand-accent"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le document (PDF)</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
