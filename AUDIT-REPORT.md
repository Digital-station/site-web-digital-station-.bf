# Enterprise-Grade Credibility Audit — Digital Station (`digitalstation.bf`)

**Date:** 2026-09-20
**Branch:** `arena/01a0bd8a-site-web-digital-station-bf`
**Scope:** Every route (`/fr` + `/en`: home, services ×10, solutions, about, contact, privacy, terms, 404/error), layout chrome, structured data, assets, and the two downloadable documents.
**Method:** Full code review, server-rendered HTML inspection of all routes, asset inspection, external-signal checks, and live SSR verification after fixes.

This report complements `AUDIT-STRATEGY.md` (strategy doc). Where a finding was **fixed during this session**, it is marked ✅ IMPLEMENTED with the file(s) touched. Remaining work is in the roadmap at the end.

---

## 0. Executive summary

The technical skeleton of this site is genuinely strong — well above the median agency website: a disciplined design-token system, exemplary i18n architecture, server-rendered SEO (canonical/hreflang/OG/JSON-LD), an honest lead endpoint with real abuse guards, and careful accessibility work (focus traps, `inert`, reduced-motion fallbacks, skip link).

However, a previous "growth" pass added several sections that **break the site's own standards** and would actively damage trust with an enterprise buyer:

1. **A booking widget that lied** — it displayed fixed slots and claimed a Google Meet invite had been emailed, while sending nothing. *(✅ fixed)*
2. **"Official" documents that were 1 KB stubs** advertised as "1.2 Mo" / "280 Ko". *(✅ fixed — real 4-page deck + 2-page bilingual NDA, sizes now measured from disk)*
3. **French-only sections on the English site** — the exact audience the EN version exists for (international/nearshore buyers) landed on pages mixing English with hardcoded French. *(✅ fixed — full i18n)*
4. **Placeholder art standing in for product/engineering proof** — flat numbered tiles on service and solution pages. *(✅ 10 of 14 replaced with bespoke dark-tech visuals; 4 remaining, see roadmap)*

Scorecard (post-fix, honest scoring):

| Pillar | Before | Now | Target |
| --- | --- | --- | --- |
| 1. Visual design & UX | 6.5/10 | 8/10 | 9/10 |
| 2. Content & copywriting | 6/10 | 8/10 | 9/10 |
| 3. Technical SEO | 8.5/10 | 9/10 | 9.5/10 |
| 4. Trust & credibility | 5/10 (active liabilities) | 8/10 | 9/10 |

The remaining gap to "enterprise-grade" is **evidence, not engineering**: case studies, verifiable delivery track record, and a native (not translated) English voice.

---

## 1. Visual design & user experience

### What is strong
- **Token discipline.** All colours flow from `--ds-*` tokens (`app/globals.css`); the dark palette is a proper layered obsidian system (`#0b0d11 / #12161f / #181f2c`) with blue-tinted borders, not a flat grey. Light theme parity is maintained with measured contrast ratios documented in comments.
- **Motion quality.** Entrances are CSS-based (`.enter`), scroll reveals use `immediateRender:false` + `once:true` so content can never be stranded invisible; `prefers-reduced-motion` is honoured everywhere; heavy decorative chunks (Wavemesh canvas, industries carousel, tools marquee) are lazy and pause off-screen.
- **Navigation craft.** The drawer implements a real `aria-modal` contract (`inert` on background, focus return, single-press Escape). Mega-menu lists all ten services with per-service accents.
- **Layout identity.** Left rail, scroll indicator and oversized editorial headlines give the site a bespoke feel rather than a template feel.

### What undermined it (and fixes)
- **Placeholder imagery read as "unfinished template".** Service heroes and solution cards used flat blue tiles with big numerals. ✅ 4 solution product-UI mockups and 6 service diagrams replaced with bespoke, on-brand dark-tech artwork (`public/placeholders/*`). 4 service visuals remain (see §6).
- **Emoji as iconography** in the estimator (💻⚙️) clashes with the otherwise precise lucide-based icon language and renders inconsistently across OSes. ✅ Replaced with lucide icons in `ProjectEstimator.tsx`.
- **PWA manifest desync.** `manifest.ts` still shipped the pre-redesign `#191919` chrome colours. ✅ Now `#0b0d11`, matching `--ds-bg`.
- **Two animation libraries** (`gsap` and `motion`) plus `lenis` ship in the bundle. It works, but every extra runtime is payload on West-African mobile networks. *Roadmap:* converge reveals on one library.

### UX observations
- Mobile drawer, WhatsApp sticky CTA and touch targets meet the 48 px bar.
- The home page is long (8 sections). The scroll indicator mitigates this; consider anchor chips on mobile. *Roadmap.*
- The estimator's CTA prefills `/contact?objective=…` — good conversion wiring; keep.

---

## 2. Content strategy & copywriting

### What is strong
- **Honesty by construction.** Unsourced claims ("500+ projects", "50+ experts") were already removed; the About hero now states only verifiable facts (years computed from `foundingDate`, location). This is rare and valuable.
- **Single source of truth** for contact data/hours (`config/site.config.ts`) — the "open now" dot, footer, contact table and schema.org can no longer disagree.
- **Service pages** follow a consistent anatomy (audience → scope → process → guarantees) with concrete deliverables ("dépôt Git privé", "garantie 30 j") — exactly the transparency enterprise buyers reward.

### What was broken (and fixes)
- **The English site spoke French** in its newest, most strategic sections (segmentation, architecture explorer, estimator, scheduler, trust documents, solution CTAs). For a nearshore pitch this is fatal: the EN page is the artifact international buyers judge your engineering by. ✅ All strings moved to `messages/{fr,en}.json` with key parity enforced (verified: zero visible French on `/en/*` after the fix).
- **Copy defects.** "Pérénité" (→ *Pérennité*), "Depuis notre création ," spacing, "solutions IA , chatbots" double spacing (FR), "AI solutions : … processing , integrated" (EN). ✅ Fixed.
- **Dead external link.** The scheduler pointed to a non-existent Cal.com account. ✅ Removed; config documents that a scheduler link may return only once a real account exists.

### What still holds the copy back (roadmap)
- **Tagline translation.** "Building tomorrow's digital" is a literal calque; the EN hero could carry a stronger outcome statement, e.g. *"We engineer the software backbone of West African business — and of the partners who bet on it."*
- **"Tools We Master"** reads non-native; *"Our delivery stack"* is sharper.
- **No proof artifacts.** No case studies, no client quotes, no delivery numbers. The architecture explorer is the right *kind* of proof — extend it into 2–3 anonymized mini case studies (Problem → Architecture → Measured result) using your own products (Ticketia offline validation, AlimGesto edge sync).
- **No insights surface.** A quarterly "engineering notes" page would feed both SEO and authority.

---

## 3. Technical SEO

### What is strong (top decile)
- Per-page `pageMeta()` with canonical + full hreflang set + `x-default`; OG/Twitter cards per locale with localized share images; JSON-LD graph with a single `Organization` @id referenced everywhere; sitemap generated from route data with hreflang alternates; robots correct (no self-contradicting noindex+disallow).
- Locale routing is CDN-friendly (`localeDetection`/cookie off), redirects are 308, `poweredByHeader` off.

### Findings & fixes
- **Sitemap `lastmod` hygiene.** Dates claimed 2026-08-29 while content changed. ✅ Bumped for changed routes (home, solutions, about, contact); service routes untouched since their copy didn't change.
- **Build-time external dependency.** `next/font/google` fetches three families from Google at build time; an offline or build-restricted environment fails the whole build (observed directly). On cPanel this couples every deploy to Google's availability. *Roadmap:* self-host the three families with `next/font/local` (swap path already documented in `lib/fonts.ts`).
- **No CSP.** Deliberately deferred (needs a nonce for the inline theme script). *Roadmap:* add per-request nonce in `proxy.ts` + `Content-Security-Policy`.
- **Analytics/consent.** GA4 loads with consent denied and no banner exists, while the privacy page states "no cookies" — coherent today, but the moment a banner grants consent the privacy copy must be updated in the same commit. *Roadmap.*
- Minor: OG image alt is just the brand name; it could describe the card. `twitter:image` absolute URL is correct.

---

## 4. Trust & credibility

This pillar had **active liabilities** — elements that don't merely fail to build trust but destroy it when discovered.

| Liability | Risk | Status |
| --- | --- | --- |
| Scheduler claimed a Google Meet invite was emailed; nothing sent | A buyer who "books" and receives nothing concludes fraud | ✅ Now sends a real lead to `/api/leads` and promises confirmation within 24 business hours; WhatsApp fallback offered |
| Cal.com link to a non-existent account | 404 on a primary CTA | ✅ Removed |
| Capability deck / NDA were 1 KB stubs labelled "1.2 Mo / 280 Ko" | Committee downloads the file; the lie is discovered in one click | ✅ Real 4-page deck + 2-page bilingual NDA generated; size lines now computed from the actual files at render time (`about/page.tsx` → `TrustDocuments`), so they can never overstate again |
| EN pages mixing in French | Reads as machine-translated brochure | ✅ Fully bilingual |

### Verified assets that build trust
- Real, published corporate identity (SARL, RCCM, IFU, capital) in config and documents — confirmed authentic by the owner.
- Director portrait, direct email, and a named 20-minute architecture session — personal accountability, the correct strategy for a young firm.
- Honest legal pages (privacy, terms) under Burkinabè law; CIL/RGPD positioning on the cybersecurity service.
- Lead endpoint with size cap, origin check, dual rate-limit buckets, honeypot, shared zod schema and honest status codes.

### Remaining trust gap (roadmap)
- **Proof of delivery:** 2–3 anonymized case studies + "what you receive" checklists per service (the estimator already publishes guarantees — mirror them on each service page).
- **Vendor relationships:** avoid "Partner" claims without agreements; use "Engineered on: Odoo, AWS, …" phrasing (already true in the tools marquee).
- **Social channels** exist per owner; ensure the LinkedIn company page mirrors the site's claims (RCCM etc.) so cross-checks pass.

---

## 5. Implemented this session (change log)

- `messages/fr.json`, `messages/en.json` — ≈180 new keys (segments, architectures, estimator, trust docs, scheduler, solution modal), parity verified; typo/spacing fixes.
- `components/sections/home/AudienceSegmentation.tsx` — i18n.
- `components/sections/home/ArchitectureDiagrams.tsx` — i18n, proper `tablist` semantics.
- `components/sections/home/ProjectEstimator.tsx` — i18n, lucide icons, `aria-pressed` buttons.
- `components/sections/contact/MeetingScheduler.tsx` — real lead submission, honest confirmation, live-dated indicative slots, Cal.com removed.
- `components/sections/about/TrustDocuments.tsx` — i18n, truthful sizes, cards are real download links.
- `components/sections/about/AboutContent.tsx`, `app/[locale]/about/page.tsx` — sizes measured on disk at render.
- `components/sections/solutions/SolutionsContent.tsx`, `ProductPreviewModal.tsx` — i18n.
- `config/site.config.ts` — dead scheduler link removed with a policy comment.
- `app/manifest.ts` — theme colours synced to design tokens.
- `app/sitemap.ts` — truthful `lastmod`.
- `public/docs/*.pdf` — real documents (deck: 4 pages; NDA: 2 pages, FR/EN).
- `public/placeholders/` — 10 bespoke visuals (4 solution UI mockups, 6 service diagrams).

Verified: `npx tsc --noEmit` clean; all FR+EN routes SSR 200; zero visible French on EN routes; document size lines truthful.

---

## 6. Prioritized roadmap (remaining)

**P0 — this week**
1. Generate the 4 remaining service visuals (`transformation-digitale`, `cybersecurite-conformite`, `cloud-hebergement`, `intelligence-artificielle`) in the same art direction.
2. Self-host the three font families (`next/font/local`) to decouple builds from Google.

**P1 — next two weeks**
3. Publish 2–3 anonymized case studies (Ticketia, AlimGesto) with real architecture write-ups (Problem → Architecture → Measured result).
4. CSP with nonce; consent banner + privacy-copy update in the same change.
5. Native-EN copy pass on hero/tagline/tools headings.

**P2 — ongoing**
6. Converge on one animation runtime; audit marquee/canvas payload on 3G.
7. Add "what you receive" deliverable checklists to each service page.
8. Quarterly content cadence (engineering notes) for organic growth.

---

*Prepared with the owner's confirmations: corporate data authentic; no Cal.com account exists; audience weighting balanced across regional B2B, nearshore and public/NGO.*
