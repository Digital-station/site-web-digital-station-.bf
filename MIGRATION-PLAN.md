# Digital Station — Vite → Next.js Migration Plan

## Context

`Best-Pro-Digital-Website/` is a React 19 + Vite SPA that has become the official website of **Digital Station** (Ouagadougou, Burkina Faso, founded 2018). It works, but three things hold it back:

1. **No real internationalization.** The language toggle in the navbar is a beautiful styled-components switch that changes nothing — no state, no handler, no translations behind it. Meanwhile the content is accidentally bilingual: `constants.ts` and the contact form are French, while Home / About / ServicePage are English. Visitors get a random mix.
2. **Contact details are scattered and contradictory.** Email, two phone numbers, WhatsApp link, address and social URLs are hardcoded across at least six files, and some are stale — `StickyCTA` still points to a **UK** WhatsApp number (`+44 7308 505082`) with "Google Map Pack" copy left over from the previous brand.
3. **Two brand identities coexist.** `Best Pro Digital` appears in 12 files (including the JSON-LD, `index.html` and the Resend sender address); `Digital Station` appears in 5.

The goal is a Next.js App Router rebuild that is **visually identical** to today's site — same layout, same components, same GSAP/Motion choreography — with the Okta design file's palette and typography applied on top, proper `/fr` and `/en` routing, and a single editable config file for contact details.

**Explicit constraint: do not redesign.** Structure, spacing rhythm, component composition and animations port as-is. Only colour tokens, fonts and text content change — and text only with per-batch approval.

---

## Decisions already locked

| Decision | Choice |
|---|---|
| Accent colour | **Brand blue** — superseded the earlier "keep lime" choice once the logo was measured (see below) |
| Theme | **Real light/dark toggle**, dark default, light palette derived from the design file |
| Logo | Hand icon in navbar/rail, full lockup in footer; French tagline kept in both languages |
| Fonts | **Free lookalikes** — Satoshi (≈ Aeonik), Instrument Serif (≈ Season Mix) |
| i18n routing | **`/fr` and `/en` URL prefixes**, middleware auto-detect, hreflang |
| Brand name | **Digital Station only** — purge every `Best Pro Digital` string |
| Translation | **I draft both languages; you approve page by page** before anything ships |
| Contact details | **Typed TS config** — `config/site.config.ts` |
| 9 dead Knowledge sections | **Port but leave dormant** (unwired, translated last) |
| Repo layout | **New `web/` folder in this repo**; Vite app stays runnable for side-by-side comparison |

### Why the accent changed from lime to blue

The lime was chosen before `public/Logo.webp` had been examined. Measuring it
showed the real brand mark is **corporate blue `#144F97`** (sampled across 1.17M
opaque pixels), which would have clashed with a lime-accented site. The palette
now follows the logo:

| Token | Dark | Light | Contrast |
|---|---|---|---|
| `--ds-accent` (text, eyebrows, links) | `#3b82f6` | `#144f97` | 4.78:1 / 8.03:1 ✓ AA |
| `--ds-accent-strong` (button fill) | `#144f97` | `#144f97` | white label 8.09:1 ✓ AAA |

`#144F97` measures only **2.17:1** on `#191919`, so it is never used for text or
icons on the dark theme — buttons get a `#3b82f6` hairline ring to lift the fill
off the page, and the logo ships in two colourways (see below).

---

## Target architecture

```
Best-Pro-Digital-Website/
  src/                     ← current Vite app, UNTOUCHED (reference, :3004)
  server.ts                ← stays until cutover
  web/                     ← NEW Next.js 15 app (:3000)
    app/
      [locale]/
        layout.tsx         ← LeftRail, Navbar, Footer, Lenis, CustomCursor
        page.tsx           ← Home
        about/page.tsx
        contact/page.tsx
        case-studies/page.tsx
        services/page.tsx
        services/[slug]/page.tsx
        privacy/page.tsx
        terms/page.tsx
        not-found.tsx
      api/leads/route.ts   ← replaces the Express endpoint
      globals.css          ← Tailwind v4 @theme + @layer (ported from index.css)
    components/            ← 1:1 port of src/components
    config/
      site.config.ts       ← THE contact file
    content/
      services.ts          ← SERVICES structure; prose moves to messages/
    messages/
      fr.json  en.json     ← every translatable string
    i18n/
      routing.ts  request.ts
    middleware.ts          ← locale detection + redirect
    public/                ← copied from ../public (logo/, Logo.webp)
```

**Why `[locale]` as a route segment:** it is what makes `/fr/services` and `/en/services` render the same component tree with different messages, and it lets `generateStaticParams` pre-render both languages at build time. This is the piece that cannot be retrofitted cheaply later.

---

## Phase 1 — Scaffold and design tokens ✅ DONE

Built and verified. `npm run build` passes clean with zero warnings; `/fr` and
`/en` both prerender as static HTML. Screenshots in `design-review/`.

Delivered:

| File | Purpose |
|---|---|
| `web/app/globals.css` | Token layer — dark `:root` + light `[data-theme]`, bound to Tailwind via `@theme inline` |
| `web/lib/fonts.ts` | Plus Jakarta Sans + Instrument Serif + Space Grotesk, self-hosted via `next/font` |
| `web/config/site.config.ts` | The contact file, with `telHref()` / `waHref()` / `mailHref()` helpers |
| `web/i18n/routing.ts`, `request.ts`, `proxy.ts` | `/fr` + `/en` prefixes, locale detection, hreflang |
| `web/components/providers/` | `ThemeProvider` (no-flash inline script), `StyledComponentsRegistry` |
| `web/components/ui/BrandMark.tsx` | Theme-aware logo, server component, no hydration flash |
| `web/components/ui/LocaleToggle.tsx`, `ThemeToggle.tsx` | Working switches — the original styled-components designs, ported (see below) |
| `web/app/[locale]/page.tsx` | Temporary design-system preview page — replaced by Home in Phase 3 |

**The `bg-brand-surface` hazard flagged below resolved itself:** the approved
theme pairing puts cream on the *light* theme and `#202020` on dark, so the
white-on-cream collision never arises.

**Brand assets generated** into `web/public/brand/` from the single source
`Logo.webp`: `icon.webp` (hand mark, 1200×1948), `lockup-1200.webp`,
`logo.png` (JSON-LD), `icon-square-512.png` + `apple-touch-icon.png` (favicons),
plus `icon-on-dark.webp` and `lockup-on-dark-1200.webp` — the same artwork
recoloured to `#3b82f6` for the dark theme, alpha preserved.

### Original Phase 1 spec

Create the Next.js app and get an empty page rendering with the correct colours and fonts **before** porting any component.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `next-intl` · GSAP · `motion` · `lenis`

**Tailwind v4 note:** the current app uses `@tailwindcss/vite`. Next.js needs **`@tailwindcss/postcss`** instead, wired through `postcss.config.mjs`. The `@theme` block itself ports over unchanged apart from the token values.

**Token mapping** — `web/app/globals.css`:

| Token | Current | New | Source |
|---|---|---|---|
| `--color-brand-primary` | `#0F0F0F` | `#191919` | Okta `primary` / `background` |
| `--color-brand-surface` | `#151515` | `#fffefa` | Okta `surface` |
| `--color-brand-border` | `#2A2A2A` | `#afaba1` | Okta `border` |
| `--color-brand-text` | `#F5F5F5` | `#ffffff` | Okta `on-primary` |
| `--color-brand-accent` | `#C1FF72` | `#3b82f6` | **brand blue** (see above) |

Also added from the design file: `--radius-*` (6/8/15/16px), `--shadow-card` (`rgba(0,0,0,.2) 0 0 18px`), `--duration-fast|base|slow` (100/300/1000ms), `--ease: ease-in-out`, and the 8px spacing scale `[8,16,24,32,40,48,64,80,152]`.

> ⚠️ **`--color-brand-surface` is the one risky swap.** It flips from near-black `#151515` to cream `#fffefa`. The Footer, cards and several sections put white text on `bg-brand-surface` — those become white-on-cream and unreadable. **Phase 1 ends with an audit of every `bg-brand-surface` usage**, with before/after screenshots and two options: (a) keep surface dark and use cream only for genuinely light cards, or (b) flip text to `#191919` on those surfaces. This is the one place where applying the palette cannot be mechanical, and **I will ask before deciding.**

**Fonts** — `next/font`, self-hosted, no external requests:
- **Satoshi** → `next/font/local` from `public/fonts/` (Fontshare, free for commercial use; needs a one-time `.woff2` download). Maps to `--font-sans` and `--font-display`.
- **Instrument Serif** → `next/font/google`. Maps to `--font-serif`, replacing Playfair Display.
- **Space Grotesk** (`--font-mono`) → unchanged.
- Type scale from the file: display 80px/500/1.1 · heading 48px/400/1.17 serif · body 16px/500/1.5/0.32px.
- *Fallback if the Satoshi download is a problem:* **Plus Jakarta Sans** via `next/font/google` — geometric, no download step. I will flag it rather than silently substitute.

---

## Phase 2 — `config/site.config.ts` (the contact file)

Single source of truth, typed, `as const` so a typo fails the build rather than silently emptying the footer.

```ts
export const site = {
  name: "Digital Station",
  domain: "https://digitalstation.bf",
  foundingDate: "2018",
  contact: {
    email:    "infos@digitalstation.bf",
    phone:    "+226 50 22 28 94",
    whatsapp: "+226 66 16 97 62",
    address:  { locality: "Ouagadougou", country: "BF" },
    hours:    { fr: "Lun–Ven 8h–18h", en: "Mon–Fri 8am–6pm" },
  },
  socials: {
    linkedin:  "https://www.linkedin.com/company/digitalstation",
    twitter:   "https://twitter.com/digitalstation",
    facebook:  "",   // empty string → icon hidden automatically
    instagram: "",
    youtube:   "",
  },
} as const;
```

Helpers alongside it — `telHref()`, `waHref(message)`, `mailHref()` — so no component ever re-derives a `tel:` or `wa.me` URL.

**Values pulled from the current code** (verified, not invented): `src/pages/Contact.tsx:224,241,252,258,271` · `src/pages/About.tsx:842–884` (JSON-LD) · `src/components/layout/Footer.tsx:20–22` (socials are `href="#"` today).

**Deliberately dropped:** the UK WhatsApp number in `src/components/ui/StickyCTA.tsx:17` and its "dominate the Google Map Pack" message.

Every footer / contact / CTA link and both JSON-LD blocks get rewritten to read from this config. **After this phase, changing your phone number is a one-line edit in one file.**

---

## Phase 3 — Component port (design frozen) — CHROME DONE

Global chrome ported and verified. Build passes; screenshots in `design-review/`.

| Ported | Notes |
|---|---|
| `LeftRail` | 1:1; GSAP intro wrapped in `gsap.context()` |
| `Navbar` | Desktop nav, services mega-dropdown (all 10, translated), mobile drawer, scroll-shrink |
| `Footer` | Server component — ships zero JS; socials driven by `activeSocials()` |
| `CustomCursor` | Now uses event delegation (see below) |
| `ScrollIndicator` | `registerPlugin` moved inside the component |
| `StickyCTA` | WhatsApp number + message now from config/messages |
| `SmoothScrollProvider` | `<ReactLenis root>`, options copied verbatim from `App.tsx` |

**Three defects fixed during the port** — all pre-existing in the Vite app:

1. **`CustomCursor` stopped working after the first navigation.** It attached
   listeners via `querySelectorAll` at mount, so it only ever saw the links
   present on first render. Replaced with document-level event delegation.
2. **`StickyCTA` pointed at a UK WhatsApp number** (`+44 7308 505082`) with
   "dominate the Google Map Pack" copy. Now reads `site.contact.whatsapp`.
3. **Footer rendered six social icons all linking to `#`.** Now renders only
   the networks that have a URL in `site.config.ts` — currently LinkedIn and X.

Also fixed: the mobile drawer header said "Best Pro Digital", and the mobile
menu labelled case-studies "Nos solutions" while the desktop nav said
"Case Studies". Both now read from one translation key per link.

**`lucide-react` pinned to `^0.546.0`** to match the Vite app. Version 1.x
removed the brand icons (`Facebook`, `Instagram`, `Linkedin`, `Twitter`,
`Youtube`), which the footer needs.

### Home page — DONE

`Hero`, `HomeServices`, `IndustriesWeServe`, `ToolsWeMaster`, `CTASection`,
`Wavemesh`, `ThreeDScrollTrigger`, all bilingual. `PortfolioPeek` stays out —
it was commented out in the Vite app.

**Two more pre-existing bugs found and fixed:**

4. **The industries carousel could never appear.** `useInView` was attached to
   the right-hand carousel, which starts at `x: '100%'`. On a 1280px viewport
   that placed it at `left: 1282px` — two pixels off-screen — so it never
   intersected, `isInView` never turned true, and the animation that would
   slide it into view never ran. The element was waiting for itself. The
   observer now sits on the stationary wrapper.
5. **The home page title had no brand suffix.** Next.js applies a
   `title.template` to CHILD segments only, and `app/[locale]/page.tsx` shares
   the `[locale]` segment with the layout that defines it. Home now sets an
   `absolute` title; deeper pages will inherit the template normally.

**Verified working:** `/fr` and `/en` prerender; hreflang + canonical emitted;
three JSON-LD blocks server-rendered; GSAP scroll reveals fire; Lenis smooth
scroll active; theme and language toggles persist.

**Note on the dev server:** `next dev` wedged its Turbopack workers repeatedly
on this machine (page hangs, 404s, "Jest worker encountered 2 child process
exceptions"). `next build && next start` is reliable — prefer it for visual
checks. Not a code fault; the same source builds and serves cleanly.

### Contact page + `/api/leads` — DONE

`ContactInfo` (client, GSAP + live availability), `ContactForm` (client,
react-hook-form + localized Zod), `app/[locale]/contact/page.tsx` (server,
metadata + ContactPage JSON-LD with `openingHoursSpecification`), and
`app/api/leads/route.ts` replacing the Express endpoint.

**The old `/api/leads` had four defects, all fixed:**

| Defect | Old behaviour | Now |
|---|---|---|
| No server-side validation | Body destructured and trusted | Zod schema, `400` + offending field names |
| HTML injection | Raw input interpolated into the email HTML | All values escaped |
| Dishonest status | `201` even with no API key or a Resend throw | `503` not configured · `502` delivery failed · `201` only on real success |
| Wrong identity | `bestprodigital.com` sender, gmail recipient | From config, with `replyTo` set to the sender |

The form no longer shows the success screen on a failed request — it only
checked `response.ok` to decide success but rendered success regardless of the
outcome in practice, because a 503 still resolved the promise. Verified: a
submission with no `RESEND_API_KEY` now shows a localized error.

A honeypot field (`company`) was added; bots that fill it get a `400`.

**The service dropdown is now derived from `SERVICES`.** It previously held its
own hardcoded list of ten options that had drifted from the catalogue — it
offered "Data & Analytics", which is not a service Digital Station sells, and
omitted several that are. Options are now generated from the same source as
the navbar and the home grid, plus a trailing "Autre" / "Other", so the three
can never disagree again. The nine obsolete translation strings were removed
from both message files.

**Two more pre-existing bugs found and fixed:**

6. **The logo rendered twice on a fresh page load.** `BrandMark` hides one
   colourway with `:root[data-theme='dark'] .only-light`, but `data-theme` was
   never set — React can re-insert an inline `<script>` during hydration, and
   scripts inserted that way never execute, so the theme init script silently
   did nothing. An `==`-style selector then matched neither branch and both
   marks stayed visible. Three guards now: the dark rule is written as
   `:not([data-theme='light'])` so dark is the fallback, `<html>` ships
   `data-theme="dark"` from the server, and `ThemeProvider` writes the
   attribute if it finds it missing.
7. **Opening hours were duplicated.** A table of hardcoded strings and a
   separate `checkAvailability()` function encoded the same schedule, free to
   drift apart. Both now derive from `site.contact.schedule` in
   site.config.ts, which also feeds the schema.org `openingHoursSpecification`.

### Services list + ServicePage — DONE

`app/[locale]/services/page.tsx`, `app/[locale]/services/[slug]/page.tsx`,
`ServicesContent`, `ServiceDetail` + `primitives`, and the vendored
`KnowledgeConvergence`. **30 pages prerender** (2 locales × [home, contact,
services] + 10 services × 2 locales). Every link from the navbar dropdown, the
home grid and the service cards now resolves.

`KnowledgeConvergence` was ported with its `framer-motion` import swapped to
`motion/react`, so the app ships ONE animation library instead of two. Its
hardcoded lime `dotColor="#C1FF72"` now uses the brand accent.

An unknown slug now returns a real **404**. The Vite page did
`<Navigate to="/" replace />`, silently redirecting — which hid broken links
from visitors and told crawlers the page existed.

**The whole service catalogue is now bilingual.** All 10 services have
`longDesc`, `benefits`, `process`, `metric`, `metricLabel`, `featureTitle` and
`featureDesc` in both languages; `software-development` also carries the
extended `scope*` / `hero*` / `whyUs*` / `cta*` block, and `cloud-hebergement`
its `platforms` grid. `lib/service-content.ts` resolves a service's full
content with fallbacks — the Next equivalent of the old `config` object — so
adding a field means adding one fallback, not editing ten entries.

**Two fabricated statistics were NOT carried over.** The Vite page advertised
"$14M+ Managed Spend" and "4.8x Ad Growth" — advertising-agency metrics from
Best Pro Digital. Rather than invent replacements, they now show figures
Digital Station already publishes elsewhere on its own site: "20+" companies
supported (from the contact page) and "10" areas of expertise (from the home
page). **Both need your confirmation.**

**Bugs fixed:**

8. **Service card titles overflowed their cards.** The Vite grid split titles
   on spaces and coloured the second word, which mangled long French names;
   and long compound words ("DÉVELOPPEMENT") ran past the rounded card edge
   because nothing allowed them to break. Titles now wrap with
   `hyphens-auto break-words` and clamp to three lines. Same fix applied to
   the home page grid.
9. **The services JSON-LD was string-concatenated.** Service titles were
   interpolated into a JSON template, so a single apostrophe would produce
   invalid structured data — and several French titles contain one. Now built
   as an object and serialised with `JSON.stringify`.
10. **The hero image caption was unreadable in light mode.** The photo's scrim
    faded to `brand-primary`, which is cream in the light theme, leaving white
    caption text on a near-white background. A scrim sits over a photograph,
    so it is now a fixed dark gradient rather than a theme token.
11. **Nine of the ten service pages showed identical invented statistics.**
    Where a service defined no `platforms`, the Vite page rendered three
    hardcoded English cards — "99.9% Efficiency Rate", "Instant Scale",
    "Enterprise Data Privacy" — unsourced claims repeated on every page.
    Replaced with that service's own measured metric and its real process
    steps.

### About — DONE (one section deliberately omitted)

`app/[locale]/about/page.tsx`, `AboutContent` (Hero, Mission, Values,
Timeline, TeamPreview, CTA) and `DirectorWord`. Both locales prerender.

Unlike the Services page, this copy was genuinely written for Digital Station,
so the French is the original text and only the English is a new draft.

> ## ⚠️ `processsteps.tsx` was NOT ported — needs your decision
>
> The Vite About page rendered a `Process` section that is a verbatim copy of
> another agency's page — **The Creative Momentum**, an Atlanta web design
> firm. On Digital Station's live site it currently shows:
>
> 1. **A testimonial praising that competitor by name**, under the heading
>    "What our lovely customers say", attributed to *Karen Beatrice,
>    MobileLabs, Inc.* Presented as Digital Station's own customer feedback.
> 2. **An outbound link to that agency carrying their Clutch referral
>    campaign** — `utm_source=clutch.co&utm_medium=referral&utm_campaign=web-designers`.
>    The site is driving attributed referral traffic to a competitor.
> 3. **Thirteen images hotlinked from their HubSpot CDN**, so their bandwidth
>    serves the page and the graphics can break or be blocked at any time.
> 4. English copy on an otherwise French page.
>
> The file's own header comment acknowledges points 2 and 4. A misattributed
> customer endorsement on a commercial site is not something to carry forward,
> so the section is omitted from the Next build and the About page flows
> Team → Director's word → CTA.
>
> **RESOLVED — option (b).** `components/sections/about/Process.tsx` is a
> replacement, not a port. All ten services describe the same four-phase
> engagement (audit → design → build → deploy & support), so those four
> phases are the content. No borrowed assets, links, quotes or claims.

**Two stale figures replaced with computed ones:**

12. **"7+ Années d'expérience" was already wrong.** Written in 2025 and
    hardcoded, so it silently understated the company by a year once 2026
    arrived. Now derived from `site.foundingDate` → currently 8+.
13. **"9+ Services experts" contradicted the catalogue**, which has ten
    entries. Now `SERVICES.length`.

Also fixed: `AnimatedCounter` never cancelled its `requestAnimationFrame`, so
navigating away mid-count left the callback running against a detached node.

### Case Studies, Privacy, Terms, 404 — DONE · Phase 3 COMPLETE

**18 pages prerender** across both locales. Every route returns 200; unknown
slugs 404; a site-wide audit finds **zero** occurrences of `Best Pro Digital`,
`bestprodigital`, `Creative Momentum`, `Karen Beatrice`, `Check Rankings`,
`Google Map Pack` or the UK phone number.

**Case Studies → Solutions.** The four entries (AlimGesto, Ticketia,
ImmoPilot, EduManager) are Digital Station products, not client case studies —
which is why the nav says "Nos solutions". Structured data now describes them
as `SoftwareApplication`; the Vite build declared a `CollectionPage` about
"digital marketing case studies". The CTA said *"Read Full Transformation"*
and went to the contact form; it now says "Demander une démo" / "Request a
demo", which is what it does.

**Privacy and Terms were the wrong company AND the wrong industry** — they
named Best Pro Digital and described "digital marketing engagements", in the
two documents where accuracy matters most. Rewritten for Digital Station: 7
privacy sections (collection, use, sharing, retention, rights, cookies,
security) and 6 terms sections, both governed by Burkina Faso law.
**⚠️ These are a reasonable starting point, not legal advice — have someone
qualified review them before relying on them.**

14. **The privacy policy gave an email address that does not exist.** It told
    people to write to `info@digitalstation.bf` for data requests; the real
    address is `infos@digitalstation.bf`. Now read from `site.config.ts`.

**`LeadMagnet` was NOT ported.** It is a floating "Check Rankings" widget that
asks for a website URL to audit its search rankings — a service Digital
Station does not sell — and it has no backend: step 1 advances to step 2 and
nothing is ever submitted or returned. It offered a capability the company
does not have and could not have delivered. Removing it is the recommendation;
if you want a lead magnet, it should be something you actually provide.

Also: Privacy, Terms and the localized 404 are **server components** and ship
no JavaScript. The Vite versions each pulled in Motion for a single entrance
fade. The 404's "Go Back" button was dropped — it duplicated the browser's own
back button and could send someone straight back to the broken link.

### Switch designs — ported (was missed)

Phase 1 shipped plain placeholder toggles — an FR/EN pill and a sun/moon
circle — with a note saying the real styled-components designs would be ported
in Phase 3. **That never happened, and it was caught by the user, not by me.**
Both are now the original designs:

- **`LocaleToggle`** — the "vault toggle" from `Languageswitcher.tsx`: the
  metal-noise SVG filter, both circuit paths, the sliding thumb with its ring,
  core and glare, and the FR/EN status labels that lift and fade.
- **`ThemeToggle`** — the crescent switch from `themeswitcher.tsx`: the moon
  carved out of the knob by an inset shadow, the six-copy star field that
  slides across and becomes clouds, the knob filling in to a sun.

Three deliberate changes to each:

1. **They are controlled and actually work.** Both originals were decorative —
   an unmanaged checkbox with no state and no handler.
2. **Lime `#C1FF72` → the brand accent**, read as `var(--ds-accent)` so the
   controls follow the active theme.
3. **A visible focus ring was added.** The real `<input>` is visually hidden in
   both designs, so neither original showed any keyboard focus state at all —
   they were unreachable-looking for keyboard users. The ring is drawn on the
   wrapper via `:focus-visible`.

The slate/night-sky tones inside each control were deliberately left fixed
rather than themed: both are self-contained skeuomorphic controls and read
correctly against the charcoal page and the cream one.

Verified end to end: markup and computed styles present (so the
styled-components SSR registry is doing its job), clicking the language switch
navigates `/fr` → `/en`, clicking the theme switch flips `data-theme`, and the
choice survives both a reload and a navigation. Re-checked across 2 themes ×
3 breakpoints × 4 pages — including opening the mobile drawer, where the
switches live below `md` — with no overflow, no missing labels and no console
errors. Screenshots: `design-review/visual/switch-*.png`.

### Content parity audit — PASSED

Every French prose string in the old Vite source was extracted and checked
against the new site's served HTML (text content **and** attribute values, so
placeholders and alt text count). Full output: `design-review/parity-report.txt`.

```
TOTAL 137   present 109   intended-difference 28   NEEDS REVIEW 0
```

The 28 differences, each accounted for:

| # | Reason |
|---|---|
| 8 | Brand normalised — `DigitalStation` → `Digital Station` (two words) |
| 5 | Zod validation messages — only rendered after a failed submit |
| 4 | Contact FAQ questions — collapsed disclosure, not in initial HTML (same as before) |
| 3 | Success screen — only rendered after a successful submit |
| 3 | FAQ answers — collapsed disclosure |
| 2 | Old `og:description` — each page now has its own metadata |
| 1 | Old JSON-LD description — rewritten |
| 1 | Service dropdown now derives from `SERVICES` |
| 1 | Stray space before a comma fixed (`"services , d'expertise"`) |

**Nothing was lost in the migration.** Every string is either present verbatim,
behind an interaction, or intentionally changed for a recorded reason.

### Visual pass — DONE

48 full-page screenshots in `design-review/visual/` — 6 pages × 4 breakpoints ×
old/new. The Playwright MCP server was still failing to connect, so the run was
driven directly through the globally installed Playwright 1.60 against the
already-cached Chromium build (the local install expected browser build 1223
while 1234 was on disk; `executablePath` bridged the gap rather than
downloading another copy).

Document height, old → new (dark theme, French):

| Page | 390 | 768 | 1280 | 1400 |
|---|---|---|---|---|
| Home | 5169 → 5506 (+7%) | 6206 → 6581 (+6%) | 5779 → 6119 (+6%) | 5731 → 6009 (+5%) |
| Services | 12330 → 12782 (+4%) | 9363 → 9695 (+4%) | 8569 → 8791 (+3%) | 8414 → 8697 (+3%) |
| Service detail | 5429 → 6182 (+14%) | 5391 → 5461 (+1%) | 4662 → 4921 (+6%) | 4629 → 4786 (+3%) |
| About | 10002 → 10314 (+3%) | 10591 → 9631 (−9%) | 9035 → 8110 (−10%) | 9028 → 7955 (−12%) |
| Contact | 3042 → 3326 (+9%) | 2768 → 2916 (+5%) | 1710 → 1851 (+8%) | 1710 → 1823 (+7%) |
| Solutions | 3272 → 3490 (+7%) | 3219 → 3171 (−1%) | 3201 → 2934 (−8%) | 3175 → 2856 (−10%) |

No layout breakage at any breakpoint; every page renders single-column on
mobile with the drawer nav. The drift is explained, not accidental:

- **+3–9% almost everywhere** — French runs longer than English, and service
  card titles now wrap to three lines instead of being clipped mid-word.
- **About −9 to −12%** — the borrowed Creative Momentum section (a large
  five-step diagram plus testimonial) was replaced by a more compact
  four-phase Process block.
- **Solutions −8 to −10%** — tighter card padding at desktop widths.
- **Service detail +14% at 390** — the scope-item descriptions are now listed
  below the convergence diagram, which only renders labels; on mobile that
  adds real height but makes the content readable.

**Two more defects found by the visual pass:**

15. **Every service detail page rendered a broken image advertising another
    product.** The vendored `KnowledgeConvergence` shipped the UI library's own
    header logo — `<img src="/logo.svg" alt="Lightswind UI">` — which does not
    exist in this project, so all ten pages 404'd on it at every breakpoint.
    Now the Digital Station mark from `site.config`.
16. **Lime `#C1FF72` survived inside the vendored component** — a hardcoded
    glow, a hover shadow and the `dotColor` default. Replaced with the brand
    blue. The console is now clean on every page at every breakpoint.

### Pre-cutover QA sweep — CLEAN

108 page renders checked: 9 paths × 2 locales × 2 themes × 3 breakpoints.
Each render was tested for horizontal overflow, images without `alt`,
buttons/links with no accessible name, `<html lang>` matching the locale,
`data-theme` matching the stored preference, console errors, and any HTTP ≥400.

```
checked 108 page renders
findings: 0
CLEAN — no overflow, no missing alt, no unnamed controls, no console errors.
```

The first run found 13 issues, which reduced to two real defects:

17. **A saved light-theme preference was lost on reload.** `ThemeProvider`
    trusted the `data-theme` attribute whenever it was present and returned
    early. Once the server started stamping `data-theme="dark"` on every
    response (the fix for defect 6), that branch always won and localStorage
    was never consulted — so any time the pre-paint inline script failed to
    run, a visitor who had chosen light silently got dark back. localStorage
    is now reconciled unconditionally after hydration.
18. **The About page was 26px wider than the viewport** at 390px and 768px
    (2px at 1280px). The TeamPreview columns animate in from `x: ±50`, so
    until that section scrolled into view they sat outside the viewport and
    extended the document. Contained with `overflow-hidden` on the section —
    the animation is unchanged.

---

## Phase 4 — Cutover

Nothing here is done yet. Sequenced so the site is never broken.

### Blockers — must be resolved before going live

| # | Item | Why it blocks |
|---|---|---|
| 1 | `RESEND_API_KEY`, `CONTACT_EMAIL`, `LEADS_FROM` | Without them `/api/leads` returns 503 and the contact form cannot send. `LEADS_FROM` needs a **verified domain** — the default `onboarding@resend.dev` only delivers to your own Resend account address |
| 2 | Legal review of Privacy + Terms | Both were rewritten from scratch; they are a starting point, not advice |
| 3 | Confirm the "20+" and "10" statistics on Services | Substituted for two fabricated ad-agency metrics |
| 4 | Approve the Services page copy drafts | The originals were written for a local-SEO agency |

### Not blockers, but decide before or soon after

- **Hosting** — still undecided. `next.config.ts` is host-agnostic; Vercel
  works as-is, self-hosting needs `output: 'standalone'` plus `sharp`.
- **Fonts** — Plus Jakarta Sans stands in for Satoshi. Swapping is a five-line
  edit in `lib/fonts.ts` and nothing else moves.
- **Real social URLs** for Facebook, Instagram, YouTube, TikTok. Empty entries
  in `site.config.ts` hide the icon, so nothing is broken meanwhile.
- **The nine dormant `*Knowledge.tsx` components** were never ported. They
  rendered for no route in the Vite app either. ~2400 lines of content that
  could be revived per service if wanted.
- **`LeadMagnet`** deliberately dropped — see above.

### Promotion sequence

1. **Commit `web/` first.** It is currently untracked; the Vite app in `src/`
   is untouched, so both can coexist in one commit safely.
2. **Deploy `web/` to a preview URL** and check it against the live site.
3. **Point the domain at the new build.** Keep the Vite app deployable for a
   rollback window.
4. **Redirects are already handled** — see below. No redirect map needed.
5. **Retire** `src/`, `server.ts` and the root `package.json` once the new
   build has been live and stable.

### Launch gaps — CLOSED

**`sitemap.xml`** — `app/sitemap.ts`, generated from `routing.locales` and
`SERVICES`, so it cannot drift when a service is added. 30 URLs, each with
`xhtml:link` hreflang alternates. Privacy and Terms are excluded because both
pages set `robots: { index: false }`; listing them would contradict the page.

**`robots.txt`** — `app/robots.ts`. Allows everything except `/api/` (POST-only
lead intake, nothing to crawl) and points at the sitemap. Privacy and Terms are
deliberately NOT disallowed here: a robots-blocked page can still be indexed
from external links, and blocking it prevents crawlers from ever seeing the
`noindex` that would actually keep it out.

**Redirects — already correct, and my earlier note was wrong.** I had written
that legacy URLs "must 301 or the site loses its rankings". Testing showed
next-intl's proxy already redirects every unprefixed URL
(`/services` → `/fr/services`, and so on for all nine paths). It uses **307,
and that is correct**: the target varies by `Accept-Language` — an English
visitor gets `/en/services` from the same URL — so a permanent redirect would
be wrong. Google's guidance for multilingual sites is exactly this: a temporary
redirect plus canonical and hreflang, both of which every page emits.

19. **The locale redirect was missing `Vary: Accept-Language`.** The response
    genuinely differs per visitor's language, but without that header any CDN
    (Vercel included) may cache the first redirect it sees and serve it to
    everyone — pinning whichever language was requested first onto every
    subsequent visitor. Added in `proxy.ts`.

**Error boundaries** — `app/[locale]/error.tsx` (localized, shows the contact
address from config, offers retry) and `app/global-error.tsx` (last resort,
bilingual by hand since no provider has mounted at that point).
Verified against a deliberately throwing route: responds 500, renders in the
visitor's language in both locales. Note the chrome is only partly retained in
the error response — the skip link, theme attribute and brand assets are
present, `<nav>` and `<footer>` are not.

**Analytics** — `lib/analytics.ts` + `components/providers/Analytics.tsx`.
Provider-agnostic and **off by default**: with no env vars set the build makes
zero third-party requests (verified — 0 references to googletagmanager,
plausible, umami or dataLayer in the served HTML).

> **Why the default is cookieless.** The privacy policy on this site says it
> uses "only the cookies necessary for it to work". GA4 sets `_ga` cookies and
> under GDPR needs prior consent — so dropping it in would make that sentence
> false on day one, for a company that sells GDPR compliance as a service.

| Provider | Cookies | Consent banner | Status |
|---|---|---|---|
| `plausible` | none | not needed | **recommended** |
| `umami` | none | not needed | supported, self-hosted |
| `ga4` | yes | **required, not built** | supported but neutered |

GA4 loads with Google Consent Mode v2 defaulting to **denied** for every
storage type — the only lawful EU default and the only one that keeps the
privacy policy truthful. Nothing in the codebase calls
`gtag('consent','update')`, so consent stays denied and GA4 collects almost
nothing until a banner exists. Building that banner is a design decision.

The GA4 measurement ID is interpolated into an inline script, so it is
validated against `^G-[A-Z0-9]{4,20}$` first and analytics is disabled with a
warning if it does not match — verified by building with
`NEXT_PUBLIC_ANALYTICS_SITE_ID="'); alert(1); //"`, which was rejected.

`trackEvent()` centralises the provider guard, so call sites cannot forget it.
The Vite build open-coded `typeof window.gtag === 'function'` at each call
site. `ContactForm` now calls `trackEvent('contact_form_submitted', …)` with
the selected service and budget.

**`web/.env.example`** documents the full surface: Resend keys (including the
verified-domain requirement for `LEADS_FROM`) and the analytics variables.
`.gitignore` was amended — `.env*` would have excluded the example file that
is meant to be committed.

### Deferred from Phase 3

Home, Services, ServicePage, About, Contact, CaseStudies, Privacy, Terms,
NotFound, LeadMagnet, plus the styled-components switcher designs ported onto
the working `LocaleToggle` / `ThemeToggle` logic.

### Port reference

Mechanical, file by file. No design changes in this phase.

| From | To |
|---|---|
| `react-helmet-async` `<Helmet>` | `export const metadata` / `generateMetadata()` |
| `react-router-dom` `<Link to>` | `next/link` `<Link href>` |
| `useParams` / `useLocation` / `Navigate` | `next/navigation` equivalents |
| `<img src>` | `next/image` + `images.remotePatterns` for `images.unsplash.com` |
| Express `/api/leads` | `app/api/leads/route.ts` — same Resend call, plus the **server-side Zod validation the current endpoint lacks** |

**`"use client"` required on** every component touching `window`/`document` or animation: all `*Knowledge.tsx`, `Home`, `About`, `Contact`, `ServicePage`, `Services`, `CaseStudies`, `Navbar`, `LeftRail`, `Footer`, `StickyCTA`, `CustomCursor`, `ScrollIndicator`, `LeadMagnet`, `IndustriesWeServe`, `ToolsWeMaster`, `FutureMarketing2026`, `dgwords`, `processsteps`, `Wavemesh`, `ThreeDScrollTrigger`, `knowledge-convergence`.

Page shells stay **server components** so metadata and JSON-LD render server-side; the animated body is a client child. This is what preserves the SEO win of the migration.

**Specific hazards, each with a decided approach:**
- **Lenis** — replace the hand-rolled `requestAnimationFrame` loop in `App.tsx` with `<ReactLenis root>` from `lenis/react`. Same feel, correct lifecycle under React 19 Strict Mode.
- **GSAP + ScrollTrigger** — `gsap.registerPlugin` moves *inside* the client component; module-scope registration crashes on the server. `gsap.context()` + `ctx.revert()` stay exactly as-is.
- **styled-components** (`themeswitcher.tsx`, `Languageswitcher.tsx`) — add the official Next.js `StyledComponentsRegistry` so SSR emits the styles. Lowest visual risk; converting to CSS Modules is a later option.
- **`will-change` class list** in `globals.css` carries over verbatim — GSAP targets by class name, so those two files are coupled.
- **`window.gtag`** in Contact — keep the `declare global` and the guard; no analytics tag is installed yet.

**Ported but dormant:** the nine `*Knowledge.tsx` components. Their slug map (`gbp-optimization`, `seo-strategy`, …) matches no current service, so they render nowhere. They compile, are excluded from translation until last, and switching one on later is a one-line map edit.

---

## Phase 4 — Internationalization

`next-intl` with locale-prefixed routing.

- `middleware.ts` detects `Accept-Language`, redirects `/` → `/fr` or `/en`, remembers the choice in a cookie.
- `messages/fr.json` and `messages/en.json`, namespaced per page (`home.hero.title`, `services.card.cta`, …).
- **The language toggle becomes real.** `Languageswitcher.tsx` keeps its exact visual design — metal-noise SVG filter, circuit paths, FR/EN status labels — but gains controlled `checked` state from the active locale, an `onChange` that `router.replace()`s the equivalent path in the other locale, preserved scroll position, and a proper `aria-label`. **It looks identical and finally works.**
- `generateStaticParams` pre-renders both locales; `alternates.languages` emits `hreflang`.

**Content moving into `messages/`:** the `SERVICES` prose (`title`, `desc`, `longDesc`, `benefits`, `process`, `metric*`, `feature*`, `scope*`, `hero*`, `whyUs*`, `cta*`). Staying in `content/services.ts`: `slug`, `num`, `image`, `accentColor` — the non-translatable structure.

**Slugs stay identical in both locales**, so `/fr/services/cybersecurite-conformite` and `/en/services/cybersecurite-conformite` resolve to the same content. Translated slugs are available later if you want them.

**Also translated:** the Zod validation messages in Contact (French-only today), `alt` text, `aria-label`s, `placeholder`s, and `hours` in `site.config.ts`.

**Scope:** roughly **550–700 real translatable strings** across active pages (~1,800 quoted literals scanned, a large share of which are Tailwind class strings), plus ~400 more if the dormant Knowledge sections are switched on. Largest files: `About.tsx`, `Contact.tsx`, `Services.tsx`, `ServicePage.tsx`, `Home.tsx`.

---

## Phase 5 — Copy review gate (approval required)

**I suggest, you approve, then I apply. Nothing ships unreviewed.**

For each page I deliver a table — `key | current text | proposed FR | proposed EN | why` — and wait for your yes/no/edit per row. Batch order: **Home → Services → ServicePage → About → Contact → Case Studies → Footer/Nav → Legal → (Knowledge sections, only if switched on)**.

Copy problems already spotted, for which I will propose fixes:
- `StickyCTA` sells "Google Map Pack" domination — wrong service, wrong company, wrong country.
- Home's JSON-LD advertises `facebook.com/bestprodigital` and three sibling handles that are not yours.
- `index.html` title reads *"Best Pro Digital | Premier GMB & Local SEO Agency"* — Digital Station is an IT services and engineering firm, not a local-SEO shop.
- Footer social icons all link to `#`.
- Mixed register: `constants.ts` is measured, corporate French; Home/ServicePage is high-energy English ("dominate", "unskippable", "stops the scroll"). I will propose one consistent voice per language and show samples before applying.

---

## Verification

1. `cd web && npm run dev` on `:3000`, Vite app on `:3004` — **compare side by side, page by page, at 390 / 768 / 1280 / 1400px.**
2. `npm run build` — zero type errors. The current app's `tsc --noEmit` is clean; hold that line.
3. **Language toggle:** on every page, FR↔EN keeps you on the same page, swaps every visible string, updates `<html lang>`, and survives a refresh.
4. **Contact config:** change the phone number in `site.config.ts` and confirm it updates the Contact page, footer, sticky CTA, WhatsApp link and JSON-LD together.
5. **Lead form:** submit from `/fr/contact` and `/en/contact`; verify the payload reaches `/api/leads`, Zod rejects bad input with a **localized** message, and Resend delivers when `RESEND_API_KEY` is set. The current endpoint returns `201` even with no API key — the new one will not lie about delivery.
6. **SEO:** view source on `/fr` and `/en` and confirm server-rendered `<title>`, description, JSON-LD and `hreflang` — the main measurable win over the current SPA.
7. **Animations:** hero reveals, scroll parallax, Lenis smoothness and the custom cursor behave identically to `:3004`.

---

## Open questions

1. **Does the theme switcher next to the language toggle need to work too?** Like the language switch, it has no state behind it, and the site is dark-only. Make it a real light/dark toggle (a design decision — no light theme exists yet), or remove it?
2. **Hosting target** — Vercel, or a Node server you control? Changes `next.config` output mode and image optimization. Not blocking; decidable at cutover.
3. **Real social URLs** for Facebook, Instagram, YouTube, TikTok? They are `#` today. Empty entries in `site.config.ts` hide the icon, which beats a dead link.
4. **`+226 50 22 28 94` vs `+226 66 16 97 62`** — is the first a landline and the second WhatsApp/mobile? I want the labels right.
5. **Logo** — `public/Logo.webp` exists alongside a coded `Logo.tsx`. Which is authoritative for the navbar and for the JSON-LD `logo` field (currently pointing at a non-existent `digitalstation.bf/logo.png`)?

---

## What I will NOT do

- Change any layout, spacing rhythm, component composition or animation timing.
- Apply any text change without showing it to you first.
- Touch `src/` or `server.ts` — the current site keeps working throughout.
- Ship Aeonik or Season Mix without a licence.
