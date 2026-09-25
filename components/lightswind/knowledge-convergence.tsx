"use client";

import React, { useState, useId, useEffect, useRef, useCallback } from "react";
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

const NO_SOURCES: SourceItem[] = [];

type Point = { x: number; y: number };

export const KnowledgeConvergence: React.FC<KnowledgeConvergenceProps> = ({
  className,
  title,
  sources = NO_SOURCES,
  dotColor = "#3B82F6",
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const filterId = useId();
  const reduced = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const sourceDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hubDotRef = useRef<HTMLDivElement>(null);

  const [offscreen, setOffscreen] = useState(false);
  const beamsActive = !reduced && !offscreen;

  const [coords, setCoords] = useState<{
    leftDots: Point[];
    hubDot: Point;
    width: number;
    height: number;
  }>({
    leftDots: [],
    hubDot: { x: 635, y: 300 },
    width: 1000,
    height: 600,
  });

  const updateCoordinates = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    let hubPoint: Point = {
      x: containerRect.width * 0.65,
      y: containerRect.height * 0.5,
    };

    if (hubDotRef.current) {
      const hubRect = hubDotRef.current.getBoundingClientRect();
      hubPoint = {
        x: hubRect.left - containerRect.left + hubRect.width / 2,
        y: hubRect.top - containerRect.top + hubRect.height / 2,
      };
    }

    const dots: Point[] = sources.map((_, i) => {
      const dotEl = sourceDotRefs.current[i];
      if (dotEl) {
        const dotRect = dotEl.getBoundingClientRect();
        return {
          x: dotRect.left - containerRect.left + dotRect.width / 2,
          y: dotRect.top - containerRect.top + dotRect.height / 2,
        };
      }
      return {
        x: 232,
        y: 80 + (i * 440) / Math.max(1, sources.length - 1),
      };
    });

    setCoords({
      leftDots: dots,
      hubDot: hubPoint,
      width: containerRect.width,
      height: containerRect.height,
    });
  }, [sources]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => {
      setOffscreen(!entry.isIntersecting);
      if (entry.isIntersecting) {
        updateCoordinates();
      }
    });
    io.observe(el);

    return () => io.disconnect();
  }, [updateCoordinates]);

  useEffect(() => {
    updateCoordinates();
    const timer = setTimeout(updateCoordinates, 150);

    const handleResize = () => {
      updateCoordinates();
    };

    window.addEventListener("resize", handleResize);

    const ro =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(updateCoordinates)
        : null;

    if (containerRef.current && ro) {
      ro.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      ro?.disconnect();
    };
  }, [updateCoordinates]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-[480px] lg:min-h-[560px] rounded-[2rem] overflow-hidden select-none flex items-center justify-center p-4 sm:p-8 border border-brand-border bg-brand-primary text-brand-text shadow-[0_0_60px_var(--color-brand-accent-soft)]",
        className,
      )}
    >
      {/* SVG Bezier Beams & Animated Energy Trails precisely connecting nodes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-10"
        viewBox={`0 0 ${coords.width} ${coords.height}`}
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
            <stop offset="0%" stopColor={dotColor} stopOpacity="0.3" />
            <stop offset="45%" stopColor={dotColor} stopOpacity="0.75" />
            <stop offset="85%" stopColor={dotColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={dotColor} stopOpacity="1" />
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

        {/* Render Bezier Stream Lines converging accurately into the central blue hub node */}
        <g>
          {sources.map((src, i) => {
            const startPt = coords.leftDots[i] || {
              x: 232,
              y: 80 + (i * 440) / Math.max(1, sources.length - 1),
            };
            const endPt = coords.hubDot;

            const isHovered = hoveredId === src.id;
            const isAnyHovered = hoveredId !== null;

            const dx = Math.max(40, endPt.x - startPt.x);
            const c1x = startPt.x + dx * 0.45;
            const c1y = startPt.y;
            const c2x = endPt.x - dx * 0.45;
            const c2y = endPt.y;

            const pathD = `M ${startPt.x} ${startPt.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endPt.x} ${endPt.y}`;

            return (
              <g key={src.id}>
                {/* Vector Stream */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={`url(#${filterId}-stream-grad)`}
                  strokeWidth={isHovered ? 3.8 : 2}
                  strokeOpacity={isHovered ? 1 : isAnyHovered ? 0.25 : 0.65}
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
                  strokeOpacity={isHovered ? 1 : 0.45}
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

      {/* Responsive Hub Canvas Content */}
      <div className="relative w-full max-w-5xl h-full flex flex-col md:flex-row items-center justify-between gap-6 z-20 min-w-0">
        {/* Left Side: Source Nodes Stack */}
        <div className="relative z-20 flex flex-col justify-between h-[440px] w-full md:w-auto min-w-[235px]">
          {sources.map((src, i) => {
            const isHovered = hoveredId === src.id;

            return (
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
                <div
                  ref={(el) => {
                    sourceDotRefs.current[i] = el;
                  }}
                  className="relative flex items-center justify-center shrink-0"
                >
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
          <div
            ref={hubDotRef}
            className="relative flex items-center justify-center shrink-0"
          >
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
