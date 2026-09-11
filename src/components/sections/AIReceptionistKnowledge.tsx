import { motion } from "motion/react";
import { 
  Mic2, 
  Cpu, 
  MessageSquare, 
  Clock, 
  Users, 
  Bot, 
  Calendar, 
  PhoneCall, 
  Headphones,
  Signal,
  Database
} from "lucide-react";

export const AIReceptionistKnowledge = () => {
  const capabilities = [
    { 
      title: "Voice Intelligence", 
      desc: "Human-grade NLP (Natural Language Processing) that understands emotion, intent, and complex requests without the 'robot' feel.",
      icon: Mic2,
      stat: "20ms Response"
    },
    { 
      title: "CRM Synergy", 
      desc: "Instant data syncing. The AI doesn't just talk; it updates your GoHighLevel, HubSpot, or Salesforce records in real-time.",
      icon: Database,
      stat: "100% Sync Accuracy"
    },
    { 
      title: "Live Hand-off", 
      desc: "Strategic escalation. If a high-value lead needs a human touch, the AI transfers the call instantly to your desk.",
      icon: Headphones,
      stat: "Smart Routing"
    },
    { 
      title: "Calendar Mastery", 
      desc: "Checking availability and booking appointments directly into your calendar while the prospect is still on the line.",
      icon: Calendar,
      stat: "No Double-Booking"
    }
  ];

  const techSpecs = [
    {
      label: "Zero Latency Engine",
      text: "Our proprietary architecture ensures near-instant verbal responses, eliminating the awkward pauses typical of standard bots.",
      icon: Signal
    },
    {
      label: "Multilingual Core",
      text: "Native fluency in 50+ languages with regional accents to keep the conversation localized and comfortable.",
      icon: Globe
    },
    {
      label: "Sentiment Analysis",
      text: "The AI detects frustration or urgency and adjusts its tone and workflow dynamically to save the lead.",
      icon: Bot
    }
  ];

  return (
    <div className="mt-20 md:mt-32 border-t border-brand-border pt-20 md:pt-32 px-6 md:px-12 pb-20 md:pb-32 max-w-7xl mx-auto">
      <header className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 text-brand-accent mb-6">
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Future of Operations // 03</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.9]">
          AI Receptionist <br />
          <span className="italic font-serif font-light lowercase text-brand-accent">& Chat Bot.</span>
        </h2>
        <p className="max-w-2xl text-neutral-400 text-base md:text-lg leading-relaxed font-light">
          Human staff sleep. Human staff miss calls. Human staff are expensive. Our AI Receptionists work 24/7/365, never take a lunch break, and treat every lead like a VIP from the first syllable.
        </p>
      </header>

      {/* The AI Brain Visualizer */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-24 md:mb-32">
        <div className="lg:col-span-8 bg-brand-surface border border-brand-border rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-10 md:mb-12">
              Conversational <span className="text-brand-accent">Architecture</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <div className="space-y-6 md:space-y-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-accent flex items-center justify-center text-brand-accent text-[10px] font-black flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm mb-2">Intent Detection</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed font-light">The AI analyzes the request in milliseconds to categorize it as an inquiry, complaint, or booking request.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 text-[10px] font-black flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm mb-2">Knowledge Retrieval</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed font-light">It pulls from your custom knowledge base to provide perfectly accurate business information every time.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 text-[10px] font-black flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm mb-2">Action Execution</h4>
                    <p className="text-neutral-500 text-xs leading-relaxed font-light">The AI books the meeting, takes the order, or sends the requested SMS resource instantly.</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-primary p-8 md:p-10 rounded-2xl md:rounded-[2rem] border border-white/5 relative flex items-center justify-center overflow-hidden h-[300px]">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Pulsing Aura */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-32 h-32 md:w-40 md:h-40 bg-brand-accent rounded-full absolute -top-4 -left-4 blur-3xl"
                    />
                    
                    {/* AI Avatar Visual */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-brand-accent/30 p-2 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-brand-accent rounded-full border-t-transparent animate-spin duration-[3s]"></div>
                      <div className="relative">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Headphones className="w-12 h-12 md:w-16 md:h-16 text-brand-accent" />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-brand-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />
                      </div>
                    </div>

                    {/* Chat Bubbles Animation */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 40, y: 0 }}
                          animate={{ 
                            opacity: [0, 1, 0],
                            x: [40, 60 + i * 20],
                            y: [-20 - i * 30, -40 - i * 40]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "easeOut"
                          }}
                          className="absolute bg-brand-accent/10 border border-brand-accent/20 px-3 py-1 rounded-full backdrop-blur-md"
                        >
                          <MessageSquare className="w-3 h-3 text-brand-accent" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center relative z-10">
                     <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] block mb-2">Neural Network Ready</span>
                     <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                        <span className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase italic">Receptionist 3.0</span>
                     </div>
                  </div>
                </div>

                {/* Grid Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #c1ff72 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Waveform Visualization */}
                <div className="absolute bottom-6 md:bottom-10 left-6 right-6 md:left-10 md:right-10 flex items-end justify-center gap-1.5 h-12 z-10">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 6, 16, 4] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-1 bg-brand-accent/40 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 p-8 md:p-12 opacity-5 pointer-events-none">
            <Cpu className="w-48 h-48 md:w-64 md:h-64" />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
          {techSpecs.map((spec, i) => (
            <div key={i} className="bg-brand-surface p-6 md:p-8 border border-brand-border rounded-2xl md:rounded-3xl group">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-brand-border flex items-center justify-center text-brand-accent mb-4 md:mb-6 group-hover:bg-brand-accent group-hover:text-brand-primary transition-all">
                <spec.icon className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold uppercase text-xs md:text-sm mb-2 md:mb-3">{spec.label}</h4>
              <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed font-light">{spec.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Matrix */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {capabilities.map((cap, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 md:p-10 bg-brand-surface border border-brand-border rounded-[1.5rem] md:rounded-[2rem] hover:border-brand-accent/50 transition-all flex flex-col justify-between group"
          >
            <div>
               <cap.icon className="w-6 h-6 md:w-8 md:h-8 text-white mb-6 md:mb-8 group-hover:text-brand-accent transition-colors" />
               <h4 className="text-lg md:text-xl font-bold text-white uppercase mb-4">{cap.title}</h4>
               <p className="text-neutral-500 text-[11px] md:text-xs leading-relaxed font-light">
                 {cap.desc}
               </p>
            </div>
            <div className="mt-8 text-[10px] font-black uppercase text-brand-accent tracking-widest">
               {cap.stat}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 md:mt-24 p-8 md:p-12 bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
        <div className="max-w-xl">
           <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Unmatched Lead Speed.</h3>
           <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-light">
              Average lead response time for small businesses is 42 hours. With our AI Receptionist, that time drops to <span className="text-brand-accent font-bold">1.2 seconds</span>. We don't just answer the phone; we close the gap between searching and spending.
           </p>
        </div>
        <div className="flex gap-6 md:gap-8">
           <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black text-brand-accent">24/7</div>
              <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Always On</div>
           </div>
           <div className="w-px h-12 bg-white/10 hidden md:block" />
           <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-black text-brand-accent">0s</div>
              <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Wait Time</div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Globe = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
