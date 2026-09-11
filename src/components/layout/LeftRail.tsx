import { useEffect, useRef } from "react";
import { Logo } from "../ui/Logo";
import gsap from "gsap";

export const LeftRail = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(logoRef.current, {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.2,
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex fixed left-0 top-0 bottom-0 w-16 border-r border-brand-border flex-col items-center justify-between py-12 z-50 bg-brand-primary"
    >
      <div
        ref={logoRef}
        className="flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer"
      >
        <Logo className="w-8 h-8" />
      </div>
      <div className="rotate-[-90deg] whitespace-nowrap text-[10px] uppercase tracking-[0.3em] opacity-40 origin-center">
        Digital station / {new Date().getFullYear()}
      </div>
      <div className="h-12 w-[1px] bg-brand-border"></div>
    </div>
  );
};
