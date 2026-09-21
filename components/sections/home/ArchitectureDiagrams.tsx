'use client';

import { useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Interactive architecture explorer — structure and tech chips live here
 * (proper nouns, deliberately untranslated); every sentence lives in
 * messages under `home.architecture`.
 *
 * The tab-panel fade/slide is the `.enter` CSS animation (see globals.css),
 * re-triggered by `key={activeTab}` — the old `AnimatePresence` + `motion`
 * version pulled the whole ~126 KB Motion runtime into this below-fold
 * island's preload chain for a 250 ms opacity tween it didn't need.
 */
const TAB_IDS = ['ticketia', 'alimgesto', 'cloud', 'security'] as const;
type TabId = (typeof TAB_IDS)[number];

const TECH_CHIPS: Record<TabId, string[]> = {
  ticketia: ['Next.js', 'Golang Engine', 'Redis Cache', 'SQLite Local', 'Ed25519 Keys'],
  alimgesto: ['Electron / React', 'SQLite Embedded', 'PostgreSQL Cloud', 'WebSockets', 'REST Sync'],
  cloud: ['Docker / Compose', 'Nginx WAF', 'PostgreSQL Replication', 'Prometheus', 'Linux Debian'],
  security: ['AES-256', 'TLS 1.3', 'RBAC', 'MFA', 'HSTS Strict'],
};

type Stat = { label: string; value: string };
type Step = { step: string; title: string; desc: string };

export function ArchitectureDiagrams() {
  const [activeTab, setActiveTab] = useState<TabId>('ticketia');
  const t = useTranslations('home.architecture');
  const ti = useTranslations('home.architecture.items');

  const stats = ti.raw(`${activeTab}.stats`) as unknown as Stat[];
  const flow = ti.raw(`${activeTab}.flow`) as unknown as Step[];

  return (
    <section className="py-20 lg:py-28 border-t border-brand-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-brand-accent text-xs font-mono font-bold uppercase tracking-widest mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-balance">
            {t('title')}
          </h2>
          <p className="text-brand-muted text-sm sm:text-base font-light mt-3">{t('subtitle')}</p>
        </div>

        {/* Tabs — the active tab uses accent-strong, not accent: white on the
            electric-cyan accent is ~2:1 in the dark theme (fails WCAG AA). */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label={t('title')}>
          {TAB_IDS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === id
                  ? 'bg-brand-accent-strong text-brand-on-accent shadow-md shadow-brand-accent-strong/20'
                  : 'border border-brand-border text-brand-muted hover:border-brand-accent/50 hover:text-brand-text'
              }`}
            >
              {t(`tabs.${id}`)}
            </button>
          ))}
        </div>

        {/* key remounts the panel per tab, restarting `.enter`; matches the
            old motion tween (opacity 0→1, y 12→0, 0.25 s). The exit fade is
            gone — the incoming panel animating in reads the same. */}
        <div
          key={activeTab}
          className="enter bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-10 shadow-card"
          style={{ '--enter-y': '12px', '--enter-duration': '0.25s' } as CSSProperties}
        >
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-balance">
              {ti(`${activeTab}.title`)}
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted font-light mt-2">
              {ti(`${activeTab}.subtitle`)}
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {stats.map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-2xl bg-brand-primary/60 border border-brand-border"
              >
                <div className="text-lg font-bold text-brand-accent font-mono">{s.value}</div>
                <div className="text-[11px] text-brand-muted uppercase font-mono mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Flow */}
          <ol className="grid md:grid-cols-2 gap-6 mb-10">
            {flow.map((f) => (
              <li key={f.step} className="flex gap-4">
                <span className="text-2xl font-black font-mono text-brand-accent/70 shrink-0">
                  {f.step}
                </span>
                <div>
                  <div className="text-sm font-bold uppercase tracking-tight text-brand-text">
                    {f.title}
                  </div>
                  <p className="text-xs text-brand-muted font-light leading-relaxed mt-1">
                    {f.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Tech chips — proper nouns, identical in both languages */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-brand-border/60">
            {TECH_CHIPS[activeTab].map((chip) => (
              <span
                key={chip}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-brand-primary border border-brand-border text-brand-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
