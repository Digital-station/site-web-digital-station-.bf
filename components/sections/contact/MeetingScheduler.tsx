'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  Video,
  MessageCircle,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { z } from 'zod';

import { site, mailHref, telHref, waHref } from '@/config/site.config';
import { leadFields, LEAD_LIMITS } from '@/lib/lead-schema';
import { cn } from '@/lib/utils';

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

/**
 * Indicative slots on the next two OPEN days (Mon–Fri), Ouagadougou time.
 * `day` indexes into the two dates computed after mount by `nextOpenDays`.
 *
 * These are hand-picked, not derived: a slot is a time the director can
 * realistically hold, not merely a time the office is open. They MUST stay
 * inside the weekday hours in `site.contact.schedule` (08:00–18:00) — a slot
 * outside them would be a promise the "open now" indicator contradicts.
 */
export const DISCOVERY_SLOTS = [
  { day: 0, time: '10:00 GMT' },
  { day: 0, time: '14:30 GMT' },
  { day: 1, time: '11:00 GMT' },
  { day: 1, time: '16:00 GMT' },
] as const;

type TopicId = 'architecture' | 'productDemo' | 'nearshore' | 'erpCloud';
const TOPIC_IDS: TopicId[] = ['architecture', 'productDemo', 'nearshore', 'erpCloud'];

/** Same cap as the contact form's retry links; see RETRY_BRIEF_MAX there. */
const RETRY_BRIEF_MAX = 1500;

/**
 * "Landry .P. KABORE" → "LPK". Derived so a change of director in
 * site.config.ts cannot leave the old initials on the avatar.
 */
const initials = (fullName: string): string =>
  fullName
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}]/gu, ''))
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join('');

/**
 * Ouagadougou is UTC+0 year-round, so UTC weekdays are local weekdays.
 * Computed in an effect, never during render: this page is prerendered, and a
 * render-time `Date.now()` would bake the BUILD date into the HTML and then
 * disagree with the browser's date on hydration.
 */
function nextOpenDays(now: number): Date[] {
  const days: Date[] = [];
  for (let offset = 1; days.length < 2; offset++) {
    const date = new Date(now + offset * 24 * 3600 * 1000);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) days.push(date);
  }
  return days;
}

function slotLabel(locale: string, date: Date | undefined): string {
  if (!date) return ' ';
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Africa/Ouagadougou',
  }).format(date);
}

type Status = 'idle' | 'sending' | 'success' | 'error';
/** See the same type in ContactForm.tsx — same mapping from response status. */
type ErrorKind = 'rateLimited' | 'unavailable' | 'validation' | 'generic';
type Field = 'name' | 'email';

export function MeetingScheduler() {
  const locale = useLocale();
  const t = useTranslations('contact.scheduler');
  // The form's error strings and retry-button labels are reused verbatim;
  // the scheduler is a smaller form, not a different one.
  const tf = useTranslations('contact.form');

  const [openDays, setOpenDays] = useState<Date[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needs the browser clock; see nextOpenDays
    setOpenDays(nextOpenDays(Date.now()));
  }, []);

  const [selectedSlot, setSelectedSlot] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorKind, setErrorKind] = useState<ErrorKind>('generic');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<TopicId>('architecture');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});

  /** Synchronous re-entry guard; see the same ref in ContactForm.tsx. */
  const inFlight = useRef(false);
  /** Mount time for the server's timing check; see ContactForm.tsx. */
  const mountedAt = useRef(0);
  useEffect(() => {
    if (status === 'idle') mountedAt.current = Date.now();
  }, [status]);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus();
  }, [status]);

  const focusField = (field: Field) =>
    (field === 'name' ? nameRef : emailRef).current?.focus();

  /**
   * The same `name` and `email` rules the server applies, so the scheduler
   * can no longer accept what `/api/leads` then refuses. Email is required
   * here (the form lets phone stand in for it) because the confirmation
   * goes out by email.
   */
  const fields = leadFields({
    name: tf('errors.name'),
    email: tf('errors.email'),
    phone: tf('errors.phone'),
    contactRequired: tf('errors.contactRequired'),
    brief: tf('errors.brief'),
    tooLong: tf('errors.tooLong'),
  });
  const schema = z.object({
    name: fields.name,
    email: fields.email.refine((v) => Boolean(v), tf('errors.email')),
  });

  const slot = DISCOVERY_SLOTS[selectedSlot];
  const slotText = `${slotLabel(locale, openDays[slot.day])} · ${slot.time}`;
  const topicText = t(`topics.${topic}`);
  const brief = t('brief', { topic: topicText, slot: slotText });

  const classifyFailure = async (response: Response): Promise<ErrorKind> => {
    if (response.status === 429) return 'rateLimited';
    if (response.status === 502 || response.status === 503) return 'unavailable';
    if (response.status === 400) {
      const body = (await response.json().catch(() => null)) as { fields?: unknown } | null;
      const first = Array.isArray(body?.fields)
        ? body.fields.find((f): f is Field => f === 'name' || f === 'email')
        : undefined;
      if (first) {
        focusField(first);
        return 'validation';
      }
    }
    return 'generic';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;

    const checked = schema.safeParse({ name: fullName, email });
    if (!checked.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of checked.error.issues) {
        const field = issue.path[0] as Field;
        next[field] ??= issue.message;
      }
      setFieldErrors(next);
      focusField(next.name ? 'name' : 'email');
      return;
    }
    setFieldErrors({});

    inFlight.current = true;
    setStatus('sending');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: checked.data.name,
          email: checked.data.email,
          hp_website: '',
          ts: mountedAt.current,
          objective: topicText,
          brief,
        }),
      });
      if (!response.ok) {
        setErrorKind(await classifyFailure(response));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setErrorKind('generic');
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  };

  /** Fallback links carry what was typed, so nothing is retyped. */
  const retryBrief = brief.slice(0, RETRY_BRIEF_MAX);
  const retryMailHref = () =>
    `${mailHref(`${t('eyebrow')} — ${fullName}`)}&body=${encodeURIComponent(
      [fullName, email, retryBrief].filter(Boolean).join('\n'),
    )}`;
  const showFallbackChannels = errorKind === 'unavailable' || errorKind === 'generic';

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text placeholder:text-brand-muted',
      hasError && 'border-red-500/60 focus:border-red-500 light:border-red-700',
    );
  const labelClass = 'block text-[11px] uppercase tracking-wide font-bold text-brand-muted mb-1.5 ml-1';
  const stepClass = 'block text-xs font-mono uppercase tracking-wider text-brand-accent';

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
          {/* Focused on arrival (see the effect above), so the outcome is
              read out without a live region announcing it twice. */}
          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-2xl font-black uppercase tracking-tight outline-none"
          >
            {t('successTitle')}
          </h3>
          <p className="text-sm text-brand-muted max-w-md font-light leading-relaxed">
            {t('successBody', { name: fullName })}
          </p>
          <div className="pt-2 flex flex-col items-center gap-3">
            <p className="text-xs text-brand-muted font-light">{t('successAlt')}</p>
            <a
              href={waHref(retryBrief)}
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
                <div
                  aria-hidden="true"
                  className="w-12 h-12 rounded-full bg-brand-accent-soft border border-brand-accent/30 flex items-center justify-center text-brand-accent font-bold font-mono"
                >
                  {initials(site.leadership.director.name)}
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

          {/* Right column: slot picker & request form. `noValidate` for the
              same reason as the contact form: zod + localized errors only. */}
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-7 space-y-6">
            {/* A fieldset, so a screen reader hears the step title before
                the four buttons rather than four unrelated times. */}
            <fieldset className="min-w-0">
              <legend className={cn(stepClass, 'mb-3')}>{t('stepSlots')}</legend>
              <div className="grid grid-cols-2 gap-3">
                {DISCOVERY_SLOTS.map((s, i) => {
                  const selected = selectedSlot === i;
                  return (
                    <button
                      key={`${s.day}-${s.time}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedSlot(i)}
                      className={cn(
                        'relative p-3.5 rounded-xl border text-left transition-all',
                        selected
                          ? 'border-brand-accent bg-brand-accent-soft text-brand-accent shadow-sm'
                          : 'border-brand-border bg-brand-primary/30 text-brand-muted hover:border-brand-accent/40 hover:text-brand-text',
                      )}
                    >
                      <span className="text-[11px] uppercase tracking-wide opacity-80 block">
                        {slotLabel(locale, openDays[s.day])}
                      </span>
                      <span className="text-sm font-bold font-mono mt-1 text-brand-text block">
                        {s.time}
                      </span>
                      {/* Colour alone does not mark the choice (1.4.1); the
                          state itself is in `aria-pressed`. */}
                      {selected && (
                        <Check
                          aria-hidden="true"
                          className="absolute top-3 right-3 w-4 h-4 text-brand-accent"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {/* The honesty contract, in one line where the choice is made. */}
              <p className="mt-3 text-[11px] text-brand-muted font-light leading-relaxed">
                {t('notABooking')}
              </p>
            </fieldset>

            <div className="space-y-4">
              <span className={stepClass}>{t('stepDetails')}</span>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduler-name" className={labelClass}>
                    {tf('name')}
                  </label>
                  <input
                    ref={nameRef}
                    id="scheduler-name"
                    type="text"
                    autoComplete="name"
                    maxLength={LEAD_LIMITS.name}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? 'scheduler-name-error' : undefined}
                    className={inputClass(!!fieldErrors.name)}
                  />
                  {fieldErrors.name && (
                    <FieldError id="scheduler-name-error" message={fieldErrors.name} />
                  )}
                </div>
                <div>
                  <label htmlFor="scheduler-email" className={labelClass}>
                    {tf('email')}
                  </label>
                  <input
                    ref={emailRef}
                    id="scheduler-email"
                    type="email"
                    autoComplete="email"
                    maxLength={LEAD_LIMITS.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    aria-required="true"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'scheduler-email-error' : undefined}
                    className={inputClass(!!fieldErrors.email)}
                  />
                  {fieldErrors.email && (
                    <FieldError id="scheduler-email-error" message={fieldErrors.email} />
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="scheduler-topic" className={labelClass}>
                  {t('topicLabel')}
                </label>
                <select
                  id="scheduler-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as TopicId)}
                  className={inputClass(false)}
                >
                  {TOPIC_IDS.map((id) => (
                    <option key={id} value={id}>
                      {t(`topics.${id}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Always in the DOM, so screen readers are already watching it
                when "Envoi…" appears. */}
            <p role="status" className="sr-only">
              {status === 'sending' ? t('sending') : ''}
            </p>

            <button
              type="submit"
              disabled={status === 'sending'}
              aria-disabled={status === 'sending'}
              className="btn-primary w-full py-4 text-xs font-mono uppercase font-black tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-brand-accent-strong/20 disabled:opacity-60"
            >
              <span>{status === 'sending' ? t('sending') : t('submit')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Same shape as the contact form's panel: the message, then —
                when the problem is on our side — the channels that always
                work, prefilled with what was typed. */}
            {status === 'error' && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-4 space-y-4"
              >
                <p className="flex items-start gap-2 text-xs text-red-400 light:text-red-700">
                  <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 mt-px" />
                  {errorKind === 'rateLimited'
                    ? t('errorRateLimited')
                    : errorKind === 'unavailable'
                      ? t('errorUnavailable')
                      : errorKind === 'validation'
                        ? t('errorValidation')
                        : t('error')}
                </p>
                {showFallbackChannels && (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={waHref(retryBrief)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-xs"
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      {tf('retryWhatsapp')}
                    </a>
                    <a
                      href={retryMailHref()}
                      className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-xs"
                    >
                      <Mail className="w-4 h-4" />
                      {tf('retryEmail')}
                    </a>
                    <a
                      href={telHref()}
                      className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-xs"
                    >
                      <Phone className="w-4 h-4" />
                      {tf('retryPhone')}
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

/** Mirrors ContactForm's FieldError; no `role="alert"` for the same reason. */
function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      className="text-red-500 light:text-red-700 text-[11px] font-bold uppercase tracking-wide ml-1 mt-1.5 flex items-center gap-1"
    >
      <AlertCircle aria-hidden="true" className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}
