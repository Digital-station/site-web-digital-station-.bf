'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Settings2,
  ShieldCheck,
  Smartphone,
  Globe2,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';

/**
 * Express project scoping tool. Structure lives here; ALL prose lives in
 * messages under `home.estimator` so the tool is fully bilingual.
 */
type ProjectType = 'webApp' | 'mobileApp' | 'erpOdoo' | 'cloudDevops' | 'auditSecurity';
type Complexity = 'mvp' | 'standard' | 'enterprise';

const PROJECT_TYPES: { id: ProjectType; icon: LucideIcon }[] = [
  { id: 'webApp', icon: Globe2 },
  { id: 'mobileApp', icon: Smartphone },
  { id: 'erpOdoo', icon: Settings2 },
  { id: 'cloudDevops', icon: Cloud },
  { id: 'auditSecurity', icon: ShieldCheck },
];

const COMPLEXITY_IDS: Complexity[] = ['mvp', 'standard', 'enterprise'];

const DELIVERABLE_IDS = ['sourceCode', 'figma', 'tests', 'warranty', 'training'] as const;
type DeliverableId = (typeof DELIVERABLE_IDS)[number];

const DEFAULT_DELIVERABLES: DeliverableId[] = ['sourceCode', 'figma', 'tests', 'warranty'];

export function ProjectEstimator() {
  const [selectedType, setSelectedType] = useState<ProjectType>('webApp');
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity>('standard');
  const [selectedDeliverables, setSelectedDeliverables] =
    useState<DeliverableId[]>(DEFAULT_DELIVERABLES);

  const t = useTranslations('home.estimator');

  const toggleDeliverable = (id: DeliverableId) =>
    setSelectedDeliverables((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );

  const typeTitle = t(`types.${selectedType}.title`);
  const weeks = t(`complexity.${selectedComplexity}.weeks`);

  return (
    <section id="estimator" className="py-20 lg:py-28 border-t border-brand-border bg-brand-primary/40 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-balance">
            {t('title')}
          </h2>
          <p className="text-brand-muted text-sm sm:text-base font-light mt-4">{t('intro')}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 bg-brand-primary/50 p-6 sm:p-8 rounded-3xl border border-brand-border">
            {/* 1. Project Type */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-accent block">
                {t('step1')}
              </span>
              <div className="grid sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((pt) => {
                  const Icon = pt.icon;
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      aria-pressed={selectedType === pt.id}
                      onClick={() => setSelectedType(pt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedType === pt.id
                          ? 'border-brand-accent bg-brand-accent-soft text-brand-text shadow-sm'
                          : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-accent/40 hover:text-brand-text'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2 text-brand-accent" aria-hidden="true" />
                      <span className="text-xs font-bold uppercase tracking-wide block">
                        {t(`types.${pt.id}.title`)}
                      </span>
                      <span className="text-[11px] text-brand-muted font-light mt-0.5 line-clamp-1 block">
                        {t(`types.${pt.id}.subtitle`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scale & Complexity */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-accent block">
                {t('step2')}
              </span>
              <div className="grid sm:grid-cols-3 gap-3">
                {COMPLEXITY_IDS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    aria-pressed={selectedComplexity === lvl}
                    onClick={() => setSelectedComplexity(lvl)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedComplexity === lvl
                        ? 'border-brand-accent bg-brand-accent-soft text-brand-text'
                        : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-accent/40'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide block">
                      {t(`complexity.${lvl}.label`)}
                    </span>
                    <span className="text-[10px] text-brand-muted font-light mt-1 block">
                      {t(`complexity.${lvl}.weeks`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Deliverables Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-accent block">
                {t('step3')}
              </span>
              <div className="space-y-2">
                {DELIVERABLE_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selectedDeliverables.includes(id)}
                    onClick={() => toggleDeliverable(id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-brand-surface cursor-pointer hover:border-brand-accent/40 transition-colors w-full text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        selectedDeliverables.includes(id)
                          ? 'bg-brand-accent border-brand-accent text-brand-on-accent'
                          : 'border-brand-border'
                      }`}
                    >
                      {selectedDeliverables.includes(id) && <CheckCircle2 className="w-4 h-4" />}
                    </span>
                    <span className="text-xs font-medium text-brand-text">{t(`deliverables.${id}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Synthesis Card */}
          <div className="lg:col-span-5 bg-brand-surface-2 border border-brand-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-card relative">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-muted">
                {t('synthesis.title')}
              </span>
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-brand-accent-soft text-brand-accent border border-brand-accent/30">
                {t('synthesis.instant')}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-brand-muted uppercase font-mono block mb-1">
                  {t('synthesis.archLabel')}
                </span>
                <h3 className="text-xl font-bold uppercase text-brand-text">{typeTitle}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-primary/60 border border-brand-border font-mono">
                <div>
                  <div className="text-[11px] text-brand-muted uppercase">{t('synthesis.delayLabel')}</div>
                  <div className="text-lg font-bold text-brand-accent mt-0.5">{weeks}</div>
                </div>
                <div>
                  <div className="text-[11px] text-brand-muted uppercase">{t('synthesis.methodLabel')}</div>
                  <div className="text-lg font-bold text-brand-text mt-0.5">
                    {t('synthesis.methodValue')}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <span className="text-xs text-brand-muted font-mono uppercase block">
                  {t('synthesis.guaranteesTitle')}
                </span>
                <ul className="space-y-1.5 text-xs text-brand-text">
                  {([1, 2, 3] as const).map((n) => (
                    <li key={n} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                      <span>{t(`synthesis.guarantee${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <Link
                href={`/contact?objective=${encodeURIComponent(typeTitle)}`}
                className="btn-primary w-full py-4 text-xs font-mono uppercase font-black tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-brand-accent-strong/20"
              >
                <span>{t('synthesis.cta')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-brand-muted text-center font-light mt-3">
                {t('synthesis.note')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
