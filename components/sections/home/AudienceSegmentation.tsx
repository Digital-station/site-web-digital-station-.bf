'use client';

import { motion } from 'motion/react';
import { Building2, Globe2, Landmark, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function AudienceSegmentation() {
  const SEGMENTS = [
    {
      id: 'regional-b2b',
      icon: Building2,
      badge: 'Entreprises & PME Régionales',
      title: 'Accélérez vos opérations locales',
      description: 'Déploiement ERP (Odoo), digitalisation des points de vente, infogérance continue et automatisation administrative avec présence physique à Ouagadougou.',
      highlights: ['Support de proximité en direct', 'Solutions hors-ligne & Mobile Money', 'Facturation & fiscalité conformes'],
      link: '/services',
      cta: 'Explorer nos solutions d\'entreprise',
    },
    {
      id: 'nearshore',
      icon: Globe2,
      badge: 'Partenaires Internationaux & Diaspora',
      title: 'Votre Hub d\'Ingénierie Nearshore',
      description: 'Équipes de développement dédiées, anglophones et francophones, sur le fuseau horaire GMT+0. Des compétences pointues aux meilleurs standards mondiaux.',
      highlights: ['Alignement fuseau GMT (Europe/Afrique)', 'Ingénieurs bilingues certifiés', 'Contrats & NDA internationaux'],
      link: '/contact',
      cta: 'Échanger avec notre direction technique',
    },
    {
      id: 'public-ngo',
      icon: Landmark,
      badge: 'Institutions & Secteur Public / ONG',
      title: 'Souveraineté des données & Sécurité',
      description: 'Développement de systèmes d’information critiques, plateformes citoyennes, conformité stricte et audits de cybersécurité pour organisations exigeantes.',
      highlights: ['Souveraineté & hébergement local/cloud', 'Traçabilité & audits de conformité', 'Pérénité des systèmes déployés'],
      link: '/services/cybersecurite-conformite',
      cta: 'Découvrir le pôle Gouvernance & SI',
    },
  ];

  return (
    <section className="py-20 lg:py-24 border-t border-brand-border bg-brand-primary/40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <p className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest mb-3">
            Accompagnement Sur-Mesure
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-balance">
            Des réponses précises selon vos enjeux
          </h2>
          <p className="text-brand-muted text-sm sm:text-base font-light mt-3">
            Que vous dirigiez une PME en pleine expansion, une institution publique ou un groupe international, nos méthodologies s’adaptent à votre réalité.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {SEGMENTS.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-surface border border-brand-border rounded-2xl p-7 flex flex-col justify-between hover:border-brand-accent/50 transition-all group shadow-card"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary border border-brand-border flex items-center justify-center text-brand-accent group-hover:scale-110 group-hover:border-brand-accent transition-all">
                  <s.icon className="w-6 h-6" />
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-accent font-bold">
                  {s.badge}
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight text-brand-text">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                  {s.description}
                </p>

                <ul className="space-y-2 pt-3 border-t border-brand-border/60">
                  {s.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-brand-text font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-border/60">
                <Link
                  href={s.link}
                  className="text-xs uppercase font-mono font-bold tracking-wider text-brand-text group-hover:text-brand-accent flex items-center justify-between"
                >
                  <span>{s.cta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
