'use client';

import { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle2, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { site } from '@/config/site.config';

export function MeetingScheduler() {
  const [selectedSlot, setSelectedSlot] = useState<string>('tomorrow-10');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [topic, setTopic] = useState<string>('architecture');

  const t = useTranslations('contact');

  const AVAILABLE_SLOTS = [
    { id: 'slot-1', date: 'Demain / Tomorrow', time: '10:00 GMT' },
    { id: 'slot-2', date: 'Demain / Tomorrow', time: '14:30 GMT' },
    { id: 'slot-3', date: 'Après-demain / Next Day', time: '11:00 GMT' },
    { id: 'slot-4', date: 'Après-demain / Next Day', time: '16:00 GMT' },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;
    setIsBooked(true);
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-[2rem] p-6 sm:p-10 relative overflow-hidden shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2 text-brand-accent text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Direct Meeting Scheduler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-balance">
            Réserver un échange d'architecture ({site.booking.duration})
          </h2>
        </div>

        <div className="flex items-center gap-2 bg-brand-primary/60 border border-brand-border px-4 py-2 rounded-full w-fit">
          <Clock className="w-4 h-4 text-brand-accent" />
          <span className="text-xs font-mono text-brand-muted">Fuseau : GMT (Ouagadougou / Londres)</span>
        </div>
      </div>

      {isBooked ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Invitation confirmée !
          </h3>
          <p className="text-sm text-brand-muted max-w-md font-light leading-relaxed">
            Un lien de visioconférence sécurisé (Google Meet) ainsi que les détails de l'échange avec <strong className="text-brand-text">{site.leadership.director.name}</strong> ont été envoyés à <strong className="text-brand-text">{email}</strong>.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setIsBooked(false)}
              className="text-xs font-mono text-brand-accent uppercase underline underline-offset-4"
            >
              Modifier ou choisir un autre créneau
            </button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Host */}
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

              <p className="text-xs text-brand-muted leading-relaxed font-light">
                Échange direct sans filtre commercial. 20 minutes pour auditer vos besoins techniques, évaluer la faisabilité et tracer une feuille de route claire.
              </p>

              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <div className="flex items-center gap-2 text-[11px] text-brand-muted font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>Accord de confidentialité (NDA) implicite</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-muted font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>Aucun engagement requis</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-brand-muted font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>Recommandations d'architecture immédiates</span>
                </div>
              </div>
            </div>

            {/* External Cal.com direct fallback */}
            <div className="p-4 rounded-xl border border-brand-border/60 bg-brand-surface-2 text-xs text-brand-muted flex items-center justify-between">
              <span>Vous préférez votre propre agenda ?</span>
              <a
                href={site.booking.calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent font-bold hover:underline font-mono inline-flex items-center gap-1"
              >
                Ouvrir Cal.com
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Slot Picker & Fast Booking Form */}
          <form onSubmit={handleBookingSubmit} className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-accent mb-3">
                1. Choisissez un créneau prioritaire
              </label>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedSlot === slot.id
                        ? 'border-brand-accent bg-brand-accent-soft text-brand-accent shadow-sm'
                        : 'border-brand-border bg-brand-primary/30 text-brand-muted hover:border-brand-accent/40 hover:text-brand-text'
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wide opacity-80">{slot.date}</div>
                    <div className="text-sm font-bold font-mono mt-1 text-brand-text">{slot.time}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-accent">
                2. Vos coordonnées professionnelles
              </label>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nom complet ou Titre"
                    className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text placeholder:text-brand-muted"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email professionnel"
                    className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text placeholder:text-brand-muted"
                  />
                </div>
              </div>

              <div>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-4 py-3 text-sm focus:border-brand-accent outline-none text-brand-text"
                >
                  <option value="architecture">Cadrage de projet / Développement sur-mesure</option>
                  <option value="product-demo">Démonstration produit (Ticketia, Alimgesto, ImmoPilot, EduManager)</option>
                  <option value="nearshore">Partenariat Nearshore / Équipe dédiée</option>
                  <option value="erp-cloud">Déploiement ERP & Infrastructure Cloud</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-xs font-mono uppercase font-black tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-brand-accent-strong/20"
            >
              <span>Confirmer le rendez-vous direct</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
