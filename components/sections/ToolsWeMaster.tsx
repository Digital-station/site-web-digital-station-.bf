"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ToolCard } from "./tools/ToolCard";
import { TOOLS_ROW_1, TOOLS_ROW_2 } from "./tools/tools-data";

/**
 * Static, non-animated fallback: the same logos in two plain rows that scroll
 * horizontally by hand. This is what renders before the marquee chunk lands,
 * and what renders instead of it under `prefers-reduced-motion: reduce`.
 */
function StaticRows() {
  return (
    <div className="space-y-5 md:space-y-8">
      {[TOOLS_ROW_1, TOOLS_ROW_2].map((row, i) => (
        <div key={i} className="w-full overflow-x-auto whitespace-nowrap">
          <div className="inline-flex">
            {row.map((tool) => (
              <ToolCard key={tool.name} {...tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Named export + `@/` path, so all three `next/dynamic` call sites in the
 * tree look the same (Hero → Wavemesh, ServiceDetail → KnowledgeConvergence).
 *
 * NOTE for whoever sees the console 404 on
 * `.../components_sections_tools_ToolsMarquee_tsx_<hash>._.js`: that is a
 * `<link rel="preload" fetchPriority="low">` hint from a STALE Turbopack dev
 * manifest — the predicted chunk name does not change even when this module
 * does, and the real chunk still resolves on import (the marquee mounts, the
 * logos paint). It is a dev-cache artifact, not a wiring bug; a fresh
 * `next build` emits the correct name.
 */
const ToolsMarquee = dynamic(
  () =>
    import("@/components/sections/tools/ToolsMarquee").then(
      (m) => m.ToolsMarquee,
    ),
  { ssr: false, loading: () => <StaticRows /> },
);

export function ToolsWeMaster() {
  const t = useTranslations("home.tools");
  const reduced = useReducedMotion();

  // The marquee (Motion's useScroll/useVelocity + the whole Motion runtime)
  // used to load when this section hydrated — i.e. on page load, two screens
  // below the fold. Now it loads when the section is 400 px from the
  // viewport. StaticRows renders on the server AND the first client render,
  // so hydration matches; the swap happens before the visitor gets here.
  const sectionRef = useRef<HTMLElement>(null);
  const [marqueeNear, setMarqueeNear] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMarqueeNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMarqueeNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="lg:pl-16 border-t border-brand-border py-12 lg:py-16 overflow-hidden"
    >
      <Container>
        <div className="mb-14 md:mb-20 text-center">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.15] text-balance break-words">
            {t("titleLead")}{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="mt-6 text-brand-muted text-sm md:text-base leading-relaxed font-light max-w-xl mx-auto">
            {t("body")}
          </p>
        </div>
      </Container>

      {/* Velocity-reactive marquee — full-bleed within the left-rail gutter */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-brand-primary to-transparent" />

        {reduced || !marqueeNear ? <StaticRows /> : <ToolsMarquee />}
      </div>
    </section>
  );
}
