import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Sparkles, Award, TrendingUp, Users, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * « Mot du Directeur Général » — Version améliorée
 * Message du leadership avec design premium et micro-interactions
 */

const DIRECTOR = {
  name: "KABORÉ P. Landry",
  role: "Directeur Général & Fondateur",
  initials: "KPL",
  photo: "/images/director.jpg", // Optionnel - remplacer par vraie photo
};

const MESSAGE =
  "La technologie n'est pas une fin en soi. C'est un levier au service d'une ambition humaine. Depuis notre création en 2018, notre conviction reste inchangée : accompagner chaque client comme un partenaire de long terme, lui offrir l'excellence technique sans jamais perdre de vue ses enjeux réels. Au Burkina Faso et en Afrique de l'Ouest, nous construisons l'écosystème digital de demain.";

const DIRECTOR_VISION = [
  {
    icon: TrendingUp,
    title: "Vision 2030",
    desc: "Devenir la référence IT en Afrique de l'Ouest",
  },
  {
    icon: Users,
    title: "Équipe",
    desc: "Former 100+ experts locaux d'ici 2026",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "Standards internationaux, impact local",
  },
];

export const DirectorWord = () => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeVision, setActiveVision] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Vision cards
      gsap.fromTo(
        ".vision-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 55%" },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  // Auto-rotate vision cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVision((prev) => (prev + 1) % DIRECTOR_VISION.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      className="lg:pl-16 border-t border-brand-border py-24 md:py-40 overflow-hidden relative"
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
              <div className="h-[1px] w-12 bg-brand-accent" />
              <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] font-mono font-bold flex items-center gap-2">
                <Quote className="w-4 h-4" />
                Mot du Directeur Général
              </p>
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
                className="dw-message text-2xl md:text-3xl lg:text-4xl font-serif font-light italic leading-[1.3] text-white/90 relative z-10"
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
                  <div className="relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-brand-border bg-gradient-to-br from-brand-accent/20 to-purple-500/20 flex items-center justify-center group-hover:border-brand-accent transition-colors duration-500">
                    {/* Si vous avez une photo */}
                    {/* <img src={DIRECTOR.photo} alt={DIRECTOR.name} className="w-full h-full rounded-full object-cover" /> */}

                    {/* Sinon, initiales stylisées */}
                    <span className="font-mono text-brand-accent text-xl md:text-2xl font-black tracking-tight">
                      {DIRECTOR.initials}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-1 group-hover:text-brand-accent transition-colors">
                    {DIRECTOR.name}
                  </p>
                  <p className="text-sm md:text-base text-neutral-400 font-light mb-2">
                    {DIRECTOR.role}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Sparkles className="w-3 h-3" />
                    <span>DigitalStation • Ouagadougou, Burkina Faso</span>
                  </div>
                </div>

                {/* Verified badge */}
                <div className="hidden md:block">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 text-brand-accent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Vision Cards */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-2">
                Notre{" "}
                <span className="text-brand-accent italic font-serif font-light lowercase">
                  vision
                </span>
              </h3>
              <p className="text-sm text-neutral-500">
                Les piliers de notre stratégie de croissance
              </p>
            </motion.div>

            {DIRECTOR_VISION.map((vision, index) => (
              <motion.div
                key={index}
                className={`vision-card bg-brand-surface border rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 ${
                  activeVision === index
                    ? "border-brand-accent shadow-lg shadow-brand-accent/10"
                    : "border-brand-border hover:border-brand-accent/50"
                }`}
                onClick={() => setActiveVision(index)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      activeVision === index
                        ? "bg-brand-accent text-brand-primary"
                        : "bg-brand-accent/10 text-brand-accent"
                    }`}
                  >
                    <vision.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-lg font-bold uppercase tracking-tight mb-2 transition-colors ${
                        activeVision === index
                          ? "text-brand-accent"
                          : "text-white"
                      }`}
                    >
                      {vision.title}
                    </h4>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {vision.desc}
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                {activeVision === index && (
                  <motion.div
                    className="h-1 bg-brand-accent/20 rounded-full mt-4 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-brand-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Stats mini-panel */}
            <motion.div
              className="vision-card bg-gradient-to-br from-brand-accent/5 to-purple-500/5 border border-brand-accent/20 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-brand-accent" />
                <span className="text-xs uppercase tracking-wider font-bold text-brand-accent">
                  Impact réel
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-black text-white">500+</div>
                  <div className="text-[10px] uppercase text-neutral-500">
                    Projets livrés
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">98%</div>
                  <div className="text-[10px] uppercase text-neutral-500">
                    Satisfaction
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
