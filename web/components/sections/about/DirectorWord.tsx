"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { site, addressLine } from "@/config/site.config";

/**
 * « Mot du Gérant » — the director's message and signature card.
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
    // Registered here, not at module scope: the module is evaluated on
    // the server first, where `document` does not exist.
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Opening quote animation
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

        // Message fade in with stagger
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

        // Signature block
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

      // Reduced motion: jump straight to the end state. Nothing is left at
      // opacity 0 waiting for a scroll trigger that will never animate.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".dw-message, .dw-signature", {
          opacity: 1,
          y: 0,
        });
        // The oversized quote mark is decoration; 0.08 IS its final opacity.
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
      className="lg:pl-16 border-t border-brand-border py-12 md:py-20 overflow-hidden relative"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 md:gap-20 items-start">
          {/* Left Column - Message */}
          <div className="relative">
            {/* Eyebrow */}
            <motion.div
              className="flex items-center gap-3 mb-10 md:mb-14"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* The section's heading, styled as an eyebrow. It was a <p>,
                  which left the director's message without one. */}
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
                /* Tokens, not `text-white/90`: this section is the only place
                   that still painted its copy with literal white, so on the
                   cream light theme the Director's whole message rendered
                   white-on-white and simply vanished. */
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

            {/* Signature block - Enhanced */}
          </div>

          {/* Right Column - Signature card */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <motion.div
              className="dw-signature mt-10 md:mt-14 bg-brand-surface border border-brand-border rounded-2xl p-6 md:p-8 hover:border-brand-accent/50 transition-all duration-500 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-center gap-5 md:gap-6 relative z-10">
                {/* Avatar with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-brand-border overflow-hidden group-hover:border-brand-accent transition-colors duration-500">
                    {/* A 384px WebP (~8 KB) served through next/image, in
                        place of a 2 MB, 1254px PNG shown at 96px. */}
                    <Image
                      src="/team/landry-kabore.webp"
                      alt=""
                      width={96}
                      height={96}
                      sizes="(min-width: 768px) 96px, 80px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-black uppercase tracking-tighter text-brand-text mb-1 group-hover:text-brand-accent transition-colors">
                    {DIRECTOR.name}
                  </p>
                  <p className="text-sm md:text-base text-brand-muted font-light mb-2">
                    {DIRECTOR.role}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-brand-faint">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {site.name} • {addressLine()}
                    </span>
                  </div>
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
