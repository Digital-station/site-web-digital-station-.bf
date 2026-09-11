import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";

export const Terms = () => {
  return (
    <div className="lg:pl-16 pt-36 md:pt-44 pb-20 md:pb-24 min-h-screen bg-brand-primary">
      <Helmet>
        <title>Terms of Service | Best Pro Digital</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-brand-accent font-mono text-xs uppercase tracking-[0.4em] block mb-6">Agreement</span>
          <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-12">
            Terms of <br/> Service.
          </h1>
          
          <div className="prose prose-invert prose-neutral max-w-none space-y-8 text-neutral-400 font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">1. Engagement</h2>
              <p>By using this website and our services, you agree to these terms. We operate on a data-driven, results-oriented framework for all digital marketing engagements.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">2. Intellectual Property</h2>
              <p>All content produced by Best Pro Digital, including frameworks and codebases, remains our property unless otherwise specified in individual engagement contracts.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">3. Performance Disclaimers</h2>
              <p>While we optimize for dominance, digital marketing performance is subject to algorithmic fluctuations and market variables beyond our immediate control.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">4. Liability</h2>
              <p>Best Pro Digital is not liable for indirect or consequential losses resulting from market shifts or external platform changes.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
