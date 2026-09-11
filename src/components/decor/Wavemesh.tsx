import { useEffect, useRef } from "react";

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
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const B = 608; // max canvas dimension
    const reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function meshDims() {
      const w = window.innerWidth;
      if (w <= 480) return { rows: 14, cols: 56 };
      if (w <= 768) return { rows: 18, cols: 80 };
      if (w <= 1200) return { rows: 24, cols: 110 };
      return { rows: 30, cols: 140 };
    }

    // Loose numeric state bag — direct port of the original sketch's `S`.
    const S: any = {
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

    function rz() {
      const s = Math.min(B, window.innerWidth, window.innerHeight);
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
      gg.addColorStop(0, "rgba(210,228,255,0.50)");
      gg.addColorStop(0.35, "rgba(210,228,255,0.22)");
      gg.addColorStop(1, "rgba(210,228,255,0)");
      gx.fillStyle = gg;
      gx.beginPath();
      gx.arc(16, 16, 16, 0, Math.PI * 2);
      gx.fill();
      S.gs = gc;

      const pc = document.createElement("canvas");
      pc.width = 16;
      pc.height = 16;
      const px = pc.getContext("2d")!;
      px.fillStyle = "rgba(238,244,255,1)";
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
        ctx.fillStyle = "rgba(190,220,255," + st.a + ")";
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
      g.addColorStop(0, "rgba(76,170,255,0.10)");
      g.addColorStop(0.2, "rgba(44,126,214,0.05)");
      g.addColorStop(0.48, "rgba(24,82,146,0.018)");
      g.addColorStop(1, "rgba(24,82,146,0)");
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
        const row: any[] = [];
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

    function paint(f: { tx: number; ty: number }) {
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
          ctx.drawImage(S.gs, p.rx + f.tx - gs / 2, p.ry + f.ty - gs / 2, gs, gs);
        }
        ctx.globalAlpha = op;
        for (let i = 0; i < row.length; i++) {
          const p = row[i];
          ctx.drawImage(S.ps, p.rx + f.tx - ps / 2, p.ry + f.ty - ps / 2, ps, ps);
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
      } else if (!rafId && !reducedMotion && inView) {
        S.lt = 0;
        rafId = requestAnimationFrame(rn);
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
          if (inView && !document.hidden && !rafId && !reducedMotion) {
            S.lt = 0;
            rafId = requestAnimationFrame(rn);
          } else if (!inView && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        },
        { threshold: 0 },
      );
      io.observe(c);
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    rz();
    if (reducedMotion) drawOnce();
    else rafId = requestAnimationFrame(rn);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      width={608}
      height={608}
      className={
        "pointer-events-none select-none absolute bottom-0 right-0 max-md:left-0 max-md:right-auto " +
        className
      }
    />
  );
};
