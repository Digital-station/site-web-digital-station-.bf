import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Helmet } from "react-helmet-async";

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary p-6 lg:pl-16">
      <Helmet>
        <title>404 - Mission Diverted | Best Pro Digital</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-brand-accent font-mono text-sm uppercase tracking-[0.5em] block mb-6">Error Code 404</span>
          <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-white/20">
            Mission <br/> Diverted.
          </h1>
          <p className="text-neutral-500 text-lg mb-12 font-light">
            The resource you're hunting for has moved or dissolved into the digital ether. Let's get you back to headquarters.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/"
              className="group flex items-center gap-3 bg-brand-accent text-brand-primary px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <Home className="w-4 h-4" />
              Return to Base
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-3 border border-white/10 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black text-white/[0.02] pointer-events-none select-none italic">
        404
      </div>
    </div>
  );
};
