import { motion } from "motion/react";
import { 
  Database, 
  RefreshCcw, 
  Zap, 
  Users, 
  LineChart, 
  ShieldCheck, 
  Workflow, 
  Cpu, 
  GitMerge,
  Smartphone,
  CheckCircle2,
  Lock
} from "lucide-react";

export const CRMKnowledge = () => {
  const benefits = [
    {
      title: "Data Centralization",
      desc: "Moving beyond spreadsheets. We consolidate every touchpoint—email, phone, ads, and web visits—into a single source of truth.",
      icon: Database,
      stat: "Zero Data Silos"
    },
    {
      title: "Lead Intelligence",
      desc: "Knowing exactly where a lead came from and their behavioral history before you even pick up the phone to call them.",
      icon: Users,
      stat: "100% Attribution"
    },
    {
      title: "Automated Nurture",
      desc: "The CRM never forgets. It automatically follows up with leads via SMS and Email at perfect intervals to maximize conversion.",
      icon: RefreshCcw,
      stat: "24/7 Follow-up"
    },
    {
      title: "Predictive Analytics",
      desc: "Using historical data to forecast future revenue and identify which marketing channels are actually driving the most profit.",
      icon: LineChart,
      stat: "Growth Results"
    }
  ];

  const crmPillars = [
    { label: "Operational", text: "Streamlining day-to-day sales tasks, calendar management, and pipeline visibility." },
    { label: "Analytical", text: "Processing customer data to identify trends, churn risks, and upsell opportunities." },
    { label: "Collaborative", text: "Ensuring your marketing, sales, and support teams are all looking at the same customer profile." }
  ];

  return (
    <div className="mt-20 md:mt-32 border-t border-brand-border pt-20 md:pt-32 px-6 md:px-12 pb-20 md:pb-32 max-w-7xl mx-auto">
      <header className="mb-20">
        <div className="flex items-center gap-3 text-brand-accent mb-6">
          <Database className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Infrastructure // 07</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-none">
          The Central <br />
          <span className="italic font-serif font-light lowercase text-brand-accent">Intelligence</span> Agency.
        </h2>
        <p className="max-w-2xl text-neutral-400 text-lg leading-relaxed">
          A CRM is the heart of your business operations. Without it, you are guessing. With it, you are operating with surgical precision. We don't just "install" software; we architect ecosystems that scale.
        </p>
      </header>

      {/* Modern CRM Architecture Visual */}
      <div className="grid lg:grid-cols-12 gap-12 mb-32">
        <div className="lg:col-span-8 bg-brand-surface border border-brand-border rounded-[3rem] p-12 lg:p-16 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-12">
              The Integration <span className="text-brand-accent italic font-serif lowercase">of everything.</span>
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center text-center">
                 <Smartphone className="w-10 h-10 text-white/20 mb-6" />
                 <h4 className="text-sm font-bold text-white uppercase mb-2">Sources</h4>
                 <p className="text-[10px] text-neutral-500 leading-relaxed">Ads, Website, Social, Referrals</p>
              </div>
              <div className="flex items-center justify-center">
                 <GitMerge className="w-12 h-12 text-brand-accent opacity-40 animate-pulse" />
              </div>
              <div className="p-8 bg-brand-accent rounded-3xl flex flex-col items-center text-center">
                 <Database className="w-10 h-10 text-brand-primary mb-6" />
                 <h4 className="text-sm font-bold text-brand-primary uppercase mb-2">The Vault</h4>
                 <p className="text-[10px] text-brand-primary/60 leading-relaxed font-bold">Standardized, Secured, & Actionable Data</p>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-white/5">
               <div className="flex flex-wrap gap-4">
                  {["GHL", "HubSpot", "Salesforce", "Pipedrive", "ZohO"].map((logo) => (
                    <div key={logo} className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-white/30 uppercase tracking-widest">{logo}</div>
                  ))}
               </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
             <Workflow className="w-[500px] h-[500px]" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-brand-surface p-10 border border-brand-border rounded-[3rem] h-full flex flex-col justify-between">
              <div>
                 <Zap className="text-brand-accent w-10 h-10 mb-8" />
                 <h4 className="text-2xl font-black uppercase text-white tracking-tighter mb-4 italic">Lead Speed.</h4>
                 <p className="text-xs text-neutral-400 leading-relaxed">
                   When a lead submits a form, they enter your CRM in 0.4 seconds. My system triggers an 'Instant Call' or 'SMS sequence' before they even close the browser tab.
                 </p>
              </div>
              <div className="mt-8 p-6 bg-brand-accent/5 border border-brand-accent/10 rounded-2xl">
                 <div className="text-[9px] font-black uppercase text-brand-accent tracking-widest mb-1">Conversion Boost</div>
                 <div className="text-2xl font-black text-white">+300%</div>
              </div>
           </div>
        </div>
      </div>

      {/* Importance Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {benefits.map((benefit, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-brand-surface border border-brand-border rounded-[2.5rem] hover:bg-white/[0.02] transition-all flex flex-col justify-between group"
          >
            <div>
               <benefit.icon className="w-10 h-10 text-brand-accent mb-8 group-hover:scale-110 transition-transform" />
               <h4 className="text-xl font-bold text-white uppercase mb-4">{benefit.title}</h4>
               <p className="text-neutral-500 text-xs leading-relaxed">
                 {benefit.desc}
               </p>
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
               <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{benefit.stat}</span>
               <CheckCircle2 className="w-4 h-4 text-brand-accent" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CRM Pillars / Logic */}
      <div className="bg-brand-surface border border-brand-border rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group">
         <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
                  The Three Pillars of <br/> <span className="text-brand-accent italic font-serif lowercase">Sustainable Scaling.</span>
               </h3>
               <p className="text-neutral-400 mb-12 leading-relaxed">
                  A CRM isn't just a database; it's a philosophy of growth. We map your integrations across these three axes to ensure no lead is left behind and no data is wasted.
               </p>
               <div className="space-y-6">
                  {crmPillars.map((p, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-bold uppercase text-sm">{p.label} Strategy</h4>
                          <span className="text-brand-accent text-xs font-mono">0{i+1}</span>
                       </div>
                       <p className="text-neutral-500 text-xs leading-relaxed group-hover:text-neutral-300 transition-colors">
                          {p.text}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="relative">
               <div className="aspect-square bg-black/40 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 p-6 sm:p-12 flex items-center justify-center relative overflow-hidden group">
                  {/* Central CRM Node */}
                  <div className="relative z-10 text-center scale-90 sm:scale-100">
                     <div className="relative mb-6 sm:mb-8 mx-auto w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-brand-accent/5 rounded-full border border-brand-accent/10">
                        <motion.div 
                           animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                           transition={{ duration: 3, repeat: Infinity }}
                           className="absolute inset-0 bg-brand-accent rounded-full blur-2xl"
                        />
                        <Database className="w-8 h-8 sm:w-12 sm:h-12 text-brand-accent relative z-10" />
                        
                        {/* Data Flow Lines */}
                        {[...Array(4)].map((_, i) => (
                           <motion.div
                              key={i}
                              animate={{ 
                                 rotate: [0, 360]
                              }}
                              transition={{ 
                                 duration: 4, 
                                 repeat: Infinity, 
                                 delay: i * 1,
                                 ease: "linear"
                              }}
                              className="absolute inset--8 pointer-events-none"
                           >
                              <motion.div 
                                 animate={{ x: [-20, 40, -20] }}
                                 transition={{ duration: 2, repeat: Infinity }}
                                 className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-accent/40 rounded-full blur-sm"
                              />
                           </motion.div>
                        ))}
                     </div>
                     <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-2 sm:mb-4">SYNC Engine 7.0</h4>
                     <div className="flex items-center gap-2 justify-center">
                        <motion.div 
                           animate={{ opacity: [0, 1, 0] }}
                           transition={{ duration: 1, repeat: Infinity }}
                           className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full"
                        />
                        <span className="text-[8px] sm:text-[10px] text-white/40 uppercase tracking-[0.3em]">Processing Inbound Pipeline</span>
                     </div>
                  </div>
                  
                  {/* Floating App Logos (Dots) */}
                  {[...Array(6)].map((_, i) => (
                     <motion.div
                        key={i}
                        animate={{ 
                           y: [0, -100, 0],
                           x: [0, i % 2 === 0 ? 50 : -50, 0],
                           opacity: [0.1, 0.5, 0.1]
                        }}
                        transition={{ 
                           duration: 5 + i, 
                           repeat: Infinity, 
                           ease: "easeInOut" 
                        }}
                        className="absolute w-10 h-10 sm:w-12 sm:h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        style={{ 
                           top: `${20 + (i * 15)}%`, 
                           left: `${10 + (i * 12)}%` 
                        }}
                     >
                        <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4 text-white/20" />
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
