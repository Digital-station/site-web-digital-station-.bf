import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Brain,
  Globe,
  Target,
  Users2,
  Rocket,
  Sparkles,
  ChevronRight,
  Award,
  Zap,
  TrendingUp,
  CheckCircle2,
  Play,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Process } from "../components/sections/processsteps";
import { DirectorWord } from "../components/sections/dgwords";

gsap.registerPlugin(ScrollTrigger);

/* ── DATA ─────────────────────────────────────────────────── */

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Excellence opérationnelle",
    desc: "Nous visons l'excellence dans chaque livraison, sans compromis sur la qualité. Chaque ligne de code compte.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "Innovation continue",
    desc: "Nous anticipons les mutations technologiques pour offrir des solutions d'avant-garde adaptées au marché africain.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users2,
    title: "Partenariat durable",
    desc: "Nos clients sont des partenaires, pas des transactions. Nous construisons des relations sur le long terme.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Vision globale, ancrage local",
    desc: "Standards internationaux avec une compréhension profonde des réalités et besoins locaux au Burkina Faso.",
    color: "from-orange-500 to-red-500",
  },
];

const MILESTONES = [
  {
    year: "2018",
    label: "Création de DigitalStation au Burkina Faso",
    icon: Rocket,
  },
  {
    year: "2019",
    label: "Premiers projets web & mobile livrés",
    icon: CheckCircle2,
  },
  {
    year: "2021",
    label: "Expansion vers le conseil IT & ERP",
    icon: TrendingUp,
  },
  {
    year: "2023",
    label: "Lancement du support & infogérance 24/7",
    icon: ShieldCheck,
  },
  {
    year: "2024",
    label: "Intégration de solutions IA & automatisation",
    icon: Brain,
  },
  {
    year: "2025",
    label: "Pôle IA & transformation digitale avancée",
    icon: Zap,
  },
];

const STATS = [
  { value: "9", suffix: "+", label: "Services experts", icon: Cpu },
  { value: "500", suffix: "+", label: "Projets livrés", icon: Rocket },
  { value: "98", suffix: "%", label: "Taux de satisfaction", icon: Award },
  {
    value: "24",
    suffix: "/7",
    label: "Supervision & support",
    icon: ShieldCheck,
  },
];

const EXPERTISES = [
  "Développement Web & Mobile",
  "Solutions Cloud & DevOps",
  "Intelligence Artificielle",
  "Cybersécurité",
  "Conseil IT & Architecture",
  "Transformation Digitale",
  "Data & Analytics",
  "Formation & Accompagnement",
];

/* ── SUB-COMPONENTS ───────────────────────────────────────── */

const AnimatedCounter = ({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: string;
  suffix: string;
  label: string;
  icon: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current.querySelector(".stat-value");
    if (!el) return;
    const num = parseInt(value, 10);
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(eased * num)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, suffix]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center gap-3 p-6 md:p-10 border-r border-b border-brand-border last:border-r-0 relative group hover:bg-brand-accent/5 transition-colors duration-500"
      whileHover={{ scale: 1.02 }}
    >
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-brand-accent/30 group-hover:text-brand-accent transition-colors mb-2" />
      <span className="stat-value text-4xl md:text-6xl font-black text-white tracking-tighter">
        0{suffix}
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/40 font-black">
        {label}
      </span>
    </motion.div>
  );
};

/* ── SECTIONS ─────────────────────────────────────────────── */

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["innovation", "excellence", "transformation", "succès"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-line",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
          clearProps: "all",
        },
      );
      gsap.fromTo(
        ".about-hero-accent",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.35,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, ref);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative pt-24 md:pt-40 lg:pt-48 pb-16 md:pb-24 overflow-hidden lg:pl-16 min-h-[70vh] flex flex-col"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-16 md:-top-28 left-4 text-[18vw] md:text-[280px] font-black opacity-[0.03] leading-none select-none tracking-tighter pointer-events-none">
        ABOUT
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center relative w-full">
        <div className="relative z-10 text-white">
          <motion.div
            className="about-hero-accent flex items-center gap-3 mb-6 md:mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] font-mono font-bold">
              Votre partenaire digital
            </p>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-[110px] lg:text-[140px] font-black leading-[0.85] tracking-tighter uppercase mb-10 md:mb-14">
            <div className="overflow-hidden">
              <div className="about-hero-line">Notre</div>
            </div>
            <div className="overflow-hidden">
              <div className="about-hero-line italic font-serif font-light lowercase pr-2 md:pr-4 opacity-80 inline-block">
                histoire
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="about-hero-line text-brand-accent">commence.</div>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="text-neutral-400 text-base md:text-xl max-w-2xl font-light leading-relaxed mb-8 md:mb-12"
          >
            DigitalStation est née d'une conviction simple : les entreprises
            africaines méritent des partenaires technologiques qui comprennent
            leurs enjeux humains autant que leurs défis techniques.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="flex flex-wrap gap-4 md:gap-6"
          >
            <Link
              to="/services"
              className="btn-primary group flex items-center gap-3 px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
            >
              Nos services{" "}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="btn-outline px-6 py-3 text-sm md:text-base md:px-8 md:py-4"
            >
              Collaborer
            </Link>
          </motion.div>

          {/* Quick stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 md:mt-20 flex flex-wrap gap-8 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">7+</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Années d'expérience
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Users2 className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">50+</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Experts passionnés
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Basé au Burkina
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Mission = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mission-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        },
      );
      gsap.fromTo(
        ".mission-stat",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="lg:pl-16 border-t border-brand-border">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Left — manifesto */}
        <div className="p-8 md:p-12 lg:p-20 border-r border-brand-border flex flex-col justify-center">
          <p className="mission-text text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 md:mb-8 font-mono font-bold flex items-center gap-2">
            Notre mission
          </p>
          <h2 className="mission-text text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6 md:mb-10">
            Nous sommes le{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              partenaire
            </span>{" "}
            technologique que vous attendiez.
          </h2>
          <p className="mission-text text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg font-light">
            DigitalStation accompagne les entreprises et institutions à travers
            l'Afrique de l'Ouest dans leur transformation numérique. De
            l'ingénierie logicielle sur mesure à l'infogérance 24/7, en passant
            par le conseil stratégique et la cybersécurité, nous offrons un
            écosystème complet de services piloté par une équipe d'experts
            passionnés.
          </p>
          <p className="mission-text text-neutral-400 text-sm md:text-base leading-relaxed max-w-lg font-light mt-4">
            Notre approche repose sur trois piliers : l'excellence technique, la
            confiance mutuelle et une obsession pour les résultats concrets.
          </p>

          {/* Expertise tags */}
          <div className="mission-text mt-8 flex flex-wrap gap-2">
            {EXPERTISES.slice(0, 5).map((exp, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold border border-brand-border rounded-full text-neutral-400 hover:border-brand-accent hover:text-brand-accent transition-colors cursor-default"
              >
                {exp}
              </span>
            ))}
            <span className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold border border-brand-accent/50 rounded-full text-brand-accent">
              +{EXPERTISES.length - 5} autres
            </span>
          </div>
        </div>

        {/* Right — stats */}
        <div className="mission-stat bg-brand-surface border-l lg:border-l-0 border-t lg:border-t-0 border-brand-border grid grid-cols-2">
          {STATS.map((s, i) => (
            <AnimatedCounter key={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Values = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".value-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="lg:pl-16 border-t border-brand-border py-20 md:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-14 md:mb-20">
          <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono font-bold flex items-center gap-2">
            <div className="h-[1px] w-8 bg-brand-accent" />
            Nos valeurs
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Ce qui nous{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              anime.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-border border border-brand-border">
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              className="value-card group bg-brand-primary p-8 md:p-14 hover:bg-white/[0.02] transition-colors duration-500 relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <div className="absolute top-0 left-8 right-8 h-[1px] bg-brand-accent/0 group-hover:bg-brand-accent/30 transition-colors duration-500" />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                >
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white mb-3 group-hover:text-brand-accent transition-colors">
                  {v.title}
                </h3>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light max-w-md">
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".milestone",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        },
      );
      gsap.fromTo(
        ".timeline-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="lg:pl-16 border-t border-brand-border py-20 md:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-14 md:mb-20">
          <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono font-bold flex items-center gap-2">
            <div className="h-[1px] w-8 bg-brand-accent" />
            Notre parcours
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Notre{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              évolution.
            </span>
          </h2>
        </div>

        {/* Timeline strip */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-brand-border -translate-y-1/2" />
          <div className="timeline-line hidden md:block absolute top-1/2 left-0 h-[2px] bg-brand-accent/50 origin-left -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-4 relative">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                className="milestone flex flex-col items-center text-center cursor-pointer"
                variants={{
                  hidden: { y: 40, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setActiveMilestone(i)}
                onMouseLeave={() => setActiveMilestone(null)}
              >
                {/* Dot with icon */}
                <motion.div
                  className={`w-12 h-12 rounded-full bg-brand-primary border-2 flex items-center justify-center mb-4 md:mb-6 relative z-10 transition-all duration-300 ${
                    activeMilestone === i
                      ? "border-brand-accent scale-125 shadow-[0_0_20px_rgba(193,255,114,0.5)]"
                      : "border-brand-border"
                  }`}
                  whileHover={{ scale: 1.2 }}
                >
                  <m.icon
                    className={`w-5 h-5 transition-colors ${
                      activeMilestone === i
                        ? "text-brand-accent"
                        : "text-neutral-500"
                    }`}
                  />
                </motion.div>
                <span
                  className={`font-mono text-xs md:text-sm font-bold mb-2 transition-colors ${
                    activeMilestone === i
                      ? "text-brand-accent"
                      : "text-brand-accent/70"
                  }`}
                >
                  {m.year}
                </span>
                <span
                  className={`text-xs leading-relaxed max-w-[140px] transition-colors ${
                    activeMilestone === i ? "text-white" : "text-white/60"
                  }`}
                >
                  {m.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const teamStats = [
    { label: "Développeurs", count: "25+", icon: Cpu },
    { label: "Consultants IT", count: "15+", icon: Target },
    { label: "Experts IA", count: "8+", icon: Brain },
    { label: "Support 24/7", count: "10+", icon: ShieldCheck },
  ];

  return (
    <section
      ref={ref}
      className="lg:pl-16 border-t border-brand-border py-20 md:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono font-bold flex items-center gap-2">
              <div className="h-[1px] w-8 bg-brand-accent" />
              Notre équipe
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
              Des experts{" "}
              <span className="text-brand-accent italic font-serif font-light lowercase">
                passionnés
              </span>
            </h2>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8">
              Notre force réside dans notre équipe pluridisciplinaire.
              Développeurs, architectes solutions, experts en cybersécurité et
              consultants stratégiques travaillent en synergie pour transformer
              vos ambitions en réalités technologiques.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {teamStats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-brand-surface border border-brand-border rounded-xl p-4 hover:border-brand-accent/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <stat.icon className="w-5 h-5 text-brand-accent mb-2" />
                  <div className="text-2xl font-black text-white">
                    {stat.count}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full border border-brand-border/30 animate-pulse" />
              <div
                className="absolute inset-8 rounded-full border border-brand-accent/20 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute inset-16 rounded-full border border-brand-border/30 animate-pulse"
                style={{ animationDelay: "1s" }}
              />

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl font-black text-brand-accent mb-2">
                    50+
                  </div>
                  <div className="text-sm uppercase tracking-widest text-neutral-400">
                    Experts dédiés
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute top-10 right-10 bg-brand-surface border border-brand-border rounded-xl p-3 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs font-bold text-white">Certifié</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-10 bg-brand-surface border border-brand-border rounded-xl p-3 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-brand-accent" />
                  <span className="text-xs font-bold text-white">
                    Innovation
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-brand-accent py-20 md:py-32 lg:py-40 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.15)_0%,transparent_70%)]" />

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-brand-primary/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-brand-primary/20 rounded-full" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <motion.p
            className="text-brand-primary text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Prêt à collaborer ?
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-[8vw] font-black uppercase leading-[0.85] tracking-tighter text-brand-primary mb-8 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Construisons le <br className="hidden md:block" />
            <span className="italic font-serif font-light lowercase">
              futur
            </span>{" "}
            ensemble.
          </motion.h2>
          <motion.p
            className="text-brand-primary/60 text-base md:text-lg font-light max-w-xl mx-auto mb-10 md:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discutons de votre projet. Notre équipe est prête à relever vos
            défis technologiques et à transformer vos ambitions en solutions
            concrètes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-brand-primary text-brand-accent px-8 py-4 md:px-12 md:py-5 rounded-full font-black uppercase text-sm md:text-base tracking-tight hover:scale-105 active:scale-95 transition-transform"
            >
              Démarrer un projet{" "}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="group inline-flex items-center gap-3 border-2 border-brand-primary text-brand-primary px-8 py-4 md:px-12 md:py-5 rounded-full font-black uppercase text-sm md:text-base tracking-tight hover:bg-brand-primary hover:text-brand-accent transition-all"
            >
              Voir nos services
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ── PAGE ─────────────────────────────────────────────────── */

export const About = () => {
  return (
    <>
      <Helmet>
        <title>
          À propos | DigitalStation — Votre partenaire digital au Burkina Faso
        </title>
        <meta
          name="description"
          content="Découvrez DigitalStation : société de services, d'expertise et d'ingénierie informatique fondée en 2018 à Ouagadougou. Notre mission, nos valeurs et notre équipe d'experts."
        />
        <meta
          name="keywords"
          content="DigitalStation, Burkina Faso, Ouagadougou, développement web, transformation digitale, IT, conseil"
        />
        <link rel="canonical" href="https://digitalstation.bf/about" />
        <meta property="og:title" content="À propos | DigitalStation" />
        <meta
          property="og:description"
          content="Votre partenaire technologique au Burkina Faso depuis 2018"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://digitalstation.bf/about" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DigitalStation",
              "url": "https://digitalstation.bf",
              "logo": "https://digitalstation.bf/logo.png",
              "description": "Société de services et d'ingénierie informatique au Burkina Faso",
              "foundingDate": "2018",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ouagadougou",
                "addressCountry": "BF"
              },
              "sameAs": [
                "https://www.linkedin.com/company/digitalstation",
                "https://twitter.com/digitalstation"
              ]
            }
          `}
        </script>
      </Helmet>

      <Hero />
      <Mission />
      <Values />
      <Timeline />
      <TeamPreview />
      <DirectorWord />
      <Process />
      <CTA />
    </>
  );
};
