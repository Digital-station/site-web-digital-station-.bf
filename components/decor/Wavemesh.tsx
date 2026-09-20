'use client';

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Colour constants per theme.
 *
 * The dark palette is the original sketch's. The light one is the true brand
 * blue #144F97 (rgb 20 79 151) — the pale blue-white points the dark sketch
 * uses are invisible on the cream light-mode background, so the whole canvas
 * simply vanished when the visitor switched themes.
 */
type Palette = {
  point: string;
  glow: [string, string, string];
  star: (alpha: number) => string;
  wash: [string, string, string, string];
};

const DARK: Palette = {
  point: "rgba(238,244,255,1)",
  glow: [
    "rgba(210,228,255,0.50)",
    "rgba(210,228,255,0.22)",
    "rgba(210,228,255,0)",
  ],
  star: (a) => `rgba(190,220,255,${a})`,
  wash: [
    "rgba(76,170,255,0.10)",
    "rgba(44,126,214,0.05)",
    "rgba(24,82,146,0.018)",
    "rgba(24,82,146,0)",
  ],
};

const LIGHT: Palette = {
  point: "rgba(20,79,151,0.85)",
  glow: ["rgba(20,79,151,0.18)", "rgba(20,79,151,0.08)", "rgba(20,79,151,0)"],
  star: (a) => `rgba(20,79,151,${Math.min(0.35, a * 4)})`,
  wash: [
    "rgba(20,79,151,0.06)",
    "rgba(20,79,151,0.03)",
    "rgba(20,79,151,0.012)",
    "rgba(20,79,151,0)",
  ],
};

const readPalette = (): Palette =>
  document.documentElement.dataset.theme === "light" ? LIGHT : DARK;

/**
 * Wavemesh — woven-wave point-mesh canvas backdrop.
 *
 * Faithful React port of the standalone Home.html "Wavemesh" sketch.
 * The mesh is anchored to the BOTTOM of its positioned parent (the wave
 * emerges from the canvas's bottom edge), so the parent should be
 * `position: relative` and tall enough to show it. `pointer-events: none`
 * lets clicks pass through to the content above.
 *
 * Lifecycle: pauses on tab-hidden (original behaviour) AND when the
 * canvas scrolls out of view (perf addition — the hero leaves the
 * viewport quickly). Honours `prefers-reduced-motion` (one static frame).
 */
export const Wavemesh = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Re-bound with explicit non-null types. The guards above already prove
    // both are non-null, but TypeScript drops that narrowing inside the
    // hoisted `function` declarations below (they could, in principle, be
    // called before the guard runs). The Vite build never surfaced this
    // because its tsconfig has no `strict`.
    const c: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    // The mesh is a square canvas anchored to the bottom-right of the hero
    // block. Its side used to be a hard `min(608, vw, vh)`, which left the wave
    // covering only ~60% of that block's height. It is now measured from the
    // positioned parent, so the canvas is exactly as tall as the section; the
    // extra width overflows the measure and is clipped by the section's
    // `overflow-hidden`. The bounds below are a sanity clamp, not a design size.
    const MIN_SIDE = 360;
    const MAX_SIDE = 1600;
    const reducedMotion = prefersReducedMotion();

    // Re-read on every theme flip; the sprite canvases below are baked from it.
    let palette = readPalette();

    function meshDims() {
      const w = window.innerWidth;
      if (w <= 480) return { rows: 14, cols: 56 };
      if (w <= 768) return { rows: 18, cols: 80 };
      if (w <= 1200) return { rows: 24, cols: 110 };
      return { rows: 30, cols: 140 };
    }

    type Star = { x: number; y: number; r: number; a: number };
    type MeshPoint = { rx: number; ry: number; d: number };
    type MeshState = {
      w: number;
      h: number;
      t: number;
      rows: number;
      cols: number;
      lt: number;
      fp: number;
      fv: number;
      bp: number;
      bv: number;
      wa: number;
      stars: Star[];
      /** Pre-rendered glow sprite; created in `rz()`. */
      ps: HTMLCanvasElement | null;
      /** Pre-rendered point sprite; created in `rz()`. */
      gs: HTMLCanvasElement | null;
      fc: number;
      rot: number;
      mr: MeshPoint[][];
    };

    // Numeric state bag — direct port of the original sketch's `S`, typed.
    const S: MeshState = {
      w: 0,
      h: 0,
      t: 0,
      rows: meshDims().rows,
      cols: meshDims().cols,
      lt: 0,
      fp: 0.38,
      fv: 0.55,
      bp: -0.1,
      bv: 0.18,
      wa: 0.1,
      stars: [],
      ps: null,
      gs: null,
      fc: 0,
      rot: (-40 * Math.PI) / 180,
      mr: [],
    };

    const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const ss = (e0: number, e1: number, v: number) => {
      const t = cl((v - e0) / (e1 - e0), 0, 1);
      return t * t * (3 - 2 * t);
    };

    /** Side of the square canvas: the height of the positioned parent. */
    function hostSide() {
      const h = c.parentElement ? c.parentElement.clientHeight : 0;
      return Math.round(cl(h || window.innerHeight, MIN_SIDE, MAX_SIDE));
    }

    function rz() {
      const s = hostSide();
      S.w = s;
      S.h = s;
      c.width = s;
      c.height = s;
      c.style.width = s + "px";
      c.style.height = s + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const n = Math.floor((s * s) / 46000);
      S.stars = [];
      for (let i = 0; i < n; i++) {
        const d = i * 127.1;
        S.stars.push({
          x: ((((Math.sin(d) * 43758.5453) % 1) + 1) % 1) * s,
          y: ((((Math.sin(d * 1.31) * 24634.6345) % 1) + 1) % 1) * s,
          r: ((((Math.sin(d * 4.17) * 12345.678) % 1) + 1) % 1) * 0.9 + 0.08,
          a: 0.015 + ((((Math.sin(d * 2.13) * 6789.123) % 1) + 1) % 1) * 0.07,
        });
      }

      const gc = document.createElement("canvas");
      gc.width = 32;
      gc.height = 32;
      const gx = gc.getContext("2d")!;
      const gg = gx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gg.addColorStop(0, palette.glow[0]);
      gg.addColorStop(0.35, palette.glow[1]);
      gg.addColorStop(1, palette.glow[2]);
      gx.fillStyle = gg;
      gx.beginPath();
      gx.arc(16, 16, 16, 0, Math.PI * 2);
      gx.fill();
      S.gs = gc;

      const pc = document.createElement("canvas");
      pc.width = 16;
      pc.height = 16;
      const px = pc.getContext("2d")!;
      px.fillStyle = palette.point;
      px.beginPath();
      px.arc(8, 8, 5, 0, Math.PI * 2);
      px.fill();
      S.ps = pc;
    }

    function fs(xn: number) {
      const v = cl(xn, -1, 1);
      const vx = 0.72;
      const lr = (a: number, b: number, t: number) => a + (b - a) * t;
      if (v <= -vx) return lr(0, -1, ss(-1, -vx, v));
      if (v <= 0) return lr(-1, 1, ss(-vx, 0, v));
      if (v <= vx) return lr(1, -1, ss(0, vx, v));
      return lr(-1, 0, ss(vx, 1, v));
    }

    function mp(u: number, v: number, t: number) {
      const xn = 2 * u - 1;
      const d = v;
      const em = Math.max(0, 1 - Math.pow(Math.abs(xn), 1.35));
      const wc = 1 - 0.18 * Math.pow(d, 1);
      const sh = fs(xn / Math.max(0.001, wc));
      const pk = Math.max(0, sh);
      const vl = Math.max(0, -sh);
      const pa = S.fp + (S.bp - S.fp) * d;
      const va = S.fv + (S.bv - S.fv) * d;
      const bs = S.bv * (1 - Math.exp(-2.2 * d)) * 0.65;
      const ph = t * 1.2;
      const we = em * (0.15 + 0.85 * d);
      const tw = Math.sin(xn * 5.2 - d * 7.5 + ph);
      const sw = Math.sin(xn * 2.8 + d * 4.8 - ph * 0.8);
      const wo = S.wa * we * (tw * 0.7 + sw * 0.3);
      const y = (-pk * pa + vl * va + pk * bs + wo) * em;
      const finalX =
        xn * (1.06 - 0.18 * Math.pow(d, 1.05)) +
        0.0007 * Math.sin(1.6 * d + 2 * xn - 0.35 * t) * d * em;
      return { x: finalX, y };
    }

    function ds() {
      ctx.save();
      for (let i = 0; i < S.stars.length; i++) {
        const st = S.stars[i];
        ctx.beginPath();
        ctx.fillStyle = palette.star(st.a);
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function dg() {
      const gx = S.w * 1.34;
      const gy = S.h * 1.8;
      const r = S.w * 0.3;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
      g.addColorStop(0, palette.wash[0]);
      g.addColorStop(0.2, palette.wash[1]);
      g.addColorStop(0.48, palette.wash[2]);
      g.addColorStop(1, palette.wash[3]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function bm() {
      const t = S.t;
      const bs = S.w * 0.64;
      const cr = Math.cos(S.rot);
      const sr = Math.sin(S.rot);
      let mnX = 1e9;
      let mxX = -1e9;
      let mnY = 1e9;
      let mxY = -1e9;
      S.mr = [];
      for (let j = 0; j < S.rows; j++) {
        const d = j / (S.rows - 1);
        const row: MeshPoint[] = [];
        for (let i = 0; i < S.cols; i++) {
          const u = i / (S.cols - 1);
          const p = mp(u, d, t);
          const lx = p.x * bs;
          const ly = p.y * bs;
          const rx = lx * cr - ly * sr;
          const ry = lx * sr + ly * cr;
          mnX = Math.min(mnX, rx);
          mxX = Math.max(mxX, rx);
          mnY = Math.min(mnY, ry);
          mxY = Math.max(mxY, ry);
          row.push({ rx, ry, d });
        }
        S.mr.push(row);
      }
      return { tx: -mnX, ty: S.h - mxY };
    }

    let rafId: number | null = null;
    // Gates the very first start: flips true once the browser has gone idle
    // (or a fallback timer fires), so the ~4,200-point mesh's per-frame
    // drawImage cost lands after first paint/hydration instead of competing
    // with it. IntersectionObserver/visibilitychange fire almost immediately
    // since the canvas is above the fold, so they route through `tryStart`
    // too rather than calling requestAnimationFrame directly.
    let started = false;

    function tryStart() {
      if (rafId || reducedMotion || !started || !inView || document.hidden) return;
      S.lt = 0;
      rafId = requestAnimationFrame(rn);
    }

    function paint(f: { tx: number; ty: number }) {
      // Sprites are built in rz(), which always runs before the first paint.
      const glow = S.gs;
      const point = S.ps;
      if (!glow || !point) return;
      for (let j = 0; j < S.mr.length; j++) {
        const row = S.mr[j];
        const d = row[0].d;
        const fw = 1 - Math.pow(d, 0.72);
        const op = 0.08 + fw * 0.42;
        const rd = 0.52 + fw * 0.72;
        const gs = rd * 4.4;
        const ps = rd * 2;
        const off = j & 1;
        ctx.globalAlpha = op * 0.28;
        for (let i = off; i < row.length; i += 2) {
          const p = row[i];
          ctx.drawImage(glow, p.rx + f.tx - gs / 2, p.ry + f.ty - gs / 2, gs, gs);
        }
        ctx.globalAlpha = op;
        for (let i = 0; i < row.length; i++) {
          const p = row[i];
          ctx.drawImage(point, p.rx + f.tx - ps / 2, p.ry + f.ty - ps / 2, ps, ps);
        }
      }
    }

    function rn(ts: number) {
      if (!S.lt) S.lt = ts;
      const dt = Math.min((ts - S.lt) / 1000, 0.05);
      S.lt = ts;
      S.t += dt;
      ctx.clearRect(0, 0, S.w, S.h);
      if (window.innerWidth <= 768) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-S.w, 0);
      }
      ds();
      dg();
      paint(bm());
      if (window.innerWidth <= 768) ctx.restore();
      rafId = requestAnimationFrame(rn);
    }

    function drawOnce() {
      S.lt = 0;
      bm();
      const f = bm();
      ctx.clearRect(0, 0, S.w, S.h);
      ds();
      dg();
      paint(f);
    }

    function onResize() {
      const nd = meshDims();
      S.rows = nd.rows;
      S.cols = nd.cols;
      rz();
      if (reducedMotion) drawOnce();
    }

    function onVis() {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        tryStart();
      }
    }

    // Pause when the canvas scrolls out of view (perf — original only paused on tab-hidden).
    let inView = true;
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          inView = e.isIntersecting;
          if (inView) {
            tryStart();
          } else if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        },
        { threshold: 0 },
      );
      io.observe(c);
    }

    /**
     * The point and glow sprites are pre-rendered offscreen canvases, so a
     * theme change has to rebuild them — `rz()` does that. Watching the
     * attribute the ThemeProvider writes is the only signal available; there
     * is no CSS to inherit inside a canvas.
     */
    const themeObserver = new MutationObserver(() => {
      const next = readPalette();
      if (next === palette) return;
      palette = next;
      rz();
      if (reducedMotion) drawOnce();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    /**
     * The hero block reflows on things `resize` never fires for — webfont swap,
     * locale switch, the headline rewrapping. Re-measure whenever the parent's
     * box changes, but only redo the (allocating) resize when the side actually
     * moves, so a width-only reflow costs nothing.
     */
    let lastSide = 0;
    const ro =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            const next = hostSide();
            if (next === lastSide) return;
            lastSide = next;
            rz();
            if (reducedMotion) drawOnce();
          });
    if (c.parentElement) ro?.observe(c.parentElement);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    rz();

    let idleId: number | null = null;
    let idleTimeoutId: number | null = null;
    if (reducedMotion) {
      drawOnce();
    } else {
      const beginAnimating = () => {
        idleId = null;
        idleTimeoutId = null;
        started = true;
        tryStart();
      };
      const ric = (window as typeof window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;
      if (ric) {
        idleId = ric(beginAnimating, { timeout: 1500 });
      } else {
        idleTimeoutId = window.setTimeout(beginAnimating, 300);
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (idleId !== null) {
        (
          window as typeof window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(idleId);
      }
      if (idleTimeoutId !== null) clearTimeout(idleTimeoutId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      themeObserver.disconnect();
      io?.disconnect();
      ro?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        // No width/height attributes: `rz()` sets both, plus the matching CSS
        // size, on mount. `h-full` keeps the single pre-measure frame at the
        // right height instead of flashing the old 608px square.
        "pointer-events-none select-none absolute bottom-0 right-0 h-full max-md:left-0 max-md:right-auto " +
        className
      }
    />
  );
};
