import { motion } from "motion/react";
import { 
  Target, 
  MousePointer2, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Zap, 
  Search, 
  PlayCircle, 
  ShoppingBag, 
  Layers,
  Cpu,
  Facebook,
  Instagram,
  Chrome,
  Smartphone
} from "lucide-react";

export const PPCKnowledge = () => {
  const adTypes = [
    { 
      title: "Search Ads", 
      desc: "Capturing high-intent demand. We dominate the top of Google when users search for your exact solutions.",
      icon: Search,
      metrics: "Max CTR: 15%+"
    },
    { 
      title: "Social Ads", 
      desc: "Algorithm-first creative. We build unskippable Meta/TikTok content that stops the scroll and drives impulse.",
      icon: Smartphone,
      metrics: "CPA focus"
    },
    { 
      title: "Video (YouTube)", 
      desc: "Unskippable storytelling. Using Google's first-party data to place your brand in front of engaged viewers.",
      icon: PlayCircle,
      metrics: "CPV optimization"
    },
    { 
      title: "Performance Max", 
      desc: "Google's AI-driven across all channels. We feed the machine the right creative to scale automatically.",
      icon: Cpu,
      metrics: "Sales focused"
    }
  ];

  const platformComparison = [
    {
      platform: "Google Ads",
      philosophy: "Intent-Based Marketing",
      description: "Users are actively searching for your solution. You are solving a problem they already know they have.",
      strengths: ["High Conversion Velocity", "Precise Keyword Targeting", "Bottom-of-Funnel Focus"],
      icon: Chrome,
      color: "from-blue-600/20 to-blue-400/5",
      border: "border-blue-500/20"
    },
    {
      platform: "Meta Ads",
      philosophy: "Interruption Marketing",
      description: "Users are consuming content. We disrupt their flow with hyper-relevant creative that creates a need.",
      strengths: ["Visual Storytelling", "Lookalike Audience Scaling", "Top-of-Funnel Awareness"],
      icon: Facebook,
      color: "from-purple-600/20 to-pink-400/5",
      border: "border-purple-500/20"
    }
  ];

  const deliverySystem = [
    {
      title: "Semantic Bidding",
      text: "We don't bid on words; we bid on intent. Our algorithms adjust bids in real-time based on conversion probability.",
      icon: Zap
    },
    {
      title: "CAPI Integration",
      text: "Server-side tracking that bypasses browser restrictions, ensuring 100% data accuracy for AI training.",
      icon: Cpu
    },
    {
      title: "Creative Matrix",
      text: "Dynamic ad insertion that tests thousands of headline/image combinations simultaneously to find winners.",
      icon: Target
    }
  ];

  return (
    <div className="mt-20 md:mt-32 border-t border-brand-border pt-20 md:pt-32 px-6 md:px-12 pb-20 md:pb-32 max-w-7xl mx-auto">
      <header className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 text-brand-accent mb-6">
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Intelligence // 02</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.9]">
          The Science of <br />
          <span className="italic font-serif font-light lowercase text-brand-accent">Paid Acquisition</span>
        </h2>
        <p className="max-w-2xl text-neutral-400 text-base md:text-lg leading-relaxed font-light">
          PPC is no longer about just "buying keywords." It is about data hygiene and feeding the machine learning the right signals. We architect campaigns that convert attention into equity.
        </p>
      </header>

      {/* Google vs Meta Section */}
      <section className="mb-24 md:mb-32">
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12 flex items-center gap-4">
          The Duopoly <span className="text-brand-accent italic font-serif lowercase">of attention</span>
        </h3>
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {platformComparison.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`p-8 md:p-10 bg-gradient-to-br ${p.color} border ${p.border} rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <p.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full text-white">
                    {p.philosophy}
                  </span>
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 md:mb-6">{p.platform}</h4>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-8 max-w-sm font-light">
                  {p.description}
                </p>
                <ul className="space-y-4">
                  {p.strengths.map((s, si) => (
                    <li key={si} className="flex items-center gap-3 text-[10px] md:text-xs text-white/80 font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <p.icon className="w-48 h-48 md:w-64 md:h-64 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Auction Matrix */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-24 md:mb-32">
        <div className="lg:col-span-7 bg-brand-surface border border-brand-border rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-6 md:mb-8">
              The Quality <span className="text-brand-accent">Edge</span>
            </h3>
            <p className="text-neutral-500 mb-10 md:mb-12 max-w-lg italic text-xs md:text-sm font-light">
              "Your Ad Rank = Max Bid × Quality Score. We win by making your ads better, so you pay less than your competitors for better positions."
            </p>
            
            <div className="space-y-6 md:space-y-8 relative">
                {/* Funnel Viz */}
                <div className="bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[350px] overflow-hidden relative">
                   {/* Traffic Particles */}
                   {[...Array(12)].map((_, i) => (
                      <motion.div
                         key={i}
                         initial={{ y: -20, opacity: 0, x: (i - 6) * 20 }}
                         animate={{ 
                            y: [0, 300], 
                            opacity: [0, 1, 1, 0],
                            scale: [0.3, 0.8, 0.3],
                            x: (i - 6) * 20 + Math.sin(i) * 30
                         }}
                         transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            delay: i * 0.4,
                            ease: "linear"
                         }}
                         className="absolute top-0 w-2 h-2 rounded-full bg-brand-accent/20"
                      />
                   ))}

                   {/* Vertical Funnel Layers */}
                   <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-[220px]">
                      <div className="w-full h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center relative">
                         <div className="absolute inset-0 bg-brand-accent/5 animate-pulse"></div>
                         <span className="text-[9px] font-black text-white/30 tracking-[0.3em]">RELEVANCE</span>
                      </div>
                      <div className="w-[85%] h-10 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center relative">
                         <span className="text-[9px] font-black text-white/50 tracking-[0.3em]">QUALITY SCORE</span>
                      </div>
                      
                      {/* ROI Blast */}
                      <div className="relative pt-4">
                         {[...Array(4)].map((_, i) => (
                            <motion.div
                               key={`coin-${i}`}
                               initial={{ scale: 0, y: 0, opacity: 0 }}
                               animate={{ 
                                  scale: [0, 2, 2.5], 
                                  y: [0, 60], 
                                  opacity: [0, 1, 0],
                                  x: [(i - 1.5) * 40, (i - 1.5) * 80],
                                  rotate: [0, 360]
                               }}
                               transition={{ 
                                  duration: 1.2, 
                                  repeat: Infinity, 
                                  delay: i * 0.3 + 1,
                                  ease: "easeOut" 
                               }}
                               className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-accent text-brand-primary font-black flex items-center justify-center text-xs shadow-[0_0_20px_rgba(193,255,114,0.6)]"
                            >
                               $
                            </motion.div>
                         ))}
                         
                         <motion.div 
                           animate={{ scale: [1, 1.05, 1] }}
                           transition={{ duration: 2, repeat: Infinity }}
                           className="w-10 h-10 md:w-12 md:h-12 bg-brand-accent rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(193,255,114,0.4)]"
                         >
                            <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand-primary" />
                         </motion.div>
                      </div>
                   </div>

                   <div className="absolute bottom-6 left-0 right-0 text-center">
                      <span className="text-[8px] font-black text-brand-accent uppercase tracking-[0.5em] animate-pulse">Bid Cycle Optimization</span>
                   </div>
                </div>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 p-8 opacity-10">
            <MousePointer2 className="w-32 h-32 md:w-48 md:h-48 text-white rotate-12" />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
          {deliverySystem.map((item, i) => (
            <div key={i} className="bg-brand-surface p-6 md:p-8 border border-brand-border rounded-2xl md:rounded-3xl group hover:border-brand-accent/30 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-brand-border flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-white font-black uppercase text-xs md:text-sm tracking-widest">{item.title}</h4>
              </div>
              <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed font-light">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Architecture Visualizer */}
      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12 text-center">
        Channel <span className="text-brand-accent">Ecology</span>
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {adTypes.map((type, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-8 md:p-10 bg-brand-surface border border-brand-border rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden hover:bg-white/[0.02]"
          >
            <div className="relative z-10">
              <div className="mb-6 md:mb-8">
                <type.icon className="w-8 h-8 md:w-10 md:h-10 text-brand-accent mb-4 md:mb-6" />
                <h4 className="text-lg md:text-xl font-bold text-white uppercase mb-4">{type.title}</h4>
                <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed mb-6 font-light">
                  {type.desc}
                </p>
              </div>
              <div className="inline-block px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded text-[9px] font-black uppercase text-brand-accent">
                {type.metrics}
              </div>
            </div>
            
            {/* Design accents */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          </motion.div>
        ))}
      </div>

      {/* Advanced Logic Section */}
      <div className="mt-24 md:mt-32 p-8 md:p-12 lg:p-20 bg-brand-accent text-brand-primary rounded-[2rem] md:rounded-[3rem] overflow-hidden relative group">
          <div className="max-w-4xl relative z-10">
             <div className="flex items-center gap-3 mb-6 opacity-60">
                <PieChart className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Results Prediction Lab</span>
             </div>
             <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                Predictive <br />
                Acquisition <br />
                <span className="italic opacity-70">Modeling.</span>
             </h3>
             <p className="text-brand-primary/80 text-base md:text-lg leading-relaxed mb-10 md:mb-12 max-w-2xl font-bold">
                We don't wait for reports to react. Our proprietary math models predict conversion trends 72 hours before they surface in Google Ads, allowing us to shift budget to victory and cut losses in real-time.
             </p>
             <div className="flex flex-wrap gap-6 md:gap-8">
               <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-black">2.4x</div>
                  <div className="text-[10px] uppercase font-black tracking-widest opacity-60">Avg Profit Lift</div>
               </div>
               <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-black">-40%</div>
                  <div className="text-[10px] uppercase font-black tracking-widest opacity-60">Cost Per Lead Reduc.</div>
               </div>
               <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-black">100%</div>
                  <div className="text-[10px] uppercase font-black tracking-widest opacity-60">Data attribution</div>
               </div>
             </div>
          </div>
          
          <div className="absolute right-0 top-0 h-full w-1/3 pointer-events-none hidden lg:block overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center translate-x-1/4">
                <BarChart3 className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-10 -rotate-12" />
             </div>
          </div>
      </div>
    </div>
  );
};
