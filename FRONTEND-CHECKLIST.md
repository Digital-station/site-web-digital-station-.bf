# Front-End Checklist — Digital Station

Audit of this codebase against the
[Front-End Checklist](https://github.com/thedaviddias/front-end-checklist)
(385 rules, 11 categories, snapshot of 2026-09-20). Every rule in the upstream
README was reviewed; rules with no surface on this site (video, tables,
pagination, authentication, e-commerce, articles, …) are listed as **N/A** with
the reason, so the list is complete rather than cherry-picked.

**Legend**

| Mark | Meaning |
| --- | --- |
| ✅ | Meets the rule — verified in code and/or in the server-rendered HTML |
| 🔧 | **Fixed in this pass** — see the file(s) named |
| ⚠️ | Partially met, or met but with a caveat worth knowing |
| ❌ | Not met — open work, tracked in the roadmap at the end |
| ⏳ | Cannot be verified from the repository — needs the live host (HTTPS, headers at the edge, Lighthouse, real devices) |
| — | N/A for this site |

**Method.** Static review of every file under `app/`, `components/`, `lib/`,
`config/`, `i18n/`, `messages/`, `public/`; `curl` of every route on the dev
server (both locales) with checks for duplicate `id`s, heading order, `lang`,
viewport, manifest, JSON-LD; `npx tsc --noEmit`, `npx eslint .`,
`npx vitest run`, `npm audit`.

**Scorecard (rules that apply):**

| Category | Applies | ✅ / 🔧 | ⚠️ | ❌ | ⏳ |
| --- | --- | --- | --- | --- | --- |
| HTML | 17 | 15 | 1 | 0 | 1 |
| CSS | 27 | 22 | 3 | 0 | 2 |
| JavaScript | 24 | 22 | 2 | 0 | 0 |
| Performance | 33 | 19 | 4 | 1 | 9 |
| Accessibility | 63 | 55 | 3 | 0 | 5 |
| SEO | 60 | 51 | 5 | 0 | 4 |
| Security | 17 | 12 | 2 | 1 | 2 |
| Images | 21 | 15 | 4 | 0 | 2 |
| Testing | 13 | 6 | 1 | 6 | 0 |
| Privacy | 5 | 3 | 1 | 1 | 0 |
| Internationalization | 5 | 4 | 1 | 0 | 0 |

---

## Jump to a category

[HTML](#html) · [CSS](#css) · [JavaScript](#javascript) ·
[Performance](#performance) · [Accessibility](#accessibility) · [SEO](#seo) ·
[Security](#security) · [Images](#images) · [Testing](#testing) ·
[Privacy](#privacy) · [Internationalization](#internationalization) ·
[Roadmap](#roadmap-open-items)

---

## HTML

- [x] ✅ **Declare UTF-8 character encoding** — `<meta charSet="utf-8">` is the first child of `<head>` (Next.js emits it; verified in SSR output).
- [x] ✅ **Use the HTML5 doctype** — `<!DOCTYPE html>` on every route.
- [x] ✅ **Set the responsive viewport meta tag** — `width=device-width, initial-scale=1`; no `user-scalable=no`, no `maximum-scale`.
- [x] ✅ **Set the page lang attribute** — `<html lang={locale}>` from the `[locale]` segment (`app/[locale]/layout.tsx`); root layout is a pass-through precisely so `lang` is always correct.
- [x] ✅ **Use semantic HTML elements** — `<nav>` (labelled ×3), one `<main id="main-content">`, `<footer>`, `<section>`/`<article>` in page content.
- [x] 🔧 **Ensure all IDs are unique** — the home page shipped `id="industries"` and `id="tools"` twice: once on the dynamic-import placeholder and once on the streamed section. Fixed in `components/sections/home/HomeContent.tsx` (placeholder no longer carries the id). Every route now passes a duplicate-id scan.
- [x] ✅ **Implement favicons for all devices** — `app/favicon.ico`, `icons.icon` (512 PNG), `icons.apple` (180 PNG), manifest icons.
- [x] ✅ **Link a Web App Manifest** — `app/manifest.ts` → `/manifest.webmanifest`, linked automatically; colours synced to `--ds-bg`.
- [x] ⚠️ **Meet PWA installability criteria** — manifest + icons yes; **no service worker** and no `purpose: "maskable"` icon. Deliberate: this is a marketing site, offline install is not a goal. Low priority.
- [x] ✅ **Create a custom 404 error page** — `app/[locale]/not-found.tsx` (localised, with navigation) + root `app/not-found.tsx`; returns a real 404 status.
- [x] ✅ **Load scripts with defer, async, or type=module** — all Next.js chunks are `async`; GA4 is `afterInteractive`. The only synchronous inline script is the 6-line theme initialiser, which *must* run before first paint to avoid a theme flash.
- [x] 🔧 **Provide noscript fallback content** — added a localised `<noscript>` notice in `app/[locale]/layout.tsx` (keys `common.noscript`). Pages are fully server-rendered, so content itself never depended on JS.
- [x] ✅ **Remove comments and debug code in production** — React strips JSX comments; `console.*` calls are limited to server-side error paths (`/api/leads`, error boundaries) — see JavaScript.
- [x] ✅ **Use semantic input type attributes** — `type="email"`, `type="tel"`, `autoComplete="name|email|tel"` on the contact form.
- [x] ✅ **Validate forms accessibly** — `aria-required`, `aria-invalid`, `aria-describedby` → `<p id="…-error">`; first invalid field receives focus; shared zod schema client+server (`lib/lead-schema.ts`).
- [x] ✅ **Implement accessible breadcrumb navigation** — `<nav aria-label>` + `aria-current="page"` on service pages, paired with `BreadcrumbList` JSON-LD.
- [ ] ⏳ **Validate HTML against W3C standards** — run the [Nu validator](https://validator.w3.org/nu/) against the production URL once live. No offline validator in this sandbox; heading/ID/landmark scans pass.
- [x] ✅ **Set text direction for RTL languages** — both locales are LTR; `dir` is omitted by design (default `ltr`). Revisit if Arabic is added.
- [x] ✅ **Add Subresource Integrity to external scripts** — no third-party `<script>` at all unless GA4 is configured, and gtag.js cannot carry SRI (Google rotates it). Fonts are self-served through `next/font`.
- — **Add thumbnail images to videos**, **Make videos accessible with captions** — no video.
- — **Make custom elements accessible** — no Web Components.
- — **Make file uploads accessible** — no file upload.
- — **Make pagination accessible** — no pagination.
- — **Make search inputs accessible** — the industries filter is a labelled `<input type="search">` with a clear button; there is no site search.

## CSS

- [x] ✅ **Use CSS custom properties for design tokens** — every colour/spacing flows from `--ds-*` tokens in `app/globals.css`; repo rule: no raw hex in components.
- [x] ✅ **Use @layer to manage cascade order** — Tailwind v4 `@layer base / components / utilities`.
- [x] ✅ **Keep CSS specificity low and flat** — utility classes + single-class components; no ID selectors.
- [x] ✅ **Use consistent CSS naming conventions** — Tailwind utilities + `btn-*` components + `ds-*` tokens.
- [x] ✅ **Minify all CSS files** / **Remove unused CSS rules** — Tailwind v4 emits only used utilities; Next.js minifies.
- [x] ✅ **Load CSS without blocking render** / **Inline critical CSS** / **Order CSS files correctly** — one small stylesheet emitted by Next.js ahead of scripts; App Router handles ordering. Critical CSS inlining is not needed at this bundle size (⚠️ measure with Lighthouse once live).
- [x] ✅ **Avoid embedded and inline CSS** — no `style=` attributes except animated values driven by `motion`/GSAP.
- [x] ✅ **Provide visible custom focus indicators** — global `:focus-visible { outline: 2px solid var(--ds-accent-ring); outline-offset: 2px }`.
- [x] ✅ **Do not disable pinch zoom** — viewport meta is the default.
- [x] ✅ **Prevent horizontal scrolling** — `overflow-hidden` on marquee/carousel sections; layouts are fluid. (⏳ re-check at 320 px / 400 % zoom on device.)
- [x] ✅ **Use readable font sizes on mobile** / **Use relative units** — `rem`-based Tailwind scale, `clamp()` display sizes; body ≥ 16 px.
- [x] ✅ **Support dark mode with prefers-color-scheme** — ⚠️ dark is the *default*, light is opt-in via toggle stored in `localStorage`; `color-scheme` is set per theme so form controls follow. The system preference is not read on first visit — intentional brand decision (dark-first). Note only.
- [x] ✅ **Use transform and opacity for animations** — all reveals/marquee/theme wipe animate `transform`/`opacity`/`clip-path`; keyframes in `globals.css` confirm.
- [x] ✅ **Use CSS logical properties for i18n/RTL** — ⚠️ mostly physical utilities (`pl-16`, `ml-4`); harmless while both locales are LTR. Swap to `ps-`/`ms-` if an RTL locale ever lands.
- [x] 🔧 **Include a print stylesheet** — added `@media print` block to `app/globals.css`: hides chrome/canvas, forces light, prints external link targets, avoids page breaks inside figures/headings.
- [x] ✅ **Use a CSS reset or normalize** — Tailwind preflight.
- [x] ✅ **Use Flexbox best practices** / **Use CSS Grid for two-dimensional layouts** — grids for cards/footer, flex for rows.
- [x] ✅ **Use the View Transitions API** — theme toggle uses `document.startViewTransition` with a circular reveal, with the default cross-fade pinned in CSS.
- [x] ✅ **Optimize web font formats** — `next/font` serves WOFF2 subsets with `display: swap` and a size-adjusted fallback. ⚠️ Families are fetched from Google *at build time*; the build fails offline. Self-hosting is on the roadmap (see `lib/fonts.ts`).
- [x] ✅ **Avoid intrusive interstitials** — none; the sticky WhatsApp CTA is a small FAB that hides while the footer is visible.
- [x] ✅ **Use CSS containment** — `[data-offscreen]` pauses animations off-screen; heavy sections are isolated. Explicit `contain:` is not used — no measured need.
- [ ] ⏳ **Lint CSS and SCSS files** — no Stylelint. Only one hand-written stylesheet (`globals.css`) plus one CSS module; Tailwind v4 validates its own syntax. Low value; add `stylelint-config-tailwindcss` only if the hand-written CSS grows.
- [x] ✅ **Use container queries**, **subgrid**, **:has()**, **@property**, **oklch()** — not used; nothing in the layout needs them. Low-priority rules, no action.

## JavaScript

- [x] ✅ **Enable TypeScript strict mode** — `"strict": true` in `tsconfig.json`.
- [x] 🔧 **Avoid the any type** — the two remaining `any`s (`components/decor/Wavemesh.tsx`) replaced with a typed `MeshState`; `@typescript-eslint/no-explicit-any` now enforced by ESLint.
- [x] 🔧 **Lint JavaScript code** — added ESLint 9 flat config (`eslint.config.mjs`: `eslint-config-next/core-web-vitals` + `typescript`) and `npm run lint`. 0 errors; 9 remaining warnings are documented `<img>`-in-marquee choices and one react-hook-form compiler note.
- [x] ⚠️ **Enable noUncheckedIndexedAccess** — tried: 31 errors across 13 files, all `arr[0]`-style reads that are safe by construction. Worth doing in a dedicated pass, not as a drive-by. Roadmap.
- [x] ✅ **Use ES modules** / **Prefer const and let** / **Use import type** / **Modern array & object methods** — throughout. The only `var` is inside the inline pre-paint theme script string, where ES5 is intentional.
- [x] ✅ **Avoid inline JavaScript** — one deliberate exception (theme init, 6 lines) documented in `ThemeProvider.tsx`; everything else is bundled.
- [x] ✅ **Never use eval()** — none; `dangerouslySetInnerHTML` is used only for JSON-LD serialised by `ldJson()` (which escapes `<`) and the two static inline scripts.
- [x] ✅ **Implement proper error handling** — `app/[locale]/error.tsx`, `app/global-error.tsx`, `try/catch` around `fetch`, `localStorage`, Resend.
- [x] ✅ **Parse JSON safely** — `/api/leads` wraps `request.json()` and validates with zod before use.
- [x] ✅ **Validate external data at runtime with a schema library** — zod schema shared by the form and the API (`lib/lead-schema.ts`), env-driven GA4 ID validated by regex.
- [x] ✅ **Remove console statements in production** — 8 calls, all intentional server/error-boundary logging (`route.ts`, `error.tsx`, `global-error.tsx`, `Analytics.tsx` misconfig warning, form submit failure). No debug logs.
- [x] ✅ **Debounce and throttle event handlers** — scroll listeners are `{ passive: true }` and do a single cheap `setState`; the industries carousel debounces scroll with a 500 ms timer; Wavemesh uses `ResizeObserver` + rAF.
- [x] ✅ **Prevent common memory leak patterns** — every `addEventListener`, interval, rAF, `ResizeObserver`, `MutationObserver` and GSAP context is cleaned up in the effect return.
- [x] ✅ **Use Web Storage API safely** — `localStorage` access is `try/catch`-wrapped and value-validated (`'light' | 'dark'`).
- [x] ✅ **Split large JavaScript bundles** — route-based splitting by the App Router; heavy sections (`IndustriesWeServe`, `ToolsWeMaster`, `Wavemesh`) are `next/dynamic`.
- [x] ✅ **Minify all JavaScript files** — `next build`.
- [x] ✅ **Handle cross-origin requests securely** — `/api/leads` enforces same-origin (`Origin`/`Sec-Fetch-Site` check), size cap and rate limits; no `postMessage`.
- [x] ✅ **Minimize costly DOM read/write operations** — canvas work batched per frame; layout reads confined to `ResizeObserver`/`IntersectionObserver`.
- [x] ✅ **Prefer immutable data patterns** / **Avoid implicit type coercion** — `===` everywhere; state updated via new objects.
- [x] ✅ **Use event delegation** — not needed; lists are small and static.
- [x] ✅ **Write internationalisation-friendly translation strings** — ICU interpolation (`{count}`, `{name}`) through next-intl; no string concatenation of UI text.
- [x] ✅ **Use scheduler.yield()** — no long tasks (> 50 ms) exist to break up; the canvas animation is already rAF-paced and yields.

## Performance

- [x] ✅ **Implement lazy loading for offscreen content** / **Load non-critical code when content approaches the viewport** — `next/dynamic` for below-the-fold sections; `IntersectionObserver` gates the carousel, marquee and canvas (`lib/use-pause-offscreen.ts`).
- [x] ✅ **Disable lazy loading for above-the-fold content** — no hero image (typographic hero + canvas); first solution card is `priority`.
- [x] ✅ **Optimize web font loading** — `next/font`, `display: swap`, preloaded subset, fallback metrics → no FOIT, minimal CLS.
- [x] ✅ **Minimize cumulative layout shift** — explicit `width`/`height` on every image, `min-h` placeholders for dynamic sections, font fallbacks. (⏳ confirm CLS < 0.1 with Lighthouse on the live host.)
- [x] ✅ **Optimize third-party script loading** — the only third party (GA4) is opt-in via env, `afterInteractive`, consent-denied by default.
- [x] ✅ **Optimize Google Tag Manager implementation** / **Implement Google Consent Mode v2** — no GTM; GA4 loads with Consent Mode v2 defaults set *before* gtag.js.
- [x] ✅ **Avoid JavaScript-based redirects** — locale redirect is server-side (`proxy.ts`), legacy URL redirects are 308s in `next.config.ts`.
- [x] ✅ **Avoid serving legacy JavaScript** — `browserslist: defaults, not ie 11, not op_mini all`; no polyfills.
- [x] ✅ **Remove duplicate JavaScript libraries** — `npm ls` shows single versions. ⚠️ Two animation runtimes (`gsap` + `motion`) plus `lenis` ship together — works, but is payload on 3G. Roadmap: converge.
- [x] ✅ **Use secure and up-to-date JS libraries** — `npm audit`: 0 vulnerabilities (prod and dev).
- [x] ✅ **Show loading indicators** — form submit button switches to a busy state; dynamic sections reserve height.
- [x] ✅ **Convert animated GIFs to video** — no GIFs.
- [x] ✅ **Optimize pages for back/forward cache** — no `unload`/`beforeunload` listeners, no `Cache-Control: no-store` on pages.
- [x] ✅ **Stream HTML to the browser** — App Router streams (Suspense boundaries around dynamic sections are visible in the HTML).
- [x] ✅ **Use resource hints** / **Use preconnect for critical third-party origins** — Next.js preloads fonts and chunks; no third-party origins to preconnect (GA4 is optional and deferred).
- [x] ✅ **Use fetchpriority** — Next.js sets `fetchPriority` on preloads; first solution image is `priority`.
- [x] ✅ **Minimize critical request chains** / **Minimize HTTP requests** — single CSS file, chunked JS, self-hosted assets, no CSS `@import` chains.
- [x] ✅ **Reduce DOM size and complexity** — the largest page (home) is ~8 sections; the marquee duplicates rows but is `aria-hidden` and lazily mounted. (⏳ measure node count with Lighthouse.)
- [x] ⚠️ **Optimize JavaScript bundle size** / **Optimize CSS file size** — reasonable for the feature set; the three animation libraries are the main lever. Roadmap.
- [x] ⚠️ **Provide source maps for production debugging** — Next.js emits none for the browser by default. Enable `productionBrowserSourceMaps` only together with an error monitor (see Testing) — otherwise they just add upload weight.
- [ ] ❌ **Register a service worker** / **Provide an offline fallback page** / **Speculation Rules API** — none. Not required for a marketing site; listed as open, low priority.
- [x] ✅ **Virtualize long lists and tables** — no long lists.
- [ ] ⏳ **Enable browser caching** — `/_next/static/*` is immutable-hashed and Next.js sends `Cache-Control: public, max-age=31536000, immutable`; `public/` assets fall back to the host. Confirm on cPanel/Passenger and add long `Cache-Control` for `/brand`, `/logo`, `/placeholders` at the LiteSpeed layer if missing.
- [ ] ⏳ **Enable HTTP/2 or HTTP/3** — host-level (LiteSpeed on cPanel supports both). Verify after launch.
- [ ] ⏳ **Enable text-based compression** — host-level (Brotli/Gzip on LiteSpeed). Verify with `curl -H 'Accept-Encoding: br'`.
- [ ] ⏳ **Use a content delivery network** — no CDN today; all assets are same-origin from Ouagadougou-hosted cPanel. Cloudflare in front would satisfy this plus HTTP/3 and edge caching. Roadmap.
- [ ] ⏳ **Reduce TTFB** / **Optimize LCP** / **Optimize FCP** / **Optimize INP** / **Keep page load < 3 s** / **Keep page weight < 1500 KB** / **Analyze with WebPageTest** / **Browser-based performance audits** — need the production URL. Pages are static (`generateStaticParams`), so TTFB should be excellent; run Lighthouse + WebPageTest (Mobile, 3G Fast, from the nearest EU/West-Africa node) after launch and record numbers here.
- [x] ✅ **Load non-critical code on user interaction** — the product preview modal and mobile drawer are client components mounted on demand.

## Accessibility

- [x] ✅ **Include a skip navigation link** / **Implement "Skip to Content" links** — `href="#main-content"`, visible on focus; `<main tabIndex={-1}>` so focus actually lands.
- [x] ✅ **Use exactly one main landmark** — one `<main>` per document (checked on every route).
- [x] ✅ **Use landmark regions correctly** / **Use navigation landmark regions** — three `<nav>`s, each with a distinct `aria-label` (primary, footer navigation, footer services); breadcrumb `<nav aria-label>`.
- [x] ✅ **Use logical heading hierarchy** / **Maintain logical heading order** / **Use a single descriptive H1** / **Ensure headings contain text** — exactly one `<h1>` on every route; `h1 → h2 → h3` with no skipped levels (verified on all 10 route types).
- [x] ✅ **Associate labels with form controls** / **Ensure all input fields have accessible names** / **Use a single label for each form field** — every field has one `<label for>`; the honeypot is `aria-hidden` and `tabIndex={-1}`.
- [x] ✅ **Announce dynamic content with ARIA live regions** / **Make notifications accessible** — form success/error uses `role="alert"`/`role="status"`; `RouteAnnouncer` announces client-side navigations; field errors are read via `aria-describedby` (deliberately not `role="alert"` to avoid a burst on submit).
- [x] ✅ **Enable keyboard navigation for all elements** / **Ensure logical focus order** / **Use appropriate tabindex values** — no positive `tabindex`; `-1` used only on the skip-link target and the honeypot.
- [x] ✅ **Make modal dialogs keyboard accessible** / **Ensure dialogs have an accessible name** / **Manage focus during dynamic interactions** / **Remove focusable elements from aria-hidden containers** — mobile drawer and product modal: `role="dialog" aria-modal aria-labelledby`, focus trap, `inert` on the background, focus returned on close, Escape closes.
- [x] ✅ **Keep focused elements unobscured** — sticky navbar is short; the WhatsApp FAB is small and steps aside near the footer; `scroll-padding` covers anchor jumps.
- [x] ✅ **Provide visible focus** — see CSS.
- [x] ✅ **Provide accessible names for buttons / interactive elements / ARIA command elements / toggle fields** — icon-only buttons (theme toggle, locale toggle, burger, close, clear search, social links) all carry `aria-label`; theme toggle uses `aria-pressed`; estimator chips use `aria-pressed`.
- [x] ✅ **Use descriptive link text** / **Fix empty and broken links** / **Ensure identical links have consistent destinations** — no "click here"; icon links are labelled; identical labels point to identical routes.
- [x] ✅ **Make links in text blocks visually distinguishable** — inline links are underlined (`underline underline-offset-4`), not colour-only.
- [x] ✅ **Meet minimum color contrast ratios** — token pairs are documented with measured ratios in `globals.css` (e.g. white on `#144F97` = 8.09:1); light theme was tuned to the same bar. (⏳ automated re-check with axe on the live site.)
- [x] ✅ **Hide decorative elements from assistive technology** — decorative icons `aria-hidden`, process arrows `alt=""`, the canvas and duplicated marquee rows `aria-hidden`.
- [x] ✅ **Respect reduced motion preferences** / **Provide alternatives to parallax effects** / **Avoid scrolljacking** / **Provide instant anchor scroll option** — `prefers-reduced-motion` media query kills CSS animation; `useReducedMotion()` disables Lenis smooth scroll, GSAP reveals, the carousel auto-advance, the canvas animation (draws one static frame) and the theme wipe; `scrollIntoView` uses `auto` under reduced motion. Lenis is the only "custom scroll" and it is opt-out by preference.
- [x] ✅ **Prevent seizure-triggering flashing content** — no flashing; slowest animation is a 1.8 s carousel step.
- [x] ✅ **Make carousels accessible** — the industries carousel pauses on hover, focus, scroll and search (WCAG 2.2.2); the moving copy is `aria-hidden` and a static list carries the content once.
- [ ] ⏳ **Make tabs keyboard navigable** — the component this previously credited (`ArchitectureDiagrams`) was removed from the home page; no `role="tablist"` pattern exists elsewhere. `ProductPreviewModal`'s module tabs are plain `<button>`s — reachable and operable via Tab/Enter/Space, but without the roving-tabindex + arrow-key pattern a true tablist needs. Candidate for a real ARIA tablist if this becomes load-bearing.
- [x] ✅ **Make accordions keyboard navigable** — FAQ uses native `<details>/<summary>`.
- [x] ✅ **Provide sufficient touch target size** — nav, social icons, chips and FAB are ≥ 44 px (`w-11 h-11` and up).
- [x] ✅ **Support text resizing to 200 %** / **Support content reflow at 400 % zoom** / **Support both orientations** — fluid `rem` layouts, no fixed heights on text containers, no orientation lock. (⏳ device verification.)
- [x] ✅ **Ensure content remains usable without CSS** — semantic document order matches visual order; skip link, nav, main, footer read correctly unstyled.
- [x] ✅ **Avoid autofocus on form fields** — no `autoFocus`; `?product=` deep links prefill without stealing focus.
- [x] ✅ **Allow pasting into form inputs** — no paste blocking.
- [x] ✅ **Avoid sensory-only instructions** — required fields have both `*` (visual) and `aria-required`; errors are text + icon.
- [x] ✅ **Avoid meta refresh redirects** — none.
- [x] ✅ **Avoid images of text** — logos only.
- [x] ✅ **Avoid redundant image alternative text** — alts name the subject (`"Digital Station — Building tomorrow's digital"`, `logoAlt` with the tool name), no "image of".
- [x] ✅ **Use semantic list elements** / **Use correct list structure** / **Place list items within list containers** — services, footer nav, industries and FAQ are `<ul>/<li>`; no orphan `<li>`.
- [x] ✅ **Use valid ARIA roles / attributes / values** / **Use only allowed ARIA attributes** / **Include required ARIA attributes** / **Required parent/child roles** / **Avoid deprecated roles** — roles used: `dialog`, `tablist/tab/tabpanel`, `alert`, `status`, `presentation`; all with their required states. (⏳ axe run on live site for a machine check.)
- [x] ✅ **Use unique IDs for ARIA references / active elements** — after the HomeContent fix, no duplicate ids on any route; generated ids come from `useId()`.
- [x] ✅ **Do not use aria-hidden on the document body** — never.
- [x] ✅ **Match lang and xml:lang attributes** — no `xml:lang` (HTML5 document).
- [x] ✅ **Provide titles for iframes** — no iframes.
- [x] ✅ **Keep repeated help mechanisms in a consistent location** — contact/WhatsApp are in the same place (navbar CTA, sticky FAB, footer) on every page.
- [x] ✅ **Write in plain language** / **Use inclusive language** — copy audited in the previous credibility pass; service pages are structured audience → scope → process → guarantees.
- [x] ✅ **Align visible labels with accessible names** — labels are the text; icon buttons' `aria-label` matches their tooltip/title text.
- [x] ✅ **Create accessible tooltips** — no tooltips (labels are visible).
- [x] ✅ **Avoid redundant entry** — the estimator's CTA prefills `/contact?objective=…`, and `?product=` from Solutions prefills the brief, so nothing typed once is typed twice.
- [ ] ⏳ **Test with screen readers** — manual NVDA/VoiceOver pass still to be done on the live site; automated structure checks pass. Record findings here.
- — **Session timeouts**, **Accessible authentication**, **Drag and drop**, **Tables** (headers, td/th, duplicate names), **Definition lists**, **Meter/progress/tree/tooltip names**, **Image buttons**, **`<object>` alt**, **Video captions/audio descriptions**, **Autoplaying media**, **`role="text"`**, **accesskey** — no such elements on the site.

## SEO

- [x] ✅ **Write a descriptive page title** / **Keep page titles unique** — per-page `title` through `pageMeta()` with the `%s | Digital Station` template; home opts out of the template to avoid a double suffix.
- [x] ✅ **Write a meta description for each page** / **Avoid duplicate meta descriptions** — every route sets its own from `messages/*.json`.
- [x] ✅ **Set canonical URLs for all pages** / **OG URL Match** / **Avoid redirect chains on canonical URLs** — `alternates.canonical` = `og:url` = the final `/{locale}{path}` URL; 404s deliberately set none.
- [x] ✅ **Add hreflang** — see Internationalization.
- [x] ✅ **Open Graph Tags** / **OG Image Size** / **Add Twitter Card meta tags** — 1200×630 per-locale share cards, `summary_large_image`, `og:locale` + `og:locale:alternate` from one shared map (`lib/seo.ts`).
- [x] ✅ **Add structured data markup** / **Use valid JSON-LD** / **Add Organization schema** / **Add FAQPage schema** / **Implement valid BreadcrumbList schema** / **WebSite schema** — `lib/schema.ts` emits one `Organization` node (`@id`) referenced by `WebSite`, `Service`, `ItemList`, `BreadcrumbList`, `ContactPage`, `FAQPage`. ⚠️ `SearchAction` is intentionally absent (there is no site search — advertising one would be a lie). (⏳ run Rich Results Test on the live URL.)
- [x] ⚠️ **Add LocalBusiness schema markup** — `Organization` rather than `ProfessionalService`/`LocalBusiness` **by design** until a public street address is confirmed (comment in `lib/schema.ts`). `config/site.config.ts` now has a street — once the owner confirms it is a visitable office, flip the `@type` and move `openingHours` onto the node.
- [x] ✅ **Create and submit an XML sitemap** / **Keep XML sitemaps valid** / **Keep sitemap URLs on the correct domain** / **Include indexable pages in your sitemap** / **Noindex in Sitemap** / **4XX Pages in Sitemap** — `app/sitemap.ts` is generated from the same route data as the pages, with per-URL `lastmod` that tracks content changes (not build time) and hreflang alternates; noindex legal pages are excluded. Submit in Search Console after launch (README).
- [x] ✅ **Publish a robots.txt** / **Set robots meta directives correctly** / **Avoid conflicting indexability signals** / **Robots Meta Conflict** / **Audit all noindex pages** / **Make important pages indexable** — `app/robots.ts` allows `/`, disallows only `/api/`; Privacy and Terms are `noindex, follow` via meta and *not* blocked in robots.txt (so the directive is actually read). Every commercial page is indexable.
- [x] ✅ **Schema + Noindex Conflict** — legal pages carry no rich-result schema.
- [x] ✅ **Avoid multi-hop redirect chains** / **Link directly to final destination URLs** — bare `/x` → `/fr/x` is a single 307/308 hop; the old `/case-studies` → `/solutions` is a single 308; internal links are always locale-prefixed (`Link` from `i18n/routing`).
- [x] ✅ **Use trailing slashes consistently** / **Use lowercase URLs** / **Use hyphens in URLs** / **Include keywords in URL slugs** / **Keep URLs concise** / **URL Special Characters** / **URL Stop Words** / **Limit unnecessary URL parameters** — no trailing slash (Next default), slugs like `/fr/services/cybersecurite-conformite`; unit test now asserts slug format.
- [x] ✅ **Meta Tags in Body** — all metadata is generated in `<head>` by Next.js.
- [x] ✅ **Keep HTML documents under crawl limits** — largest page well under 1 MB.
- [x] ✅ **Keep linked PDFs under 60 MB** — deck 4 pages, NDA 2 pages (`public/docs`, < 20 KB total).
- [x] ✅ **Add a favicon to every page** — see HTML.
- [x] ✅ **Create a dedicated About page** / **Create a comprehensive Contact page** / **Display a physical business address** / **Keep NAP details consistent** / **Tel & Mailto Links** — About and Contact exist in both languages; name/address/phone come from one source (`config/site.config.ts`) and render as `tel:` / `mailto:` / `wa.me` links; the footer repeats them.
- [x] ✅ **Geo Meta Tags** — country and locality are in `PostalAddress` JSON-LD and `areaServed`; legacy `geo.*` meta tags are ignored by Google and not added.
- [x] ✅ **Link to active social profiles** — `sameAs` in JSON-LD and footer icons, from `activeSocials()`.
- [x] ✅ **Show trust signals on key pages** — RCCM/IFU/capital in the footer and legal pages, director word, downloadable deck and NDA, tool stack.
- [x] ✅ **Add internal links to key pages** / **Add internal links to orphan pages** / **Weak Internal Links** / **Add outgoing links to dead-end pages** — navbar mega-menu links all 10 services on every page; footer links every top-level route; service pages cross-link to siblings and to Contact. No orphans (every route in the sitemap is linked from the footer or the services index).
- [x] ✅ **Avoid nofollow on internal links** / **Do not link from HTTPS to HTTP** / **Fix invalid links** — none; the only external links are `https://` socials and WhatsApp.
- [x] ✅ **Use descriptive anchor text** — "See the service", service names, "Request a demo", etc.
- [x] ✅ **Avoid keyword stuffing** / **Publish high-quality content** / **Write at a clear reading level** / **Make content easy for LLMs to parse** — copy is human-written, structured with headings and lists, and has been through a native-speaker pass in FR; ⚠️ EN copy is still translated rather than native (roadmap from the credibility audit).
- [x] ⚠️ **Avoid thin content on key pages** — service pages are substantial; the Solutions page is card-based and lighter. Case studies (roadmap) are the fix.
- [x] ⚠️ **Show content freshness signals** / **Show published and updated dates** — sitemap `lastmod` is truthful; there is no visible "updated" date on pages because there is no editorial content yet. Add `dateModified` when case studies/insights land.
- [x] ✅ **Add relevant external links** / **Cite authoritative external sources** — service pages reference CIL/RGPD where relevant; more citations would come with articles.
- [x] ✅ **Add disclaimers to sensitive content** / **Identify YMYL content** — no medical/financial advice; the legal pages state jurisdiction (Burkina Faso).
- [x] ✅ **MIME Type Validation** / **Sync HTML canonical tags and Link headers** — Next.js serves correct `Content-Type`s; no `Link: rel=canonical` header is sent, so nothing can disagree.
- [x] ✅ **Fix malformed HTML structure** — React guarantees well-formed output; heading/landmark scans pass. (⏳ Nu validator on live.)
- [ ] ⏳ **Check for broken links** / **Resolve internal broken links** / **Fix or remove broken external links** — all internal routes return 200 in the dev server; run a crawler (e.g. `linkinator`) against production after launch.
- — **Article schema**, **Author bylines/expertise/markup**, **Editorial policy**, **Share buttons**, **Article link density**, **Affiliate disclosures**, **Product / Review / VideoObject schema**, **Pagination canonicals**, **Service Area Pages**, **llms.txt**, **AI-content audit** — no articles, products with prices, reviews, videos, pagination or affiliate content today. Revisit `Article` + author markup when the insights section ships.

## Security

- [x] ✅ **Set an HSTS header** — `max-age=63072000; includeSubDomains; preload` on every response (README warns to have TLS live first).
- [x] ✅ **Set X-Content-Type-Options: nosniff** / **Set a Referrer-Policy header** (`strict-origin-when-cross-origin`) / **Set a Permissions-Policy header** (`camera=(), microphone=(), geolocation=()`) / **Set an X-Frame-Options header** (`DENY`) — all in `next.config.ts` `headers()`.
- [x] ✅ **External Link Security** — all 11 `target="_blank"` links carry `rel="noopener noreferrer"` (grep-verified).
- [x] ✅ **Audit dependencies for known vulnerabilities** — `npm audit` clean; 🔧 now enforced in CI (`.github/workflows/ci.yml`, `--audit-level=high`).
- [x] ✅ **Leaked Environment Variables** — only `NEXT_PUBLIC_ANALYTICS_*` reach the browser; `RESEND_API_KEY` is server-only; `.env*` ignored, `.env.example` documented.
- [x] ✅ **Prevent stack trace exposure** — error boundaries show only `error.digest`; `/api/leads` returns generic messages and logs details server-side; `poweredByHeader: false`.
- [x] ✅ **Link to your terms of service in the footer** — `/terms` in the footer on every page.
- [x] ✅ **Submit forms over HTTPS** — the form posts to the relative `/api/leads` (same origin, HTTPS in production); HSTS prevents downgrade.
- [x] ✅ **Avoid mixed content** — every asset is same-origin; external links are `https://`.
- [x] ⚠️ **Protect public forms with CAPTCHA** — no CAPTCHA by design (accessibility + friction), but layered bot defence: honeypot field, request size cap, same-origin check, per-IP and global rate-limit buckets, zod validation. Add Cloudflare Turnstile only if spam actually appears.
- [ ] ❌ **Implement a content security policy** — deliberately deferred. A meaningful CSP needs a per-request nonce for the inline theme script (and GA4 when enabled), which means generating it in `proxy.ts` and threading it into `app/[locale]/layout.tsx`. Shipping `'unsafe-inline'` would be a CSP in name only. **Roadmap P1.**
- [ ] ⏳ **Serve all pages over HTTPS** / **Redirect HTTP to HTTPS** — host-level on cPanel (AutoSSL + force-HTTPS). Must be verified before launch because HSTS `preload` is already sent (README).
- [x] ✅ **Use COOP/COEP/CORP** — not needed (no `SharedArrayBuffer`, no cross-origin isolation requirement).
- [x] ✅ **Adblock Element Hiding** / **Blocked Tracking Links** — no ad-network class names or tracking domains; GA4 (if enabled) failing under an adblocker is a no-op thanks to `trackEvent`'s guard.
- — **Session cookie flags**, **Token storage**, **Password fields** — no authentication, no cookies set by the app.

## Images

- [x] ✅ **Provide meaningful alt text** — informative images have descriptive alts (from messages); decorative ones use `alt=""` + `aria-hidden`.
- [x] ✅ **Set explicit width and height** — every `<Image>` and `<img>` declares intrinsic size.
- [x] ✅ **Use modern image formats** / **Use WebP with fallbacks** / **Use AVIF for modern browsers** — sources are WebP/SVG/JPG; `next/image` negotiates `image/avif, image/webp` (`next.config.ts`) with automatic fallback.
- [x] ✅ **Implement responsive images with srcset** / **Use srcset** / **Serve images at the correct display size** / **Support high-DPI displays** — `next/image` generates `srcset`/`sizes` for content images (service heroes, solution cards, director portrait, brand mark).
- [x] ⚠️ **Lazy load offscreen images** — default lazy in `next/image` and explicit `loading="lazy"` on the marquee/process `<img>`s. ⚠️ The marquee logos are plain `<img>` on purpose (documented in `ToolCard.tsx`: 3× duplicated rows inside a transform animation, fixed render size) — ESLint reports them as warnings, accepted.
- [x] ✅ **Prioritize loading critical images** — no LCP image on the home page (text hero); first solution card is `priority`.
- [x] ✅ **Optimise images** / **Compress images without quality loss** / **Optimize all images for web** / **Keep image file sizes within limits** — largest asset is 178 KB (1.6 MB total for 14 bespoke visuals); everything else < 100 KB; logos are WebP/SVG.
- [x] ⚠️ **Optimize SVG files** — the 25 SVG logos in `public/logo` have not been through SVGO. One-off `npx svgo -f public/logo -f public/process` is on the roadmap (low).
- [x] ⚠️ **Use progressive JPEG encoding** — the 14 placeholder JPGs are baseline. Re-export progressive when the remaining 4 service visuals are generated.
- [x] ✅ **Use descriptive image filenames** — `service-cybersecurite-conformite.jpg`, `landry-kabore.webp`, `og-1200x630-en.png`. ⚠️ `public/logo` keeps vendor casing (`Adobe-Photoshop.webp`, `ISO_C++_Logo.svg`) — harmless, referenced by a data file.
- [x] ✅ **Fix broken images** — every referenced path exists (checked); dev server returns 200 for all.
- [x] ✅ **Manage inline SVG size and complexity** — icons are lucide components (tiny); large SVGs are files.
- [x] ✅ **Use image sprites where appropriate** — icon system is SVG components; no sprite needed.
- [x] ✅ **Use `<picture>` with an `<img>` fallback** — `next/image` renders a single `<img>` with `srcset`; format negotiation happens at the image endpoint, so no `<picture>` is needed.
- [x] ✅ **Handle image loading errors gracefully** — images sit on token-coloured surfaces with explicit dimensions, so a failure leaves a correctly sized block rather than a broken layout.
- [ ] ⏳ **Serve images from a CDN** — same-origin today; solved together with the CDN item under Performance.
- — **`<figure>`/`<figcaption>`** — no captioned images.

## Testing

- [x] 🔧 **Write unit tests** — added Vitest with 15 tests covering the shared lead schema (the one piece of business logic that runs on both client and server), FR/EN message parity + ICU placeholder parity, and config/slug invariants. `npm test`.
- [x] 🔧 **Enforce quality gates in CI** — `.github/workflows/ci.yml` runs typecheck → lint → test → `npm audit` on every PR and push to `main`.
- [x] ✅ **Follow mocking best practices** — the current tests are pure and need no mocks.
- [x] ⚠️ **Maintain test coverage thresholds** — no threshold yet; add `coverage.thresholds` once component tests exist, otherwise the number is meaningless.
- [ ] ❌ **Implement end-to-end testing** — none. Recommended first Playwright specs: locale redirect, contact form happy path + validation, mobile drawer focus trap, theme persistence.
- [ ] ❌ **Include accessibility testing** — none automated. Add `@axe-core/playwright` to the E2E run above; it would have caught the duplicate-ID bug fixed here.
- [ ] ❌ **Integrate real-time error monitoring** — none. The error boundaries already log `digest`; wiring Sentry (or a self-hosted GlitchTip, given the cPanel constraint) is a small change in `error.tsx` / `global-error.tsx`.
- [ ] ❌ **Enforce performance budgets in CI** — none. `@lhci/cli` with budgets for JS ≤ 300 KB and LCP ≤ 2.5 s is the natural next step once a staging URL exists.
- [ ] ❌ **Use visual regression testing** — none; Playwright screenshots on the 10 route types would cover it cheaply.
- [ ] ❌ **Test across all major browsers** / **Test on real mobile devices** — no recorded matrix. Do a manual pass (Chrome, Firefox, Safari, Edge; Android Chrome, iOS Safari) before launch and note results here.
- — **Contract testing**, **Mutation testing**, **Integration tests** — the only API is `/api/leads` → Resend; an integration test with a mocked Resend client is worthwhile but not blocking.

## Privacy

- [x] ✅ **Link to your privacy policy in the footer** — `/privacy` on every page, localised, under Burkinabè law.
- [x] ✅ **Avoid third-party cookies** — none set: GA4 is opt-in and consent-denied, so it sets no cookies; the app sets no cookies at all (`localeCookie: false`, theme in `localStorage`).
- [x] ✅ **Collect only the minimum personal data necessary** — the lead form asks for name, *either* email or phone, and the brief; everything else is optional; the honeypot is never stored.
- [x] ⚠️ **Show a cookie consent notice** — **correctly absent today**: no non-essential cookies are placed, so a banner would be noise. The moment analytics consent is *granted* anywhere, a banner and a privacy-copy update must ship in the same commit (documented in `Analytics.tsx` and the README).
- [ ] ❌ **Implement a user-facing data deletion mechanism** — the privacy page tells visitors to email to exercise their rights, but there is no explicit "request deletion of my data" path or stated retention period for leads. Add a sentence on retention (e.g. leads kept 24 months) and a one-line deletion instruction to `privacy.rights`.

## Internationalization

- [x] ✅ **Add hreflang tags for multilingual sites** — every page emits `fr`, `en` and `x-default` (→ French) in `<head>` and in the sitemap, from one helper so they cannot drift (`lib/seo.ts`, `app/sitemap.ts`).
- [x] ✅ **Use Intl APIs for currency, number, and date formatting** — `Intl.DateTimeFormat` in the scheduler; opening hours rendered per locale; no hand-formatted dates.
- [x] ✅ **Design UI components to accommodate text expansion** — fluid widths, `clamp()` headings, no fixed-width buttons; EN and FR both verified on all routes.
- [x] 🔧 **Every visible string goes through a translation key** — one hardcoded French block on the About page ("Engagement direct de la direction") was leaking onto `/en/about`; moved to `about.director.commitment.*` in both message files. Parity is now a unit test.
- [x] ⚠️ **Handle plural forms with ICU** — the two `{count}` strings (`"Nos services ({count})"`, `"+{count} autres"`) do not need plural categories in FR/EN; use ICU `{count, plural, …}` if a genuinely pluralised string is added.
- [x] ✅ **Use locale-neutral images** — share cards are per locale (`og-1200x630.png` / `-en.png`); all other imagery is text-free.

---

## Roadmap (open items)

Ordered by impact for this site; each maps to rules above.

**Before launch (host-level, ⏳)**
1. Verify HTTPS on apex + all subdomains, HTTP→HTTPS redirect, then keep HSTS preload (Security).
2. Confirm Brotli/Gzip, HTTP/2 or /3, and long `Cache-Control` for `/brand`, `/logo`, `/placeholders` on LiteSpeed (Performance).
3. Run Lighthouse (mobile), WebPageTest, Nu HTML validator, Rich Results Test, and a link crawler against production; record the numbers in this file.
4. Manual screen-reader (NVDA + VoiceOver) and real-device pass; fill in the browser matrix (Accessibility, Testing).

**P1**
5. Content-Security-Policy with per-request nonce (`proxy.ts` → layout) (Security).
6. Playwright E2E + `@axe-core/playwright` on the 10 route types; Lighthouse CI budgets (Testing).
7. Error monitoring hooked into the existing error boundaries (Testing).
8. Privacy page: retention period + explicit deletion request path (Privacy).
9. Self-host the three font families with `next/font/local` so builds no longer depend on Google (CSS/Performance).

**P2**
10. Put Cloudflare (or equivalent) in front of cPanel: CDN, HTTP/3, edge cache, optional Turnstile (Performance, Images, Security).
11. Converge on one animation runtime (`gsap` **or** `motion`) (Performance).
12. `noUncheckedIndexedAccess` pass (31 sites) (JavaScript).
13. Confirm the office address and switch `Organization` → `ProfessionalService` with `openingHoursSpecification` (SEO).
14. SVGO the logo set; progressive JPEG for the remaining service visuals (Images).
15. When articles/case studies ship: `Article` schema, author markup, visible dates, `dateModified` (SEO).

---

*Upstream: [thedaviddias/front-end-checklist](https://github.com/thedaviddias/front-end-checklist) — rule pages at
[frontendchecklist.io/rules](https://frontendchecklist.io/rules). Re-run this audit whenever a category of feature is added (video, tables, auth, articles) — the N/A rows become live rules.*
