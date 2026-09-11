import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";

export const Privacy = () => {
  return (
    <div className="lg:pl-16 pt-36 md:pt-44 pb-20 md:pb-24 min-h-screen bg-brand-primary">
      <Helmet>
        <title>Privacy Policy | Best Pro Digital</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.4em] block mb-6">
            Transparency
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12">
            Privacy <br /> Policy.
          </h1>

          <div className="prose prose-invert prose-neutral max-w-none space-y-8 text-neutral-400 font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">
                1. Data Collection
              </h2>
              <p>
                We collect minimal information required to provide our services,
                including contact details provided via our forms and basic usage
                analytics to improve our digital experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">
                2. Usage of Information
              </h2>
              <p>
                Your data is used strictly for communication and service
                delivery. We do not sell your personal information to third
                parties. We use industry-standard encryption for data at rest
                and in transit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">
                3. Cookies & Tracking
              </h2>
              <p>
                We use essential cookies for site functionality and performance
                monitoring. You can manage your cookie preferences through your
                browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">
                4. Compliance
              </h2>
              <p>
                We adhere to global privacy standards and respect your rights
                regarding your data. For any inquiries regarding your
                information, contact headquarters at info@digitalstation.bf
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
