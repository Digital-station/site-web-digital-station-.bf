'use client';

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Colour constants per theme.
 *
 * Dark mode features high-contrast luminous cobalt & electric cyan points
 * with radiant glow. Light mode utilizes deep sapphire brand blue with crisp
 * highlights, ensuring vivid visibility across both themes.
 */
type Palette = {
  point: string;
  glow: [string, string, string];
  star: (alpha: number) => string;
  wash: [string, string, string, string];
};

const DARK: Palette = {
  point: "rgba(125, 211, 252, 1)",
  glow: [
    "rgba(56, 189, 248, 0.95)",
    "rgba(37, 99, 235, 0.55)",
    "rgba(37, 99, 235, 0)",
  ],
  star: (a) => `rgba(186, 230, 253, ${Math.min(0.9, a * 2.5)})`,
  wash: [
    "rgba(56, 189, 248, 0.22)",
    "rgba(37, 99, 235, 0.14)",
    "rgba(20, 79, 151, 0.06)",
    "rgba(20, 79, 151, 0)",
  ],
};

const LIGHT: Palette = {
  point: "rgba(20, 79, 151, 0.95)",
  glow: [
    "rgba(37, 99, 235, 0.45)",
    "rgba(20, 79, 151, 0.20)",
    "rgba(20, 79, 151, 0)",
  ],
  star: (a) => `rgba(20, 79, 151, ${Math.min(0.6, a * 4)})`,
  wash: [
    "rgba(37, 99, 235, 0.12)",
    "rgba(20, 79, 151, 0.06)",
    "rgba(20, 79, 151, 0.015)",
    "rgba(20, 79, 151, 0)",
  ],
};

const readPalette = (): Palette =>
  document.documentElement.dataset.theme === "light" ? LIGHT : DARK;

/**
 * Wavemesh — woven-wave point-mesh canvas backdrop.
 *
 * Scales dynamically to occupy the full hero section container.
 * Lifecycle: pauses on tab-hidden and when scrolled out of view.
 * Honours `prefers-reduced-motion` with an instant static frame.
 */
export const Wavemesh = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const c: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;
    const reducedMotion = prefersReducedMotion();

    let palette = readPalette();

    function meshDims() {
      const w = window.innerWidth;
      if (w <= 480) return { rows: 18, cols: 64 };
      if (w <= 768) return { rows: 22, cols: 90 };
      if (w <= 1200) return { rows: 28, cols: 120 };
      return { rows: 34, cols: 150 };
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
      ps: HTMLCanvasElement | null;
      gs: HTMLCanvasElement | null;
      fc: number;
      rot: number;
      mr: MeshPoint[][];
    };

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
      rot: (-38 * Math.PI) / 180, // replaced by fitRotation() on first resize
      mr: [],
    };

    const cl = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const ss = (e0: number, e1: number, v: number) => {
      const t = cl((v - e0) / (e1 - e0), 0, 1);
      return t * t * (3 - 2 * t);
    };

    function hostDims() {
      const parent = c.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      return {
        w: Math.max(w || window.innerWidth, 320),
        h: Math.max(h || window.innerHeight, 480),
      };
    }

    function rz() {
      const dims = hostDims();
      S.w = dims.w;
      S.h = dims.h;
      c.width = dims.w;
      c.height = dims.h;
      c.style.width = "100%";
      c.style.height = "100%";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      S.rot = fitRotation();

      const n = Math.floor((dims.w * dims.h) / 36000);
      S.stars = [];
      for (let i = 0; i < n; i++) {
        const d = i * 127.1;
        S.stars.push({
          x: ((((Math.sin(d) * 43758.5453) % 1) + 1) % 1) * dims.w,
          y: ((((Math.sin(d * 1.31) * 24634.6345) % 1) + 1) % 1) * dims.h,
          r: ((((Math.sin(d * 4.17) * 12345.678) % 1) + 1) % 1) * 1.1 + 0.12,
          a: 0.02 + ((((Math.sin(d * 2.13) * 6789.123) % 1) + 1) % 1) * 0.1,
        });
      }

      const gc = document.createElement("canvas");
      gc.width = 36;
      gc.height = 36;
      const gx = gc.getContext("2d")!;
      const gg = gx.createRadialGradient(18, 18, 0, 18, 18, 18);
      gg.addColorStop(0, palette.glow[0]);
      gg.addColorStop(0.4, palette.glow[1]);
      gg.addColorStop(1, palette.glow[2]);
      gx.fillStyle = gg;
      gx.beginPath();
      gx.arc(18, 18, 18, 0, Math.PI * 2);
      gx.fill();
      S.gs = gc;

      const pc = document.createElement("canvas");
      pc.width = 18;
      pc.height = 18;
      const px = pc.getContext("2d")!;
      px.fillStyle = palette.point;
      px.beginPath();
      px.arc(9, 9, 5.5, 0, Math.PI * 2);
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
      const gx = S.w * 0.85;
      const gy = S.h * 0.9;
      const r = Math.max(S.w, S.h) * 0.65;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
      g.addColorStop(0, palette.wash[0]);
      g.addColorStop(0.3, palette.wash[1]);
      g.addColorStop(0.6, palette.wash[2]);
      g.addColorStop(1, palette.wash[3]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(gx, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /**
     * Unrotated, unit-scale mesh for time `t`. x spans roughly −1…1 along the
     * band, y is the wave height (negative = up, canvas convention).
     */
    function localPoints(t: number) {
      const pts: { x: number; y: number; d: number }[][] = [];
      for (let j = 0; j < S.rows; j++) {
        const d = j / (S.rows - 1);
        const row = [];
        for (let i = 0; i < S.cols; i++) {
          const p = mp(i / (S.cols - 1), d, t);
          row.push({ x: p.x, y: p.y, d });
        }
        pts.push(row);
      }
      return pts;
    }

    /** Bounding box of the band once rotated by `rot` (unit scale). */
    function rotatedBox(pts: { x: number; y: number }[][], rot: number) {
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      let mnX = 1e9, mxX = -1e9, mnY = 1e9, mxY = -1e9;
      for (const row of pts) {
        for (const p of row) {
          const rx = p.x * cr - p.y * sr;
          const ry = p.x * sr + p.y * cr;
          if (rx < mnX) mnX = rx;
          if (rx > mxX) mxX = rx;
          if (ry < mnY) mnY = ry;
          if (ry > mxY) mxY = ry;
        }
      }
      return { mnX, mxX, mnY, mxY, w: mxX - mnX, h: mxY - mnY };
    }

    /**
     * The band runs from the bottom-left corner of the host to its top-right
     * corner. That only works if the tilt matches the host's aspect ratio, so
     * the angle is solved (bisection on the rotated bounding box's aspect,
     * which decreases monotonically with the tilt) rather than hard-coded.
     * Called on resize; the wave motion only nudges the box afterwards.
     */
    function fitRotation() {
      const target = S.w / S.h;
      const pts = localPoints(0);
      let lo = (3 * Math.PI) / 180;
      let hi = (85 * Math.PI) / 180;
      for (let k = 0; k < 24; k++) {
        const mid = (lo + hi) / 2;
        const b = rotatedBox(pts, -mid);
        if (b.w / b.h > target) lo = mid;
        else hi = mid;
      }
      return -(lo + hi) / 2;
    }

    function bm() {
      const pts = localPoints(S.t);
      const b = rotatedBox(pts, S.rot);
      // Fit the band inside the host: the tilt already matches the aspect,
      // so one scale factor touches both the bottom-left and top-right.
      const sc = Math.min(S.w / b.w, S.h / b.h);
      const cr = Math.cos(S.rot);
      const sr = Math.sin(S.rot);
      S.mr = [];
      for (const row of pts) {
        const out: MeshPoint[] = [];
        for (const p of row) {
          const lx = p.x * sc;
          const ly = p.y * sc;
          out.push({ rx: lx * cr - ly * sr, ry: lx * sr + ly * cr, d: p.d });
        }
        S.mr.push(out);
      }
      return { tx: -b.mnX * sc, ty: S.h - b.mxY * sc };
    }

    let rafId: number | null = null;
    let started = false;

    function tryStart() {
      if (rafId || reducedMotion || !started || !inView || document.hidden) return;
      S.lt = 0;
      rafId = requestAnimationFrame(rn);
    }

    function paint(f: { tx: number; ty: number }) {
      const glow = S.gs;
      const point = S.ps;
      if (!glow || !point) return;
      for (let j = 0; j < S.mr.length; j++) {
        const row = S.mr[j];
        const d = row[0].d;
        const fw = 1 - Math.pow(d, 0.72);
        const op = 0.2 + fw * 0.8;
        const rd = 0.65 + fw * 0.85;
        const gs = rd * 5.2;
        const ps = rd * 2.4;
        const off = j & 1;
        ctx.globalAlpha = Math.min(1, op * 0.7);
        for (let i = off; i < row.length; i += 2) {
          const p = row[i];
          ctx.drawImage(glow, p.rx + f.tx - gs / 2, p.ry + f.ty - gs / 2, gs, gs);
        }
        ctx.globalAlpha = Math.min(1, op * 1.15);
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
      // No horizontal mirror on phones any more: the band runs bottom-left
      // to top-right at every width, the same as on desktop.
      ds();
      dg();
      paint(bm());
      rafId = requestAnimationFrame(rn);
    }

    function drawOnce() {
      S.lt = 0;
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

    let lastW = 0;
    let lastH = 0;
    const ro =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            const dims = hostDims();
            if (dims.w === lastW && Math.abs(dims.h - lastH) < 5) return;
            lastW = dims.w;
            lastH = dims.h;
            rz();
            if (reducedMotion) drawOnce();
          });
    if (c.parentElement) ro?.observe(c.parentElement);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    rz();
    drawOnce();

    let idleId: number | null = null;
    let idleTimeoutId: number | null = null;
    if (!reducedMotion) {
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
        "pointer-events-none select-none absolute inset-0 w-full h-full " +
        className
      }
    />
  );
};
