import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = "https://wa.me/447308505082?text=Hello%20Best%20Pro%20Digital!%20I'm%20ready%20to%20dominate%20the%20Google%20Map%20Pack.%20Can%20we%20discuss%20a%20strategy?";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-[100] lg:bottom-10 lg:right-10"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-brand-accent text-brand-primary rounded-full shadow-[0_10px_30px_rgba(193,255,114,0.3)] hover:scale-105 active:scale-95 transition-all group w-14 h-14 lg:w-auto lg:h-auto lg:px-8 lg:py-5 lg:gap-4"
          >
            <div className="hidden lg:flex flex-col items-start lg:items-center lg:flex-row lg:gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none lg:text-xs">Contact</span>
              <span className="text-sm font-black uppercase tracking-tighter leading-none lg:text-xl"> us </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-brand-primary rounded-full group-hover:translate-x-1 transition-transform lg:shrink-0">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 lg:w-6 lg:h-6 text-brand-accent fill-brand-accent"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.556 4.192 1.613 6.06L0 24l6.105-1.602a11.803 11.803 0 005.937 1.598h.005c6.632 0 12.028-5.391 12.031-12.027a11.815 11.815 0 00-3.666-8.412"/>
              </svg>
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
