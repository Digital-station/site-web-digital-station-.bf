"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Sparkles, Linkedin, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { site, addressLine } from "@/config/site.config";

/**
 * « Mot du Gérant » — the director's message and signature card with verified leadership accountability.
 */
export const DirectorWord = () => {
  const t = useTranslations("about.director");

  const DIRECTOR = {
    name: t("name"),
    role: t("role"),
  };
  const MESSAGE = t("message");

  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".dw-quote-open",
          { opacity: 0, scale: 0.7, rotate: -15 },
          {
            opacity: 0.08,
            scale: 1,
            rotate: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 70%" },
          },
        );

        gsap.fromTo(
          ".dw-message",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: ref.current, start: "top 65%" },
          },
        );

        gsap.fromTo(
          ".dw-signature",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 60%" },
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".dw-message, .dw-signature", {
          opacity: 1,
          y: 0,
        });
        gsap.set(".dw-quote-open", { opacity: 0.08, scale: 1, rotate: 0 });
      });

      return () => mm.revert();
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="director-heading"
      className="lg:pl-16 border-t border-brand-border py-16 md:py-24 overflow-hidden relative"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 md:gap-16 items-start">
          {/* Left Column - Message */}
          <div className="relative">
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-10 md:mb-14"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2
                id="director-heading"
                className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide font-mono font-bold flex items-center gap-2"
              >
                <Quote className="w-4 h-4" aria-hidden="true" />
                {t("sectionTitle")}
              </h2>
            </motion.div>

            {/* Oversized opening quote mark */}
            <span
              aria-hidden
              className="dw-quote-open pointer-events-none select-none absolute -top-16 md:-top-24 -left-4 md:-left-8 font-serif text-[160px] md:text-[240px] leading-none text-brand-accent"
            >
              ❝
            </span>

            {/* Message */}
            <blockquote className="relative">
              <motion.p
                className="dw-message text-2xl md:text-3xl lg:text-4xl font-serif font-light italic leading-[1.3] text-brand-text relative z-10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {MESSAGE}
              </motion.p>

              {/* Animated underline on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand-accent to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: isHovered ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </blockquote>

            {/* Closing quote mark */}
            <span
              aria-hidden
              className="pointer-events-none select-none block mt-8 md:mt-12 text-right font-serif text-[80px] md:text-[120px] leading-none text-brand-accent/8"
            >
              ❞
            </span>
          </div>

          {/* Right Column - Direct Leadership & Accountability Card */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <motion.div
              className="dw-signature mt-6 lg:mt-0 bg-brand-surface border border-brand-border rounded-2xl p-6 md:p-8 hover:border-brand-accent/50 transition-all duration-500 relative overflow-hidden group shadow-card"
              whileHover={{ scale: 1.01 }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-brand-accent overflow-hidden shadow-lg shadow-brand-accent/20">
                    <Image
                      src="/team/landry-kabore.webp"
                      alt={DIRECTOR.name}
                      width={96}
                      height={96}
                      sizes="(min-width: 768px) 96px, 80px"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-black uppercase tracking-tight text-brand-text group-hover:text-brand-accent transition-colors">
                        {DIRECTOR.name}
                      </p>
                      <span title="Identité vérifiée" className="text-brand-accent">
                        <CheckCircle2 className="w-4 h-4 fill-brand-accent text-brand-surface" />
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-brand-muted font-light mb-1">
                      {DIRECTOR.role}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-brand-faint font-mono">
                      <Sparkles className="w-3 h-3 text-brand-accent" />
                      <span>{site.name} • {addressLine()}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Accountability Commitment */}
                <div className="p-4 rounded-xl bg-brand-primary/60 border border-brand-border/60 space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('commitment.title')}</span>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed font-light">
                    {t('commitment.body')}
                  </p>
                </div>

                {/* Verified Direct Channels */}
                <div className="flex items-center gap-3 pt-2 border-t border-brand-border">
                  <a
                    href={site.leadership.director.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl border border-brand-border hover:border-brand-accent hover:bg-brand-accent-soft transition-all text-xs font-mono font-bold flex items-center justify-center gap-2 text-brand-muted hover:text-brand-text"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    <span>Profil LinkedIn</span>
                  </a>

                  <a
                    href={`mailto:${site.leadership.director.email}`}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-brand-border hover:border-brand-accent hover:bg-brand-accent-soft transition-all text-xs font-mono font-bold flex items-center justify-center gap-2 text-brand-muted hover:text-brand-text"
                  >
                    <Mail className="w-4 h-4 text-brand-accent" />
                    <span>Email Direct</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-20 h-[1px] bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </section>
  );
};
