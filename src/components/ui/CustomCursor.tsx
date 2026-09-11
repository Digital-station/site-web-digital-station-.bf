import { useEffect, useRef } from "react";
import gsap from "gsap";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const onMouseEnterLink = () => {
      gsap.to(cursor, { scale: 1.5, opacity: 0.5 });
      gsap.to(follower, { scale: 3, opacity: 0.1, backgroundColor: "#C1FF72" });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursor, { scale: 1, opacity: 1 });
      gsap.to(follower, { scale: 1, opacity: 0.3, backgroundColor: "transparent" });
    };

    window.addEventListener("mousemove", onMouseMove);

    const links = document.querySelectorAll("a, button, .cursor-pointer");
    links.forEach(link => {
      link.addEventListener("mouseenter", onMouseEnterLink);
      link.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      links.forEach(link => {
        link.removeEventListener("mouseenter", onMouseEnterLink);
        link.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-brand-accent rounded-full z-[9999] mix-blend-difference hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-brand-accent rounded-full z-[9998] opacity-30 hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
};
