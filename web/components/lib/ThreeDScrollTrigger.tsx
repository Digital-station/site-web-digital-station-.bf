'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/* -------------------------
   Utility: wrap
   ------------------------- */
export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

/* -----------------------------------
   Context to share velocity between rows
   ----------------------------------- */
type SharedMarquee = {
  velocityFactor: MotionValue<number>;
  /** True while the pointer is over the container: every row holds still. */
  pausedRef: React.RefObject<boolean>;
  /** True while a user has toggled the marquee off via the pause control. */
  manualPausedRef: React.RefObject<boolean>;
  manualPaused: boolean;
  setManualPaused: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThreeDScrollTriggerContext = React.createContext<SharedMarquee | null>(null);

/**
 * Keyboard/touch-reachable pause control for a marquee — hover alone
 * (WCAG 2.2.2) can't be operated without a mouse. Only usable inside a
 * `ThreeDScrollTriggerContainer`.
 */
export function useThreeDScrollTriggerControls() {
  const shared = useContext(ThreeDScrollTriggerContext);
  if (!shared) return null;
  return {
    paused: shared.manualPaused,
    toggle: () => shared.setManualPaused((p) => !p),
  };
}

/* --------------------------
   Container that provides velocity
   -------------------------- */
export function ThreeDScrollTriggerContainer({
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Hovering stops the marquee (WCAG 2.2.2, pause for moving content). A ref,
  // not state: the frame loop reads it, nothing needs to re-render.
  const pausedRef = useRef(false);

  // Manual pause (button toggle) needs to re-render for the icon/label, but
  // the frame loop still reads a ref so ticking doesn't depend on React state.
  const [manualPaused, setManualPaused] = useState(false);
  const manualPausedRef = useRef(false);
  useEffect(() => {
    manualPausedRef.current = manualPaused;
  }, [manualPaused]);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  const shared = useMemo(
    () => ({ velocityFactor, pausedRef, manualPausedRef, manualPaused, setManualPaused }),
    [velocityFactor, manualPaused],
  );

  return (
    <ThreeDScrollTriggerContext.Provider value={shared}>
      <div
        className={cn("relative w-full", className)}
        onMouseEnter={(e) => {
          pausedRef.current = true;
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          pausedRef.current = false;
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </div>
    </ThreeDScrollTriggerContext.Provider>
  );
}

/* --------------------------
   Row entry — shared or local velocity
   -------------------------- */
export function ThreeDScrollTriggerRow(props: ThreeDScrollTriggerRowProps) {
  const shared = useContext(ThreeDScrollTriggerContext);
  if (shared) {
    return (
      <ThreeDScrollTriggerRowImpl
        {...props}
        velocityFactor={shared.velocityFactor}
        pausedRef={shared.pausedRef}
        manualPausedRef={shared.manualPausedRef}
      />
    );
  }
  return <ThreeDScrollTriggerRowLocal {...props} />;
}

/* --------------------------
   Props
   -------------------------- */
interface ThreeDScrollTriggerRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
  resetIntervalMs?: number;
}

interface ThreeDScrollTriggerRowImplProps extends ThreeDScrollTriggerRowProps {
  velocityFactor: MotionValue<number>;
  pausedRef?: React.RefObject<boolean>;
  manualPausedRef?: React.RefObject<boolean>;
}

/* --------------------------
   Impl with velocity passed in
   -------------------------- */
function ThreeDScrollTriggerRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  pausedRef,
  manualPausedRef,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ThreeDScrollTriggerRowImplProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // A row outside a container pauses on its own hover.
  const hoveredRef = useRef(false);
  const [numCopies, setNumCopies] = useState(3);
  const x = useMotionValue(0);

  const prevTimeRef = useRef<number | null>(null);
  const unitWidthRef = useRef(0);
  const baseXRef = useRef(0);

  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  const BlockContent = useMemo(
    () => (
      <div className="inline-flex shrink-0" style={{ contain: "paint" }}>
        {childrenArray}
      </div>
    ),
    [childrenArray],
  );

  // Measure block width and decide how many copies fill the viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const block = container.querySelector(".threed-scroll-trigger-block") as HTMLElement | null;
    if (block) {
      unitWidthRef.current = block.scrollWidth;
      const containerWidth = container.offsetWidth;
      const needed = Math.max(3, Math.ceil(containerWidth / unitWidthRef.current) + 2);
      setNumCopies(needed);
    }
  }, [childrenArray]);

  const isInView = useInView(containerRef, { margin: "20%" });

  useAnimationFrame((time) => {
    if (!isInView || pausedRef?.current || hoveredRef.current || manualPausedRef?.current) {
      // Forget the last frame, or the first frame back in view (or after a
      // pause) would move the row by the whole time it was stopped.
      prevTimeRef.current = null;
      return;
    }

    if (prevTimeRef.current == null) prevTimeRef.current = time;
    const dt = Math.max(0, (time - prevTimeRef.current) / 1000);
    prevTimeRef.current = time;

    const unitWidth = unitWidthRef.current;
    if (unitWidth <= 0) return;

    const velocity = velocityFactor.get();
    const speedMultiplier = Math.min(5, Math.abs(velocity));
    const scrollDirection = velocity >= 0 ? 1 : -1;
    const currentDirection = direction * scrollDirection;

    const pixelsPerSecond = (unitWidth * baseVelocity) / 100;
    const moveBy = currentDirection * pixelsPerSecond * (1 + speedMultiplier) * dt;

    const newX = baseXRef.current + moveBy;

    if (newX >= unitWidth) {
      baseXRef.current = newX % unitWidth;
    } else if (newX <= 0) {
      baseXRef.current = unitWidth + (newX % unitWidth);
    } else {
      baseXRef.current = newX;
    }

    x.set(baseXRef.current);
  });

  const xTransform = useTransform(x, (v) => `translate3d(${-v}px,0,0)`);

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      onMouseEnter={(e) => {
        hoveredRef.current = true;
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        hoveredRef.current = false;
        onMouseLeave?.(e);
      }}
      {...props}
    >
      <motion.div
        className="inline-flex will-change-transform transform-gpu"
        style={{ transform: xTransform }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            // The copies exist only to fill the loop; a screen reader reads
            // the first one and skips the rest.
            aria-hidden={i > 0 ? true : undefined}
            className={cn(
              "inline-flex shrink-0",
              i === 0 ? "threed-scroll-trigger-block" : "",
            )}
          >
            {BlockContent}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* --------------------------
   Local row (no shared velocity)
   -------------------------- */
function ThreeDScrollTriggerRowLocal(props: ThreeDScrollTriggerRowProps) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ThreeDScrollTriggerRowImpl
      {...props}
      velocityFactor={localVelocityFactor}
    />
  );
}

export default ThreeDScrollTriggerRow;
