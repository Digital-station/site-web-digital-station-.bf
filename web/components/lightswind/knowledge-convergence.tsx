"use client";

import React, { useState, useId, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export interface SourceItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
}

export interface KnowledgeConvergenceProps {
  /** Root container extra CSS classes */
  className?: string;
  /** Label beside the hub node on the right */
  title?: string;
  /** Custom list of source nodes on the left */
  sources?: SourceItem[];
  /** Primary connection glowing dot & beam accent color */
  dotColor?: string;
}

/* Nothing renders without an explicit `sources` list; the vendor's demo
   list (YouTube / Medium / GitHub / Leetcode / docs) and its icons are gone —
   every call site passes its own sources.

   Also removed from the vendored component: its header logo, version badge,
   `theme` switch and `glowIntensity` / `onTargetClick` props — none of them
   rendered anything. Colours come from the brand tokens, so the panel
   follows the site's light/dark theme instead of staying dark. */
const NO_SOURCES: SourceItem[] = [];

export const KnowledgeConvergence: React.FC<KnowledgeConvergenceProps> = ({
  className,
  title,
  sources = NO_SOURCES,
  dotColor = "#3B82F6",
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const filterId = useId();
  /**
   * SMIL (<animate>, <animateMotion>) is not covered by the global
   * `prefers-reduced-motion` CSS block in globals.css — that only slams CSS
   * animations and transitions. The beams have to be dropped in JS instead.
   */
  const reduced = useReducedMotion();

  /**
   * SMIL loops also ignore CSS `animation-play-state`, so `usePauseOffscreen`
   * (which toggles that property) can't stop them either — the beams have to
   * be unmounted in React while the panel is off screen instead.
   */
  const containerRef = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  const beamsActive = !reduced && !offscreen;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => {
      setOffscreen(!entry.isIntersecting);
    });
    io.observe(el);

    return () => io.disconnect();
  }, []);

  // Normalized 1000 x 600 viewBox layout coordinate system
  const viewBoxWidth = 1000;
  const viewBoxHeight = 600;

  // Left card connection point coordinates directly centered on pill dots
  const leftX = 232;
  const targetX = 635;
  const targetY = 300;

  // Vertical distribution centered around 300
  const sourceCount = sources.length;
  const totalHeight = 440;
  const startY = 80;
  const stepY = sourceCount > 1 ? totalHeight / (sourceCount - 1) : 0;

  const getSourceY = (index: number) => startY + index * stepY;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-[480px] lg:min-h-[560px] rounded-[2rem] overflow-hidden select-none flex items-center justify-center p-4 sm:p-8 border border-brand-border bg-brand-primary text-brand-text shadow-[0_0_60px_var(--color-brand-accent-soft)]",
        className,
      )}
    >
      {/* Responsive Hub Canvas */}
      <div className="relative w-full max-w-5xl h-full flex flex-col md:flex-row items-center justify-between gap-6 z-10 min-w-0">
        {/* SVG Bezier Beams & Animated Energy Trails */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Beam Stream Gradient */}
            <linearGradient
              id={`${filterId}-stream-grad`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={dotColor} stopOpacity="0.2" />
              <stop offset="45%" stopColor={dotColor} stopOpacity="0.72" />
              <stop offset="80%" stopColor={dotColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={dotColor} stopOpacity="0.98" />
            </linearGradient>

            {/* Soft Glow Filter for Electric Beams */}
            <filter
              id={`${filterId}-glow`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glowing Particle Filter */}
            <filter
              id={`${filterId}-dot-glow`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Bezier Stream Lines */}
          <g>
            {sources.map((src, i) => {
              const srcY = getSourceY(i);
              const isHovered = hoveredId === src.id;
              const isAnyHovered = hoveredId !== null;

              // Bezier curve calculations connecting pill node dots to hub node
              const pathD = `M ${leftX} ${srcY} C ${leftX + 180} ${srcY}, ${targetX - 180} ${targetY}, ${targetX} ${targetY}`;

              return (
                <g key={src.id}>
                  {/* Vector Stream */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${filterId}-stream-grad)`}
                    strokeWidth={isHovered ? 3.8 : 2}
                    strokeOpacity={isHovered ? 1 : isAnyHovered ? 0.25 : 0.6}
                    filter={`url(#${filterId}-glow)`}
                    className="transition-all duration-300"
                  />

                  {/* Pulsing Light Dotted Stream */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth={isHovered ? 2.5 : 1.3}
                    strokeDasharray="8 16"
                    strokeOpacity={isHovered ? 1 : 0.4}
                    className="transition-all duration-300"
                  >
                    {beamsActive && (
                      <animate
                        attributeName="stroke-dashoffset"
                        from="48"
                        to="0"
                        dur={isHovered ? "0.9s" : "2.2s"}
                        repeatCount="indefinite"
                      />
                    )}
                  </path>

                  {/* Primary Energy Flow Dot */}
                  <circle
                    r={isHovered ? 4.5 : 3.5}
                    fill={dotColor}
                    filter={`url(#${filterId}-dot-glow)`}
                  >
                    {beamsActive && (
                      <animateMotion
                        path={pathD}
                        dur={isHovered ? "1.3s" : `${2.0 + (i % 3) * 0.4}s`}
                        repeatCount="indefinite"
                        begin={`${(i * 0.3) % 2}s`}
                      />
                    )}
                  </circle>

                  {/* Secondary Energy Particle */}
                  <circle r="2.2" fill={dotColor} opacity="0.9">
                    {beamsActive && (
                      <animateMotion
                        path={pathD}
                        dur={isHovered ? "1.3s" : `${2.0 + (i % 3) * 0.4}s`}
                        repeatCount="indefinite"
                        begin={`${((i * 0.3) % 2) + 1.0}s`}
                      />
                    )}
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Left Side: Source Nodes Stack */}
        <div className="relative z-20 flex flex-col justify-between h-[440px] w-full md:w-auto min-w-[235px]">
          {sources.map((src) => {
            const isHovered = hoveredId === src.id;

            return (
              /* Hover only highlights the matching beam; the cards are not
                 links, so they no longer show a pointer cursor. */
              <motion.div
                key={src.id}
                onMouseEnter={() => setHoveredId(src.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ scale: 1.03, x: 5 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className={cn(
                  "relative flex items-center justify-between gap-4 px-4 py-2.5 rounded-xl border transition-all duration-300 select-none",
                  "bg-brand-surface border-brand-border shadow-xs backdrop-blur-md",
                  "hover:bg-brand-surface-2 hover:border-brand-accent/50 hover:shadow-[0_0_25px_var(--color-brand-accent-soft)]",
                  isHovered && "border-brand-accent/60 bg-brand-surface-2",
                )}
              >
                {/* Source Icon & Title */}
                <div className="flex items-center gap-3">
                  {src.icon}
                  <span className="text-sm font-semibold tracking-wide text-brand-text">
                    {src.label}
                  </span>
                </div>

                {/* Glowing Connection Dot */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-transform duration-300",
                      isHovered && "scale-130",
                    )}
                    style={{
                      backgroundColor: dotColor,
                      boxShadow: `0 0 10px ${dotColor}, 0 0 18px ${dotColor}`,
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-60 pointer-events-none"
                    style={{ backgroundColor: dotColor }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Target Node & Title */}
        <div className="relative z-20 flex items-center gap-5 my-auto md:pl-8 min-w-0 max-w-full">
          {/* Central Hub Node Pulsing Dot */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Glowing Halo */}
            <div
              className="absolute w-14 h-14 rounded-full opacity-70 animate-pulse pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${dotColor} 0%, transparent 70%)`,
                filter: "blur(6px)",
              }}
            />
            {/* Central Node Core */}
            <div
              className="w-4 h-4 rounded-full relative z-10"
              style={{
                backgroundColor: dotColor,
                boxShadow: `0 0 14px ${dotColor}, 0 0 28px ${dotColor}`,
              }}
            />
            <div className="absolute w-9 h-9 rounded-full border border-brand-accent/50 animate-ping pointer-events-none" />
          </div>

          {/* A <p>, not a heading: the title repeats the page's h1, and a
              second h2 with the same text broke the heading outline. The
              width was a fixed 375px, which overflowed phone screens. */}
          {title && (
            <p className="min-w-0 w-full max-w-[375px] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-brand-text leading-[1.05] break-words">
              {title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeConvergence;
