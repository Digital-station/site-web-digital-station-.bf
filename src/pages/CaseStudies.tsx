import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const CaseStudies = () => {
  const cases = [
    {
      name: "AlimGesto",
      result: "La solution préférée des alimentations et supérettes",
      desc: "Logiciel de gestion conçu pour les alimentations, supérettes et commerces de proximité. Gérez vos ventes, stocks, clients et fournisseurs en toute simplicité.",
      tags: ["Point de Vente", "Stock", "Commerce"],
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070",
    },
    {
      name: "Ticketia",
      result: "Billetterie intelligente pour tous vos événements",
      desc: "Plateforme de vente et de gestion de billets pour concerts, festivals, nightclubs, conférences et événements culturels.",
      tags: ["Billetterie", "Événements", "Paiement"],
      img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=2070",
    },
    {
      name: "ImmoPilot",
      result: "Pilotez votre activité immobilière efficacement",
      desc: "Solution complète de gestion immobilière pour agences, promoteurs et gestionnaires de biens.",
      tags: ["Immobilier", "Gestion", "Location"],
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2070",
    },
    {
      name: "EduManager",
      result: "La gestion scolaire simplifiée",
      desc: "Plateforme numérique permettant la gestion des élèves, enseignants, notes, présences et paiements scolaires.",
      tags: ["Éducation", "Administration", "École"],
      img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2070",
    },
  ];
  return (
    <div className="lg:pl-16 pt-24 md:pt-44 pb-16 md:pb-24">
      <Helmet>
        <title>Case Studies | Best Pro Digital Success Portfolio</title>
        <meta
          name="description"
          content="Witness the transformation. Explore our collection of high-impact case studies showing significant profit growth, new lead generation, and brand growth."
        />
        <link rel="canonical" href="https://bestprodigital.com/case-studies" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Digital Marketing Case Studies",
              "description": "Documented digital marketing transformations and success stories.",
              "url": "https://bestprodigital.com/case-studies"
            }
          `}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 md:mb-8 font-mono">
            Proof of work
          </p>
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 md:mb-12 text-white">
            Elite <br /> <span className="text-brand-accent">Outcomes.</span>
          </h1>
          <p className="text-neutral-500 text-base md:text-xl max-w-2xl font-light mx-auto md:mx-0">
            We don't publish fluff. These are documented transformations where
            precision marketing met ambitious goals.
          </p>
        </div>

        <div className="grid gap-px bg-brand-border border border-brand-border overflow-hidden rounded-2xl md:rounded-[2rem]">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-brand-primary group grid md:grid-cols-2 overflow-hidden"
            >
              <div className="relative aspect-video md:aspect-auto overflow-hidden order-last md:order-first border-t md:border-t-0 border-brand-border">
                <img
                  src={c.img}
                  alt={`Case Study: ${c.name} - ${c.result} Growth Transformation`}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover transition-all duration-700 lg:grayscale lg:opacity-50 lg:group-hover:grayscale-0 lg:group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-brand-primary/20"></div>
              </div>
              <div className="p-6 sm:p-10 lg:p-20 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest text-brand-accent border border-brand-accent/30 px-2 py-0.5 md:px-3 md:py-1 rounded-full shrink-0"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl md:text-5xl font-black text-white uppercase mb-4 md:mb-6 leading-[0.9] md:leading-none">
                  {c.name}
                </h2>
                <div className="text-lg md:text-2xl font-black text-white/90 italic mb-4 md:mb-6 leading-tight">
                  {c.result}
                </div>
                <p className="text-neutral-500 text-sm md:text-base mb-8 md:mb-12 leading-relaxed">
                  {c.desc}
                </p>
                <Link
                  to="/contact"
                  aria-label={`Get a transformation strategy session similar to ${c.name}`}
                  className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs group-hover:gap-6 transition-all duration-300"
                >
                  Read Full Transformation{" "}
                  <ArrowRight className="text-brand-accent w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
