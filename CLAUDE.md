# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — starts the Express + Vite dev server on **port 3004** (override with `PORT`). The root process is `tsx server.ts`, which bootstraps both the `/api/leads` endpoint and Vite's middleware. Do NOT run `vite` directly — the API route only exists inside `server.ts`.
- `npm run build` — `vite build` (output in `dist/`).
- `npm run preview` — Vite's static preview of `dist/`. Note this serves the SPA **without** `/api/leads`; to exercise the API against a production build, run `NODE_ENV=production npx tsx server.ts` instead.
- `npm run lint` — `tsc --noEmit`. This is the only checker configured (no ESLint/Prettier). It currently passes clean; keep it that way.
- `npm run clean` — `rm -rf dist`. POSIX-only; on Windows use the Bash tool, not PowerShell.

There is no test framework in this repo.

## Architecture

**Stack:** React 19 + Vite 6 + TypeScript, Tailwind CSS v4 (via `@tailwindcss/vite`), GSAP + ScrollTrigger for scroll-driven reveals, Motion v12 (`motion/react`) for component transitions, Lenis for smooth scrolling, react-router-dom v7, react-helmet-async for per-page SEO, react-hook-form + Zod for forms, Resend for email.

**Server (`server.ts`):** custom Express wrapper. In dev it mounts Vite in middleware mode; in production (`NODE_ENV=production`) it serves `dist/` with an SPA catch-all. One API route: `POST /api/leads` validates nothing server-side, logs the payload, and forwards it via Resend to `CONTACT_EMAIL`. If `RESEND_API_KEY` is absent it warns and still returns `201` — a successful response does **not** mean an email was sent.

**Routing (`src/App.tsx`):** Home, About, Contact, Case Studies, Services (list), ServicePage (`/services/:slug`), Privacy, Terms, 404. App also owns the global chrome — `LeftRail`, `Navbar`, `Footer`, `CustomCursor`, `ScrollIndicator`, `StickyCTA`, `LeadMagnet` — plus `HelmetProvider` and the Lenis instance.

### Content model — `src/constants.ts`

`SERVICES` is the single source of truth for the **10** service offerings and drives `/services`, `/services/:slug`, and Home's service grid. Entries are deliberately heterogeneous:

- Every entry has the base fields (`slug`, `title`, `desc`, `num`, `longDesc`, `benefits`, `process`, `metric`, `metricLabel`, `accentColor`, `image`, `featureTitle`, `featureDesc`).
- Only some entries carry the extended page fields (`scopeItems`, `hero*`, `whyUs*`, `cta*`). `ServicePage` reads them through a `config` object where **every extended field has a fallback** derived from the base fields. This is why they're accessed as `(service as any)?.field` — the array is a heterogeneous literal, not a typed interface. When adding an optional field, add it to `ServicePageConfig` and give it a fallback rather than making it required on all 10 entries.

Content is **bilingual and inconsistent by design-drift**: `constants.ts` and the Contact form's Zod messages are French; Home/About/ServicePage chrome is largely English. Match the surrounding language of the file you're editing.

### Known dead wiring — check before "fixing"

These are real inconsistencies in the current tree, not bugs to fix casually:

- `ServicePage.tsx`'s `KNOWLEDGE_COMPONENTS` map is keyed on an **older set of slugs** (`gbp-optimization`, `ppc-advertising`, `seo-strategy`, …) that no longer exist in `SERVICES`. As a result all nine `src/components/sections/*Knowledge.tsx` components (~2400 lines) currently render for no route. Rekeying the map to current slugs is what turns them back on.
- `SERVICES[0].aliases` exists but nothing reads it — `ServicePage` resolves via `SERVICES.find(s => s.slug === slug)` only, and unknown slugs `<Navigate to="/" replace />`.
- **Path alias mismatch:** `tsconfig.json` maps `@/*` → `src/*`, but `vite.config.ts` aliases `@` → the project **root**. Only `src/components/lightswind/toggle-theme.tsx` uses `@/`, and that file has no importers, so the mismatch is latent. **Use relative imports** in new code until the two configs are reconciled.
- `vite.config.ts` injects `process.env.GEMINI_API_KEY` and `@google/genai` is a dependency, but neither is referenced in `src/` — leftover AI Studio scaffolding.
- Unimported files: `src/lightswind.css` (1000-line standalone CSS), `src/hooks/use-mobile.tsx`, `src/hooks/use-toast.tsx`, `src/components/sections/howwework..tsx` (empty). `src/pages/Home.html` + `Home_files/` are scraped reference artifacts, not part of the build.

### Visual system

Dark-first. Brand tokens live in the Tailwind v4 `@theme` block in `src/index.css` — `--color-brand-primary` `#0F0F0F`, `--color-brand-accent` `#C1FF72`, plus `brand-border`, `brand-surface`, `brand-text`. Use the `bg-brand-*` / `text-brand-*` utilities, not raw hex. Typography: Inter (sans + display), Playfair Display (serif), Space Grotesk (mono). `.btn-primary`, `.btn-outline`, `.nav-link` are defined in `@layer components` — reuse them rather than re-deriving the pill button.

### Animation conventions

- **GSAP** for scroll-driven reveals: `gsap.registerPlugin(ScrollTrigger)` at module scope, animations inside `useEffect` wrapped in `gsap.context(() => {...}, containerRef)`, with `ScrollTrigger.refresh()` after setup and `ctx.revert()` on cleanup. GSAP targets are **class-name based**, and `src/index.css` pre-sets `will-change` for that exact list (`.service-card`, `.knowledge-item`, `.stat-item`, `.portfolio-item`, …). Adding a new animated card class means adding it there too.
- **Motion** for enter/exit and viewport transitions: import from `motion/react` (Motion v12). `framer-motion` is also installed but is used only by the vendored `src/components/lightswind/knowledge-convergence.tsx` — don't introduce it in new code.
- **Lenis** is created once in `App.tsx` with its own `requestAnimationFrame` loop. It is **not** wired to ScrollTrigger (no `lenis.on('scroll', ScrollTrigger.update)` / `scrollerProxy`), so GSAP reads native scroll position. Keep that in mind when a ScrollTrigger fires at an unexpected offset.
- `styled-components` appears only in `src/components/ui/themeswitcher.tsx` and `Languageswitcher.tsx`. Everything else is Tailwind.

### Forms

`src/pages/Contact.tsx` (~750 lines) is the reference: react-hook-form + `zodResolver`, French validation messages, GSAP entrance, and a `fetch("/api/leads")` POST. It also reads `window.gtag` (declared in a local `declare global`) — guard any analytics call, the tag may not be present.

### SEO

Every page component renders its own `<Helmet>` block (title, description, and in several cases JSON-LD). New pages should follow suit; `index.html` only carries the default title and theme color.

## Environment

Server-side (`server.ts`): `RESEND_API_KEY`, `CONTACT_EMAIL`, `PORT`, `NODE_ENV`. Client-side build: `DISABLE_HMR=true` disables Vite HMR/file watching to stop flicker during agent edits.

**`.env` is not auto-loaded.** `dotenv` is a dependency but is never imported, and `server.ts` reads `process.env` directly — so a `.env` file does nothing for the Resend integration. Either export the vars in the shell or start with `npx tsx --env-file=.env server.ts`. (Vite's `loadEnv` in `vite.config.ts` *does* read `.env`, but only to inline `GEMINI_API_KEY`, which nothing uses.) See `.env.example`; `.env*` is gitignored.
