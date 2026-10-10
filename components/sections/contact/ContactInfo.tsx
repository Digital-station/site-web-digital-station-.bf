// No 'use client': nothing here needs the browser. `useTranslations` works in
// server components, and the enter animation is pure CSS (globals.css).
import { type CSSProperties } from 'react';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  site,
  telHref,
  mailHref,
  waHref,
  addressLine,
  formatTime,
} from '@/config/site.config';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsApp';

export function ContactInfo({ locale }: { locale: string }) {
  const t = useTranslations('contact.info');
  const ts = useTranslations('contact.schedule');
  const tm = useTranslations('contact.meta');

  /**
   * The column slides in with the CSS `.enter` animation (see globals.css),
   * one step every 0.2s. It used to be a GSAP `from` tween, which re-hid the
   * h1 the server had already painted and then replayed it.
   */
  const enterStep = (step: number) =>
    ({ '--enter-delay': `${step * 0.2}s` }) as CSSProperties;
  const ENTER = 'enter [--enter-x:-30px] [--enter-duration:0.8s]';

  /**
   * `href: null` renders the row as plain text. The office used to link to a
   * Google Maps search for "Ouagadougou, Burkina Faso" — a whole city, not an
   * office — so it stays unlinked until site.config.ts has a street address.
   */
  const methods: {
    key: string;
    href: string | null;
    label: string;
    value: string;
    icon: React.ReactNode;
    external: boolean;
  }[] = [
    {
      key: 'email',
      href: mailHref(),
      label: t('emailLabel'),
      value: site.contact.email,
      icon: <Mail className="text-brand-accent w-4 h-4 md:w-5 md:h-5" />,
      external: false,
    },
    {
      key: 'phone',
      href: telHref(),
      label: t('phoneLabel'),
      value: site.contact.phone,
      icon: <Phone className="text-brand-accent w-4 h-4 md:w-5 md:h-5" />,
      external: false,
    },
    {
      key: 'whatsapp',
      href: waHref(),
      label: t('whatsappLabel'),
      value: site.contact.whatsapp,
      icon: <WhatsAppIcon className="text-green-500 w-4 h-4 md:w-5 md:h-5" />,
      external: true,
    },
    {
      key: 'office',
      href: null,
      label: t('officeLabel'),
      value: addressLine(),
      icon: <MapPin className="text-brand-accent w-4 h-4 md:w-5 md:h-5" />,
      external: false,
    },
  ];

  return (
    <div>
      <div className={ENTER}>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[1.15] mb-8 md:mb-12 text-balance break-words">
          {t.rich('title', {
            br: () => <br />,
            accent: (chunks) => (
              <span className="text-brand-accent italic font-serif lowercase font-light">
                {chunks}
              </span>
            ),
          })}
        </h1>
        <p className="text-brand-muted text-base md:text-lg mb-8">{t('intro')}</p>
      </div>

      {/* The methods list needs a heading of its own; `contact.meta.title`
          ("Contact") is exactly that string and already exists. */}
      <h2 className="sr-only">{tm('title')}</h2>
      <div className="space-y-6 md:space-y-8 mb-8">
        {methods.map((m, i) => {
          const body = (
            <>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-border flex items-center justify-center shrink-0 group-hover:border-brand-accent group-hover:bg-brand-accent-soft transition-all">
                {m.icon}
              </div>
              <div className="flex-1">
                <div className="text-[11px] md:text-xs uppercase tracking-wide mb-1 font-bold text-brand-muted">
                  {m.label}
                </div>
                {/* `break-words`, not `break-all`: the latter split the
                    address mid-word ("Burkina Fa / so") on narrow phones. */}
                <div className="text-base md:text-lg font-bold group-hover:text-brand-accent transition-colors break-words">
                  {m.value}
                </div>
              </div>
              {m.external && (
                <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-brand-accent transition-all shrink-0" />
              )}
            </>
          );

          if (!m.href) {
            return (
              <div
                key={m.key}
                className={cn(ENTER, 'flex items-center gap-4 md:gap-6')}
                style={enterStep(i + 1)}
              >
                {body}
              </div>
            );
          }

          return (
            <a
              key={m.key}
              href={m.href}
              {...(m.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={cn(
                ENTER,
                'flex items-center gap-4 md:gap-6 group hover:scale-[1.02] transition-transform',
              )}
              style={enterStep(i + 1)}
            >
              {body}
            </a>
          );
        })}
      </div>

      {/* Opening hours — rendered from site.config.ts */}
      <div
        className={cn(
          ENTER,
          'bg-brand-primary/30 rounded-2xl p-6 border border-brand-border mb-8',
        )}
        style={enterStep(methods.length + 1)}
      >
        {/* The timezone sits in the heading: the hours are Ouagadougou's,
            and most visitors from abroad read them as their own. */}
        <h2 className="text-[11px] md:text-xs uppercase tracking-wide text-brand-muted mb-4 font-bold">
          {ts('title')}{' '}
          <span className="font-medium normal-case tracking-normal">
            {t('scheduleTimezone')}
          </span>
        </h2>
        <div className="space-y-3">
          {site.contact.schedule.map((slot) => (
            <div key={slot.id} className="flex justify-between items-center gap-4">
              <span className="text-sm font-medium text-brand-muted">
                {ts(`days.${slot.id}`)}
              </span>
              <span
                className={cn(
                  'text-sm font-bold',
                  // green-400 is 1.7:1 on cream; green-700 is 5.3:1.
                  slot.open ? 'text-green-400 light:text-green-700' : 'text-brand-muted',
                )}
              >
                {slot.open && slot.close
                  ? `${formatTime(slot.open, locale)} - ${formatTime(slot.close, locale)}`
                  : ts('closed')}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* The promise lives under the form's submit button (and in the footer);
          a third copy in this column only repeated it. */}
    </div>
  );
}
