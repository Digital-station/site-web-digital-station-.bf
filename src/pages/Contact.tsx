import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Users,
  ExternalLink,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import gsap from "gsap";
import { cn } from "../lib/utils";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const contactSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phone: z.string().min(10, "Un numéro de téléphone valide est requis"),
  objective: z.string().optional(),
  budget: z.string().optional(),
  brief: z
    .string()
    .min(10, "Veuillez fournir plus de détails sur votre projet"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [buttonText, setButtonText] = useState("Envoyer le Message");
  const [isOnline, setIsOnline] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-item", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });

      gsap.from(".form-reveal", {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    }, containerRef);

    // Simuler la disponibilité basée sur les heures d'ouverture
    const checkAvailability = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();

      // Lun-Ven: 8h-18h, Sam: 9h-13h, Dim: fermé
      if (day === 0) {
        setIsOnline(false);
      } else if (day === 6) {
        setIsOnline(hour >= 9 && hour < 13);
      } else {
        setIsOnline(hour >= 8 && hour < 18);
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  const onFormSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, budget: estimatedBudget }),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
        setEstimatedBudget("");

        // Google Analytics tracking (si configuré)
        if (typeof window.gtag === "function") {
          window.gtag("event", "form_submission", {
            event_category: "Contact",
            event_label: "Contact Form Submitted",
          });
        }
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Quel est le délai de réponse ?",
      a: "Nous répondons sous 24h ouvrées, souvent plus rapidement.",
    },
    {
      q: "Proposez-vous des devis gratuits ?",
      a: "Oui, tous nos devis sont gratuits et sans engagement.",
    },
    {
      q: "Travaillez-vous à distance ?",
      a: "Oui, nous accompagnons des clients dans toute l'Afrique de l'Ouest.",
    },
    {
      q: "Quels modes de paiement acceptez-vous ?",
      a: "Virement bancaire, Mobile Money (Orange, Moov, Wave) et espèces.",
    },
  ];

  const businessHours = [
    { day: "Lundi - Vendredi", time: "8h00 - 18h00", open: true },
    { day: "Samedi", time: "9h00 - 13h00", open: true },
    { day: "Dimanche", time: "Fermé", open: false },
  ];

  return (
    <div ref={containerRef} className="lg:pl-16 pt-36 md:pt-44 pb-20 md:pb-24">
      <Helmet>
        <title>Contactez DigitalStation | Solutions IT au Burkina Faso</title>
        <meta
          name="description"
          content="Discutons de votre projet digital. Développement web, applications mobiles, transformation digitale à Ouagadougou. Réponse sous 24h."
        />
        <link rel="canonical" href="https://digitalstation.bf/contact" />
        <meta property="og:title" content="Contact - DigitalStation" />
        <meta
          property="og:description"
          content="Votre partenaire technologique au Burkina Faso"
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact DigitalStation",
              "description": "Contactez DigitalStation pour vos projets de développement et transformation digitale.",
              "url": "https://digitalstation.bf/contact",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://digitalstation.bf"
                }, {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Contact",
                  "item": "https://digitalstation.bf/contact"
                }]
              }
            }
          `}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24">
          {/* LEFT COLUMN - Contact Info */}
          <div>
            <div className="contact-item">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8 md:mb-12 text-white">
                Lançons <br />
                <span className="text-brand-accent italic font-serif lowercase font-light opacity-80">
                  votre projet
                </span>{" "}
                <br />
                ensemble.
              </h1>
              <p className="text-neutral-400 text-base md:text-lg mb-8">
                Transformez vos idées en solutions digitales performantes. Notre
                équipe est prête à vous accompagner.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6 md:space-y-8 mb-8">
              <a
                href="mailto:infos@digitalstation.bf"
                className="contact-item flex items-center gap-4 md:gap-6 group hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-border flex items-center justify-center shrink-0 group-hover:border-brand-accent group-hover:bg-brand-accent/10 transition-all">
                  <Mail className="text-brand-accent w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest  mb-1 font-bold text-white">
                    Email
                  </div>
                  <div className="text-base md:text-lg font-bold text-white group-hover:text-brand-accent transition-colors break-all md:break-normal">
                    infos@digitalstation.bf
                  </div>
                </div>
              </a>

              <a
                href="tel:+22650222894"
                className="contact-item flex items-center gap-4 md:gap-6 group hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-border flex items-center justify-center shrink-0 group-hover:border-brand-accent group-hover:bg-brand-accent/10 transition-all">
                  <Phone className="text-brand-accent w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white mb-1 font-bold">
                    Téléphone
                  </div>
                  <div className="text-base md:text-lg font-bold text-white group-hover:text-brand-accent transition-colors">
                    +226 50 22 28 94
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/22666169762"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item flex items-center gap-4 md:gap-6 group hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-border flex items-center justify-center shrink-0 group-hover:border-green-500 group-hover:bg-green-500/10 transition-all">
                  <FaWhatsapp className="text-green-500 w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white mb-1 font-bold">
                    WhatsApp
                  </div>
                  <div className="text-base md:text-lg font-bold text-white group-hover:text-green-500 transition-colors">
                    +226 66 16 97 62
                  </div>
                </div>
              </a>

              <a
                href="https://maps.google.com/?q=Ouagadougou,Burkina+Faso"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item flex items-center gap-4 md:gap-6 group hover:scale-[1.02] transition-transform"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-brand-border flex items-center justify-center shrink-0 group-hover:border-brand-accent group-hover:bg-brand-accent/10 transition-all">
                  <MapPin className="text-brand-accent w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest  mb-1 font-bold text-white">
                    Bureau
                  </div>
                  <div className="text-base md:text-lg font-bold text-white group-hover:text-brand-accent transition-colors">
                    Ouagadougou, Burkina Faso
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-brand-accent transition-all" />
              </a>
            </div>

            {/* Business Hours */}
            <div className="contact-item bg-brand-primary/30 rounded-2xl p-6 border border-brand-border/50 mb-8">
              <div className="flex text-white items-center gap-2 text-[10px] uppercase tracking-widest opacity-40 mb-4 font-bold">
                Horaires d'Ouverture
              </div>
              <div className="space-y-3">
                {businessHours.map((h, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-300">
                      {h.day}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        h.open ? "text-green-400" : "text-neutral-600",
                      )}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="contact-item">
              <div className="flex items-center gap-4 text-sm bg-brand-accent/5 rounded-xl p-4 border border-brand-accent/20">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-purple-500 border-2 border-brand-primary flex items-center justify-center text-xs font-bold"
                    >
                      {i === 4 && <Users className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-brand-accent font-bold">
                    20+ entreprises
                  </span>
                  <span className="text-neutral-400 ml-1 block text-xs">
                    nous font confiance au Burkina Faso
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Form */}
          <div className="form-reveal bg-brand-surface border border-brand-border p-8 md:p-12 rounded-[2rem] relative overflow-hidden shadow-2xl">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -z-10" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-16 md:py-20"
                role="status"
                aria-live="polite"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Send className="text-brand-primary w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-4">
                  Message Envoyé ! 🎉
                </h2>
                <p className="text-neutral-400 text-sm mb-2">
                  Merci pour votre confiance ! Notre équipe vous contactera dans
                  les 24h.
                </p>
                <p className="text-neutral-500 text-xs mb-8">
                  Vérifiez également vos spams si vous ne recevez pas notre
                  réponse.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-brand-accent font-bold uppercase tracking-widest text-[10px] border-b-2 border-brand-accent pb-1 hover:text-white hover:border-white transition-colors"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <>
                {/* FAQ Toggle */}
                <motion.div
                  initial={false}
                  className="mb-8 bg-brand-primary/30 rounded-2xl p-5 border border-brand-border/50"
                >
                  <button
                    type="button"
                    onClick={() => setShowFAQ(!showFAQ)}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <span className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-2">
                      Questions Fréquentes
                    </span>
                    <ArrowRight
                      className={cn(
                        "w-4 h-4 transition-transform text-brand-accent",
                        showFAQ && "rotate-90",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {showFAQ && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 mt-5 pt-5 border-t border-brand-border/30">
                          {faqs.map((faq, i) => (
                            <div
                              key={i}
                              className="border-brand-accent/30 pl-4 hover:border-brand-accent transition-colors"
                            >
                              <p className="text-xs font-bold text-brand-accent mb-1.5">
                                {faq.q}
                              </p>
                              <p className="text-xs text-neutral-400 leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4"
                      >
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        {...register("firstName")}
                        type="text"
                        placeholder="Ex: Adama"
                        aria-required="true"
                        aria-invalid={errors.firstName ? "true" : "false"}
                        className={cn(
                          "w-full bg-brand-primary/50 border border-brand-border rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:border-brand-accent outline-none transition-all placeholder:text-neutral-600",
                          errors.firstName &&
                            "border-red-500/50 focus:border-red-500 shake",
                        )}
                      />
                      {errors.firstName && (
                        <p
                          className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4"
                      >
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        {...register("lastName")}
                        type="text"
                        placeholder="Ex: Ouédraogo"
                        aria-required="true"
                        aria-invalid={errors.lastName ? "true" : "false"}
                        className={cn(
                          "w-full bg-brand-primary/50 border border-brand-border rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:border-brand-accent outline-none transition-all placeholder:text-neutral-600",
                          errors.lastName &&
                            "border-red-500/50 focus:border-red-500 shake",
                        )}
                      />
                      {errors.lastName && (
                        <p
                          className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        {...register("email")}
                        type="email"
                        placeholder="Ex: adama@entreprise.com"
                        aria-required="true"
                        aria-invalid={errors.email ? "true" : "false"}
                        className={cn(
                          "w-full bg-brand-primary/50 border border-brand-border rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:border-brand-accent outline-none transition-all placeholder:text-neutral-600",
                          errors.email &&
                            "border-red-500/50 focus:border-red-500 shake",
                        )}
                      />
                      {errors.email && (
                        <p
                          className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4"
                      >
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        {...register("phone")}
                        type="tel"
                        placeholder="Ex: +226 70 00 00 00"
                        aria-required="true"
                        aria-invalid={errors.phone ? "true" : "false"}
                        className={cn(
                          "w-full bg-brand-primary/50 border border-brand-border rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:border-brand-accent outline-none transition-all placeholder:text-neutral-600",
                          errors.phone &&
                            "border-red-500/50 focus:border-red-500 shake",
                        )}
                      />
                      {errors.phone && (
                        <p
                          className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle className="w-3 h-3" />{" "}
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-2">
                    <label
                      htmlFor="objective"
                      className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4"
                    >
                      Type de Service
                    </label>
                    <div className="relative">
                      <select
                        id="objective"
                        {...register("objective")}
                        className="w-full bg-brand-primary/50 border border-brand-border rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:border-brand-accent outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionnez un service...</option>
                        <option value="Développement Web & Mobile">
                          Développement Web & Mobile
                        </option>
                        <option value="Transformation Digitale">
                          Transformation Digitale
                        </option>
                        <option value="Solutions Cloud & DevOps">
                          Solutions Cloud & DevOps
                        </option>
                        <option value="Conseil IT & Architecture">
                          Conseil IT & Architecture
                        </option>
                        <option value="Formation & Accompagnement">
                          Formation & Accompagnement
                        </option>
                        <option value="Maintenance & Support">
                          Maintenance & Support
                        </option>
                        <option value="Cybersécurité">Cybersécurité</option>
                        <option value="Data & Analytics">
                          Data & Analytics
                        </option>
                        <option value="Intelligence Artificielle">
                          Intelligence Artificielle
                        </option>
                        <option value="Autre">Autre</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Budget Estimation */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4">
                      Budget Estimé (Facultatif)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["< 500K", "500K - 2M", "> 2M"].map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setEstimatedBudget(range);
                            setValue("budget", range);
                          }}
                          className={cn(
                            "py-3 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-wider",
                            estimatedBudget === range
                              ? "border-brand-accent bg-brand-accent/10 text-brand-accent scale-105 shadow-lg shadow-brand-accent/20"
                              : "border-brand-border text-neutral-500 hover:border-brand-accent/50 hover:text-neutral-300",
                          )}
                        >
                          {range} <span className="text-[9px]">FCFA</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Brief */}
                  <div className="space-y-2">
                    <label
                      htmlFor="brief"
                      className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-4"
                    >
                      Description du Projet{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="brief"
                      {...register("brief")}
                      rows={5}
                      placeholder="Décrivez votre projet, vos objectifs et vos contraintes actuelles..."
                      aria-required="true"
                      aria-invalid={errors.brief ? "true" : "false"}
                      className={cn(
                        "w-full bg-brand-primary/50 border border-brand-border rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:border-brand-accent outline-none transition-all resize-none placeholder:text-neutral-600",
                        errors.brief &&
                          "border-red-500/50 focus:border-red-500 shake",
                      )}
                    ></textarea>
                    {errors.brief && (
                      <p
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-4 flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors.brief.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    onHoverStart={() =>
                      !isSubmitting && setButtonText("Lancer la Mission")
                    }
                    onHoverEnd={() =>
                      !isSubmitting && setButtonText("Envoyer le Message")
                    }
                    className={cn(
                      "btn-primary w-full py-5 flex items-center justify-center gap-3 text-base md:text-lg uppercase font-black transition-all relative overflow-hidden group",
                      isSubmitting &&
                        "opacity-70 scale-95 pointer-events-none cursor-not-allowed",
                    )}
                  >
                    {/* Animated background on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-white/10 to-brand-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10">
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="inline-block"
                          >
                            ⏳
                          </motion.span>{" "}
                          Envoi en cours...
                        </>
                      ) : (
                        buttonText
                      )}
                    </span>
                    {!isSubmitting && (
                      <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-neutral-600 mt-4">
                    Vos données sont protégées et ne seront jamais partagées.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
