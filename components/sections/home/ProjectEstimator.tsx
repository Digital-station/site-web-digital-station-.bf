'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type ProjectType = 'web-app' | 'mobile-app' | 'erp-odoo' | 'cloud-devops' | 'audit-security';

interface StepOption {
  id: string;
  label: string;
  desc: string;
  baseDays: number;
}

const PROJECT_TYPES: { id: ProjectType; title: string; subtitle: string; icon: string }[] = [
  { id: 'web-app', title: 'Application Web & SaaS', subtitle: 'Portails métiers, dashboards, plateformes clients', icon: '💻' },
  { id: 'mobile-app', title: 'Application Mobile', subtitle: 'iOS & Android haute performance (Flutter/React Native)', icon: '📱' },
  { id: 'erp-odoo', title: 'Intégration ERP & Odoo', subtitle: 'Gestion commerciale, comptabilité, CRM & Stocks', icon: '⚙️' },
  { id: 'cloud-devops', title: 'Infrastructure Cloud & DevOps', subtitle: 'AWS, Docker/Kubernetes, CI/CD & Supervision', icon: '☁️' },
  { id: 'audit-security', title: 'Cybersécurité & Audit SI', subtitle: 'Tests d’intrusion, conformité des données & PCA', icon: '🛡️' },
];

const COMPLEXITY_LEVELS = [
  { id: 'mvp', label: 'Prototype / MVP Rapide', desc: 'Fonctionnalités essentielles pour valider le marché rapidement', multiplier: 1, weeks: '3 à 5 semaines' },
  { id: 'standard', label: 'Système Métier Complet', desc: 'Architecture évolutive, intégrations API, back-office avancé', multiplier: 1.8, weeks: '6 à 10 semaines' },
  { id: 'enterprise', label: 'Plateforme Haute Disponibilité', desc: 'Multi-rôles, redondance, cluster base de données, SLA 99.9%', multiplier: 3, weeks: '10 à 16 semaines' },
];

const DELIVERABLES_OPTIONS = [
  { id: 'source-code', label: '100% Cession Propriété & Code Source Git', default: true },
  { id: 'figma', label: 'Prototypes UI/UX Figma & Design System', default: true },
  { id: 'tests', label: 'Suites de Tests Automatisés & Documentation API', default: true },
  { id: 'warranty', label: 'Garantie Corrective 30 jours post-déploiement', default: true },
  { id: 'training', label: 'Formation des équipes & transfert de compétences', default: false },
];

export function ProjectEstimator() {
  const [selectedType, setSelectedType] = useState<ProjectType>('web-app');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('standard');
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    'source-code',
    'figma',
    'tests',
    'warranty',
  ]);
  const [isCalculated, setIsCalculated] = useState(false);

  const toggleDeliverable = (id: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentType = PROJECT_TYPES.find((t) => t.id === selectedType);
  const currentComplexity = COMPLEXITY_LEVELS.find((c) => c.id === selectedComplexity);

  return (
    <section id="estimator" className="py-20 lg:py-28 border-t border-brand-border bg-brand-surface relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <p className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <Calculator className="w-4 h-4" />
            <span>Interactive Project Estimator</span>
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-balance">
            Calculez le cadrage de votre projet
          </h2>
          <p className="text-brand-muted text-sm sm:text-base font-light mt-4">
            Obtenez en 3 clics une estimation prévisionnelle de délai, les livrables recommandés et les garanties contractuelles associées.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 bg-brand-primary/50 p-6 sm:p-8 rounded-3xl border border-brand-border">
            {/* 1. Project Type */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-accent block">
                1. Nature de votre projet technologique
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setSelectedType(pt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedType === pt.id
                        ? 'border-brand-accent bg-brand-accent-soft text-brand-text shadow-sm'
                        : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-accent/40 hover:text-brand-text'
                    }`}
                  >
                    <div className="text-2xl mb-1">{pt.icon}</div>
                    <div className="text-xs font-bold uppercase tracking-wide">{pt.title}</div>
                    <div className="text-[11px] text-brand-muted font-light mt-0.5 line-clamp-1">{pt.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Scale & Complexity */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-accent block">
                2. Envergure & Exigence opérationnelle
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {COMPLEXITY_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedComplexity(lvl.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedComplexity === lvl.id
                        ? 'border-brand-accent bg-brand-accent-soft text-brand-text'
                        : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-accent/40'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wide">{lvl.label}</div>
                    <div className="text-[10px] text-brand-muted font-light mt-1">{lvl.weeks}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Deliverables Checklist */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-brand-accent block">
                3. Livrables & Engagements inclus
              </label>
              <div className="space-y-2">
                {DELIVERABLES_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => toggleDeliverable(opt.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-brand-surface cursor-pointer hover:border-brand-accent/40 transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        selectedDeliverables.includes(opt.id)
                          ? 'bg-brand-accent border-brand-accent text-brand-on-accent'
                          : 'border-brand-border'
                      }`}
                    >
                      {selectedDeliverables.includes(opt.id) && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-medium text-brand-text">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Synthesis Card */}
          <div className="lg:col-span-5 bg-brand-surface-2 border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-muted">
                Synthèse Prévisionnelle
              </span>
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-brand-accent-soft text-brand-accent border border-brand-accent/30">
                Instantané
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-brand-muted uppercase font-mono block mb-1">Architecture Cible</span>
                <h3 className="text-xl font-bold uppercase text-brand-text">
                  {currentType?.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-primary/60 border border-brand-border font-mono">
                <div>
                  <div className="text-[11px] text-brand-muted uppercase">Délai estimé</div>
                  <div className="text-lg font-bold text-brand-accent mt-0.5">
                    {currentComplexity?.weeks}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-muted uppercase">Méthodologie</div>
                  <div className="text-lg font-bold text-brand-text mt-0.5">
                    Sprint Agile
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <span className="text-xs text-brand-muted font-mono uppercase block">Garanties contractuelles :</span>
                <ul className="space-y-1.5 text-xs text-brand-text">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Dépôt Git privé & Propriété intellectuelle intégrale</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Support et garantie post-mise en production 30j</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Interlocuteur technique dédié (Gérant / Lead Tech)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <Link
                href={`/contact?objective=${encodeURIComponent(currentType?.title || '')}`}
                className="btn-primary w-full py-4 text-xs font-mono uppercase font-black tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-brand-accent-strong/20"
              >
                <span>Recevoir le devis détaillé (sous 24h)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-brand-muted text-center font-light mt-3">
                Estimation gratuite sans aucun engagement. Devis chiffré formel sous 24 heures ouvrées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
