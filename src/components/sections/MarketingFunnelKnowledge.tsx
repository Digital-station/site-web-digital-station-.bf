import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Users, Target, Zap, TrendingUp, CheckCircle2, ArrowRight, MousePointer2 } from 'lucide-react';

export const MarketingFunnelKnowledge = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    {
      title: "Knowing Your Customer",
      desc: "We find out exactly what your customers need and what makes them want to buy from you.",
      icon: <Target className="w-5 h-5" />,
      tag: "STRATEGY",
      color: "text-blue-400"
    },
    {
      title: "Smooth Path to Sale",
      desc: "We make your website so easy to use that nothing stands in the way of a customer's purchase.",
      icon: <Zap className="w-5 h-5" />,
      tag: "DESIGN",
      color: "text-brand-accent"
    },
    {
      title: "Automatic Growth",
      desc: "Our systems automatically educate and follow up with your leads so you don't have to.",
      icon: <Users className="w-5 h-5" />,
      tag: "AUTOMATION",
      color: "text-purple-400"
    }
  ];

  return (
    <div ref={scrollRef} className="mt-20 md:mt-32 border-t border-brand-border pt-24 md:pt-40 px-6 xl:px-12 pb-24 md:pb-40 max-w-[1440px] mx-auto relative overflow-hidden">
      {/* Background Ambient Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-accent rounded-full blur-[100px] md:blur-[150px]"
        />
      </div>

      <header className="mb-20 md:mb-32 relative z-10">
        <div className="flex items-center gap-3 text-brand-accent mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Filter className="w-5 h-5 md:w-6 md:h-6" />
          </motion.div>
          <span className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.5em] font-mono">Precision Architecture</span>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-end">
          <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            Marketing <br/> <span className="text-brand-accent italic font-serif lowercase font-light">Funnel</span> & Systems.
          </h2>
          <p className="text-neutral-400 max-w-xl text-base md:text-xl xl:text-2xl font-light leading-relaxed">
            We build custom systems that work for you 24/7. We optimize every part of your customer's journey, from the first time they see you until they buy, to <span className="text-white font-medium italic">maximize your growth</span>.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-20 xl:gap-24 items-center relative z-10">
        {/* Left Side: Step-by-Step Infrastructure */}
        <div className="lg:col-span-5 space-y-12 sm:space-y-16 xl:space-y-24">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="group relative"
            >
              <div className="absolute -left-6 md:-left-10 xl:-left-12 top-0 text-7xl md:text-8xl xl:text-9xl font-black opacity-[0.03] select-none group-hover:opacity-[0.08] transition-opacity">
                0{i + 1}
              </div>
              
              <div className="relative pl-4 border-l border-brand-border group-hover:border-brand-accent transition-colors duration-500">
                <div className={`text-[9px] md:text-[10px] font-mono mb-4 uppercase tracking-[0.3em] font-bold ${step.color}`}>// {step.tag}</div>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-500">
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-lg md:text-xl font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side: The "Reactor" - Highly Animated Core */}
        <div className="lg:col-span-7 w-full max-w-4xl mx-auto lg:max-w-none">
          <div className="relative aspect-square sm:aspect-[16/10] xl:aspect-[4/5] bg-brand-surface/30 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/5 p-6 sm:p-8 md:p-12 xl:p-16 flex items-center justify-center overflow-hidden shadow-2xl">
             {/* The Mechanical Funnel Core */}
             <div className="relative z-10 w-full max-w-[260px] sm:max-w-[400px]">
                {/* 1. Traffic Intake (Top) */}
                <div className="relative mb-8 md:mb-12">
                   <div className="flex justify-between items-center mb-4 md:mb-6 px-2 md:px-4">
                      <div className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest">Inbound Streams</div>
                      <div className="flex items-center gap-2">
                         <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[7px] md:text-[8px] font-mono text-green-500/60 font-bold">DATA_ACTIVE</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {[1, 2, 3].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            y: [0, 20, 0],
                            opacity: [0.1, 0.4, 0.1],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                          className="h-10 md:h-12 bg-white/5 border border-white/5 rounded-lg md:rounded-xl flex items-center justify-center"
                        >
                           <MousePointer2 className="w-3 h-3 md:w-4 md:h-4 text-white/20" />
                        </motion.div>
                      ))}
                   </div>
                </div>

                {/* 2. The Funnel Visualizer (Center) */}
                <div className="relative flex flex-col items-center gap-3 md:gap-4 py-4 md:py-8 scale-90 sm:scale-100">
                   {/* Awareness Ring */}
                   <motion.div 
                     animate={{ 
                       rotate: 360,
                       scale: [1, 1.05, 1],
                       borderColor: ["rgba(255,255,255,0.05)", "rgba(193,255,114,0.2)", "rgba(255,255,255,0.05)"]
                     }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="w-full h-24 md:h-32 rounded-full border-2 border-dashed flex items-center justify-center relative"
                   >
                      <div className="absolute inset-2 md:inset-4 rounded-full border border-white/5"></div>
                      <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] md:tracking-[0.6em]">New Visitors</span>
                   </motion.div>

                   {/* Connection Line */}
                   <motion.div 
                     animate={{ height: [15, 30, 15], opacity: [0.2, 0.5, 0.2] }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="w-px bg-brand-accent shadow-[0_0_10px_#c1ff72]"
                   />

                   {/* Decision Engine (Diamond) */}
                   <motion.div 
                     animate={{ 
                        rotate: [45, 225, 405],
                        scale: [0.9, 1.1, 0.9]
                     }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                     className="w-16 h-16 md:w-24 md:h-24 bg-brand-accent/10 border border-brand-accent/40 rotate-45 flex items-center justify-center shadow-[0_0_50px_rgba(193,255,114,0.1)] relative"
                   >
                      <motion.div 
                         animate={{ rotate: -45 }}
                         className="flex flex-col items-center"
                      >
                         <Zap className="w-6 h-6 md:w-8 md:h-8 text-brand-accent" />
                         <span className="text-[8px] font-black text-brand-accent uppercase mt-1 hidden md:block">Trust</span>
                      </motion.div>
                   </motion.div>

                   {/* Connection Line */}
                   <motion.div 
                     animate={{ height: [15, 40, 15], opacity: [0.2, 0.8, 0.2] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                     className="w-px bg-brand-accent shadow-[0_0_20px_#c1ff72]"
                   />

                   {/* Conversion Goal (Bottom) */}
                   <motion.div 
                     className="w-full h-20 md:h-24 bg-brand-accent rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-[0_10px_40px_rgba(193,255,114,0.2)] md:shadow-[0_20px_60px_rgba(193,255,114,0.2)] relative overflow-hidden group/goal"
                   >
                      <motion.div 
                         animate={{ x: ["-100%", "200%"] }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />
                      <div className="flex flex-col items-center relative z-10">
                        <span className="text-[10px] md:text-[12px] font-black text-brand-primary uppercase tracking-[0.4em] mb-1">SALES GENERATED</span>
                        <div className="flex gap-1">
                           {[...Array(5)].map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                               transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                               className="w-1 md:w-1.5 h-1 md:h-1.5 bg-brand-primary rounded-full"
                             />
                           ))}
                        </div>
                      </div>
                   </motion.div>
                </div>

                {/* 3. Output Metrics (Floating Labels) */}
                <div className="absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 space-y-3 md:space-y-4 hidden lg:block">
                   {[
                     { label: "BOUNCE RATE", value: "-48%", color: "text-red-400" },
                     { label: "CVR LIFT", value: "+210%", color: "text-brand-accent" },
                     { label: "REV GROWTH", value: "14X", color: "text-purple-400" }
                   ].map((metric, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: 1 + i * 0.2 }}
                       className="bg-brand-primary/80 backdrop-blur-md border border-white/10 p-2 md:p-3 xl:p-4 rounded-xl md:rounded-2xl w-28 md:w-32 xl:w-40"
                     >
                        <div className="text-[6px] md:text-[7px] xl:text-[8px] font-black text-white/40 uppercase tracking-widest">{metric.label}</div>
                        <div className={`text-base md:text-lg xl:text-xl font-black ${metric.color}`}>{metric.value}</div>
                     </motion.div>
                   ))}
                </div>
             </div>

             {/* Background Functional Accents */}
             <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 pattern-grid-white" />
             </div>
             
             {/* Autonomous Data Particles */}
             {[...Array(12)].map((_, i) => (
               <motion.div
                 key={`auto-p-${i}`}
                 initial={{ opacity: 0, y: 0 }}
                 animate={{ 
                   opacity: [0, 0.6, 0],
                   y: [100, 500],
                   x: [i * 40, i * 40 + (Math.random() - 0.5) * 100]
                 }}
                 transition={{ 
                   duration: 4 + Math.random() * 4, 
                   repeat: Infinity, 
                   delay: Math.random() * 5,
                   ease: "linear"
                 }}
                 className="absolute top-0 w-[2px] h-10 bg-gradient-to-b from-brand-accent to-transparent"
               />
             ))}

             {/* ROI Payout Animation (autonomous) */}
             {[...Array(6)].map((_, i) => (
               <motion.div
                 key={`dollar-${i}`}
                 initial={{ opacity: 0, scale: 0, y: 400 }}
                 animate={{ 
                   opacity: [0, 1, 0],
                   scale: [0.5, 1.2, 0.8],
                   y: [400, 550],
                   rotate: [0, 360]
                 }}
                 transition={{ 
                   duration: 2.5, 
                   repeat: Infinity, 
                   delay: i * 0.8,
                   ease: "easeOut"
                 }}
                 className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-accent rounded-full flex items-center justify-center text-brand-primary font-black shadow-[0_0_30px_rgba(193,255,114,0.4)]"
               >
                 $
               </motion.div>
             ))}
          </div>
        </div>
      </div>

      {/* Scroll-Responsive Stats Section */}
      <div className="mt-32 md:mt-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {[
          { label: "Ad Results", value: "8.4x", desc: "For e-commerce scaling models" },
          { label: "Lead Quality", value: "92%", desc: "Verified via multi-step scoring" },
          { label: "Friction Score", value: "0.2", desc: "Near-zero user path resistance" },
          { label: "Retention", value: "+310%", desc: "Lifetime customer value lift" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors"
          >
            <div className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-4">Stat_{i + 1}</div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">{stat.value}</div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">{stat.label}</div>
            <p className="text-neutral-500 text-xs leading-relaxed">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Autonomous Real-time Signal Simulation */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-20 md:mt-32 p-8 md:p-12 bg-brand-accent/5 border border-brand-accent/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        
        <div>
           <div className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-2">Live System Yield</div>
           <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Yielding <span className="text-brand-accent italic font-serif lowercase font-light">compounding</span> returns.
           </h3>
        </div>

        <div className="flex flex-col items-end">
           <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">PROFIT_GENERATED_YTD</div>
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="text-4xl md:text-6xl font-black text-white font-mono flex items-center"
           >
              $<Counter from={1820450} to={9999999} />
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Counter = ({ from, to }: { from: number; to: number }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 500));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return <>{count.toLocaleString()}</>;
};
