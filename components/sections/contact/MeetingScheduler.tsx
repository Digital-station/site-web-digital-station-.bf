'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Video,
  MessageCircle,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

import { site, waHref } from '@/config/site.config';

/**
 * Discovery-call request.
 *
 * HONESTY CONTRACT: this component never pretends a meeting is booked. It
 * sends a structured lead to `/api/leads` (the same inbox as the contact
 * form) and tells the visitor we will CONFIRM the slot within 24 business
 * hours. The previous version displayed fixed "tomorrow" slots and claimed a
 * Google Meet invite had been emailed — nothing was sent, which is a
 * credibility disaster for enterprise buyers.
 *
 * All prose lives in messages under `contact.scheduler`.
 */

type TopicId = 'architecture' | 'productDemo' | 'nearshore' | 'erpCloud';
const TOPIC_IDS: TopicId[] = ['architecture', 'productDemo', 'nearshore', 'erpCloud'];

/** Indicative slots: next two office mornings/afternoons, Ouagadougou time. */
const SLOTS = [
  { dayOffset: 1, time: '10:00 GMT' },
  { dayOffset: 1, time: '14:30 GMT' },
  { dayOffset: 2, time: '11:00 GMT' },
  { dayOffset: 2, time: '16:00 GMT' },
] as const;

function slotLabel(locale: string, dayOffset: number): string {
  const date = new Date(Date.now() + dayOffset * 24 * 3600 * 1000);
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Africa/Ouagadougou',
  }).format(date);
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function MeetingScheduler() {
  const locale = useLocale();
  const t = useTranslations('contact.scheduler');

  const [selectedSlot, setSelectedSlot] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<TopicId>('architecture');

  const slot = SLOTS[selectedSlot];
  const slotText = `${slotLabel(locale, slot.dayOffset)} · ${slot.time}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          company: '',
          objective: t(`topics.${topic}`),
          brief: t('brief', { topic: t(`topics.${topic}`), slot: slotText }),
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-[2rem] p-6 sm:p-10 relative overflow-hidden shadow-card">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2 text-brand-accent text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>{t('eyebrow')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-balance">
            {t('title', { duration: site.booking.duration })}
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-brand-primary/60 border border-brand-border px-4 py-2 rounded-full w-fit">
          <Clock className="w-4 h-4 text-brand-accent" />
          <span className="text-xs font-mono text-brand-muted">{t('tz')}</span>
        </div>
      </div>

      {status === 'success' ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">{t('successTitle')}</h3>
          <p className="text-sm text-brand-muted max-w-md font-light leading-relaxed">
            {t('successBody', { name: fullName })}
          </p>
          <div className="pt-2 flex flex-col items-center gap-3">
            <p className="text-xs text-brand-muted font-light">{t('successAlt')}</p>
            <a
              href={waHref(t('brief', { topic: t(`topics.${topic}`), slot: slotText }))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase font-bold tracking-wider"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-xs font-mono text-brand-accent uppercase underline underline-offset-4"
            >
              {t('reset')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left column: context & host */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-primary/40 border border-brand-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent-soft border border-brand-accent/30 flex items-center justify-center text-brand-accent font-bold font-mono">
                  LPK
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-tight text-brand-text">
                    {site.leadership.director.name}
                  </div>
                  <div className="text-xs text-brand-muted font-light">
                    {site.leadership.director.role}
                  </div>
                </div>
              </div>

              <p className="text-xs text-brand-muted leading-relaxed font-light">{t('intro')}</p>

              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <div className="flex items-center gap-2 text-[11px] text-brand-muted font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>{t('ndaNote')}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-muted font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>{t('noCommitment')}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-muted font-mono">
                  <UserCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>{t('recommendations')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: slot picker & request form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-brand-accent mb-3">
                {t('stepSlots')}
              </span>
              <div className="grid grid-cols-2 gap-3">
                {SLOTS.map((s, i) => (
                  <button
                    key={`${s.dayOffset}-${s.time}`}
                    type="button"
                    aria-pressed={selectedSlot === i}
                    onClick={() => setSelectedSlot(i)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedSlot === i
                        ? 'border-brand-accent bg-brand-accent-soft text-brand-accent shadow-sm'
                        : 'border-brand-border bg-brand-primary/30 text-brand-muted hover:border-brand-accent/40 hover:text-brand-text'
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wide opacity-80 block">
                      {slotLabel(locale, s.dayOffset)}
                    </span>
                    <span className="text-sm font-bold font-mono mt-1 text-brand-text block">
                      {s.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <span className="block text-xs font-mono uppercase tracking-wider text-brand-accent">
                {t('stepDetails')}
              </span>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  aria-label={t('namePlaceholder')}
                  className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text placeholder:text-brand-muted"
                />
                <input
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  aria-label={t('emailPlaceholder')}
                  className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text placeholder:text-brand-muted"
                />
              </div>

              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as TopicId)}
                aria-label={t('stepDetails')}
                className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text"
              >
                {TOPIC_IDS.map((id) => (
                  <option key={id} value={id}>
                    {t(`topics.${id}`)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full py-4 text-xs font-mono uppercase font-black tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-brand-accent-strong/20 disabled:opacity-60"
            >
              <span>{status === 'sending' ? t('sending') : t('submit')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {status === 'error' && (
              <p className="text-xs text-red-400 light:text-red-700 text-center font-light" role="alert">
                {t('error')}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
