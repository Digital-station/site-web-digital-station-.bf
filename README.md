# Digital Station (`digitalstation.bf`)

[![CI Quality Gate](https://img.shields.io/badge/CI-Typecheck%20%7C%20Lint%20%7C%20Test-brightgreen.svg)](#local-development--testing)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN%20(next--intl)-indigo)](https://next-intl.dev/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-99--100%20All%20Metrics-brightgreen.svg)](#quality--compliance-scorecard)

Enterprise web platform and engineering portfolio for **Digital Station SARL** — a technology, digital transformation, and IT services agency based in Ouagadougou, Burkina Faso.

---

## 🌟 Key Architecture & Highlights

- **Next.js 16 App Router + React 19:** Optimized for SSG (Static Site Generation) across all 43 localized routes with standalone Node.js deployment.
- **Bilingual Internationalization (next-intl):** Strict key-for-key parity between `messages/fr.json` (default) and `messages/en.json`. Automated CI tests enforce message parity and ICU placeholder synchronization.
- **Dark Futuristic Tech Aesthetic (Design Tokens):** Deep Obsidian Void (`#0b0d11`), Layered Card Surfaces (`#12161f` / `#181f2c`), and Electric Cyan (`#38bdf8`) / Sapphire Brand Blue accents. Strict WCAG 2.1 AA/AAA contrast ratios verified across both Dark and Light themes.
- **Dynamic Interactive Canvas & Visuals:**
  - **Hero Wavemesh:** Full-section point-mesh wave canvas scaled dynamically to container dimensions with theme-reactive particle luminance and `prefers-reduced-motion` fallbacks.
  - **Knowledge Convergence:** Flow diagram with dynamic bounding-box coordinate tracking for bezier stream convergence into the central hub node.
  - **Industries Auto-Scroll:** Immediate rotation on viewport entrance via optimized `IntersectionObserver`.
- **Search Engine Authority & Structured Data:**
  - Complete Schema.org JSON-LD graph: `Organization` & `ProfessionalService` (with Ouagadougou coordinates, IFU/RCCM legal identifiers, and opening hours), `WebSite` with SearchAction, `Service` (11 service offerings), `ItemList` / `CreativeWork` (for the 8 solutions listed below), `BreadcrumbList`, `ContactPage`, and `FAQPage`.
  - Multilingual `hreflang` tags (`fr`, `en`, `x-default`) and automated XML sitemap generation.
- **Hardened Lead Intake (`/api/leads`):** SMTP delivery (nodemailer, configured in `.env`) with request size cap (16 KB), origin verification, IP-based & global rate limiting, honeypot anti-spam, and Zod input sanitization.

---

## 🧩 Solutions catalogue (`/solutions`)

Eight products, shown three per page with a page selector at the bottom right.
No prices and no visuals: each card's **Demander une démo** button opens
`/contact?product=<id>`, which pre-fills the contact form.

| Solution | Scope |
| :--- | :--- |
| **DigiERP** | Full ERP: accounting, purchasing, sales, inventory, HR & payroll, projects |
| **DigiResto** | Restaurant point of sale: tables, kitchen orders, split bills |
| **DigiStore** | Retail point of sale: barcode checkout, stock, loyalty |
| **DigiCourrier** | Electronic mail management: registration, routing, approvals, archiving |
| **DigiSchool** | School management: enrolment, attendance, grades, fees, parents |
| **DigiChat** | Secure business email for teams |
| **DigiTicket** | Online event ticketing and check-in |
| **DigiPost** | Social media scheduling and publishing |

To add or edit one: the id and tag/feature counts live in `content/solutions.ts`; the
copy lives in `solutions.items.<id>` in **both** `messages/fr.json` and
`messages/en.json`. `npm test` checks that the two match.

---

## 📂 Project Layout

```
├── app/
│   ├── [locale]/               # Localized route pages (home, services, solutions, about, contact, privacy, terms)
│   │   ├── services/[slug]/    # Dynamic SSG service detail pages (11 services × 2 locales)
│   │   ├── layout.tsx          # Root localized layout (i18n provider, SEO metadata, JSON-LD, fonts)
│   │   ├── not-found.tsx       # Localized 404 page
│   │   └── error.tsx           # Localized error boundary
│   ├── api/leads/route.ts      # Hardened contact form & booking intake endpoint
│   ├── globals.css             # Tailwind v4 theme tokens, utility variants, and keyframe animations
│   ├── manifest.ts             # PWA Web App Manifest
│   ├── robots.ts               # Crawler rules and sitemap directive
│   └── sitemap.ts              # Dynamic multilingual XML sitemap generator
├── components/
│   ├── decor/                  # Canvas backgrounds (Wavemesh.tsx)
│   ├── layout/                 # Navbar, Footer, LeftRail, Container
│   ├── lightswind/             # KnowledgeConvergence flow diagram
│   ├── providers/              # ThemeProvider, SmoothScrollProvider, MotionProvider, Analytics
│   ├── sections/               # Page section components (home, services, solutions, about, contact)
│   └── ui/                     # UI primitives (LocaleToggle, ThemeToggle, StickyCTA, BrandMark)
├── config/
│   └── site.config.ts          # Central source of truth (contact, legal RCCM/IFU, hours, socials, brand)
├── content/
│   ├── services.ts             # Service catalogue metadata
│   ├── solutions.ts            # Solution catalogue (ids, tag/feature counts, page size)
│   └── references.ts           # Client references — PLACEHOLDER data, section disabled (see below)
├── deploy/                     # Production VPS deployment assets
│   ├── deploy.sh               # Automated one-command zero-downtime deployment script
│   ├── nginx/                  # Production Nginx reverse proxy configuration with TLS & rate limiting
│   └── systemd/                # Linux systemd service unit
├── messages/
│   ├── fr.json                 # French translations (Default locale)
│   └── en.json                 # English translations
├── lib/                        # SEO helpers, Schema.org generators, lead schema, utils
├── public/                     # Static assets (brand logos, service graphics, document PDFs)
├── tests/                      # Vitest unit & regression test suite
├── Dockerfile                  # Multi-stage production Docker container definition
├── docker-compose.yml          # Production container composition
├── ecosystem.config.js         # Production PM2 process configuration
├── DEPLOYMENT.md               # Detailed VPS production deployment manual
└── AUDIT-REPORT.md             # Enterprise credibility and quality audit report
```

---

## 🤝 Client references (section disabled)

The home page has a ready-made **"Ils nous font confiance" / "They trust us"** section
(`components/sections/home/ClientReferences.tsx`): a logo wall plus three testimonial
cards. It is **not rendered**: Digital Station is a young company and has no customers
it can name yet, and publishing invented references would undermine the credibility the
section is meant to build.

To let the layout be designed and reviewed, `content/references.ts` and the
`home.references` block in `messages/fr.json` / `messages/en.json` contain
**fictional Burkinabè sample organisations and quotes** (a clinic in Ouagadougou, a
wholesaler in Bobo-Dioulasso, a school in Koudougou, …). None of them are real clients.

### Enabling it once real clients sign

1. Replace every entry in `content/references.ts` with a real organisation that has
   agreed **in writing** to be named. Drop the optional `logo` under `public/references/`
   (SVG, or PNG ≥ 400 px wide); without one the card shows a monogram.
2. For each testimonial, replace `home.references.items.<id>` (`quote`, `author`, `role`)
   in **both** message files, and set `hasTestimonial: true` on that entry. Remove the
   sample ids that no longer exist. `npm test` enforces fr/en key parity.
3. In `app/[locale]/page.tsx`, uncomment the `ClientReferences` import and the
   `<ClientReferences />` line between `<ToolsWeMaster />` and `<CTASection />`.
4. Delete the "PLACEHOLDER DATA" box at the top of `content/references.ts` and this
   paragraph's warning, then run `npm run check`.

---

## 🛠️ Local Development & Testing

### Prerequisites
- **Node.js:** `v20.x` or `v22.x` LTS
- **Package Manager:** `npm` (v10+)

### Setup
```bash
# Clone the repository
git clone https://github.com/Digital-station/site-web-digital-station-.bf.git
cd site-web-digital-station-.bf

# Install dependencies
npm ci

# Setup local environment
cp .env.example .env.local

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Quality & Test Suite

Run the full CI verification pipeline locally:

```bash
npm run check
```

Or execute individual test suites:

```bash
npm run typecheck    # TypeScript compiler check without emitting files
npm run lint         # ESLint 9 validation
npm test             # Vitest test suite (lead validation, message parity, site config invariants)
```

---

## 🚀 Production Build & Deployment

### Building Standalone Output
```bash
npm run build
```

This command executes `next build` and runs the post-build sync script (`scripts/copy-standalone-assets.mjs`), which packages all static assets (`public/` and `.next/static/`) directly into `.next/standalone/`.

---

## 🌐 VPS Production Deployment Options

The site is self-hosted on a VPS. Vercel and Cloudflare are no longer used.

For complete step-by-step instructions, see **[`DEPLOYMENT.md`](DEPLOYMENT.md)**.

### Option 1: Docker Compose (Recommended)

```bash
# 1. Configure environment variables
cp .env.example .env
nano .env

# 2. Build and launch container in background
docker compose up -d --build

# 3. Verify status
docker compose ps
docker compose logs -f web
```

### Option 2: Native Node.js + PM2

```bash
# 1. Install dependencies & build
npm ci
npm run build

# 2. Start PM2 cluster
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Option 3: Automated One-Command VPS Deployment Script

```bash
# Deploy latest changes with zero downtime:
./deploy/deploy.sh docker   # for Docker environments
./deploy/deploy.sh pm2      # for PM2 environments
```

### Production Nginx Reverse Proxy & SSL Setup

```bash
# 1. Install Nginx configuration
sudo cp deploy/nginx/digitalstation.bf.conf /etc/nginx/sites-available/digitalstation.bf
sudo ln -sf /etc/nginx/sites-available/digitalstation.bf /etc/nginx/sites-enabled/

# 2. Issue free Let's Encrypt SSL certificate
sudo certbot --nginx -d digitalstation.bf -d www.digitalstation.bf

# 3. Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

---

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `SMTP_HOST` | **Yes** | — | SMTP server for contact & booking lead emails. Unset → `/api/leads` returns 503. |
| `SMTP_PORT` | No | `587` | `465` for implicit TLS, `587` for STARTTLS. |
| `SMTP_SECURE` | No | `true` on port 465, else `false` | Force implicit TLS on or off. |
| `SMTP_USER` | Usually | — | SMTP login (usually the sending mailbox). |
| `SMTP_PASS` | Usually | — | SMTP password. |
| `CONTACT_EMAIL` | No | `infos@digitalstation.bf` | Inbox where prospective client inquiries are delivered. |
| `LEADS_FROM` | No | `SMTP_USER` | Sender, e.g. `"Digital Station <contact@digitalstation.bf>"`. Must be a mailbox the SMTP server lets you send as. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | No | — | Shared rate-limit store (only useful with several processes, e.g. PM2 cluster). |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No | — | Optional analytics provider (`ga4`). |
| `NEXT_PUBLIC_ANALYTICS_SITE_ID` | No | — | Google Analytics measurement ID (`G-XXXXXXXXXX`). |
| `GOOGLE_SITE_VERIFICATION` | No | — | Search Console HTML verification token. |
| `PORT` | No | `3000` | Port for the standalone Node server to listen on. |
| `HOSTNAME` | No | `0.0.0.0` | Network binding interface. |

`next build` copies `.env` into `.next/standalone/`, so **rebuild after editing `.env`**
(`./deploy/deploy.sh` does). Docker (`env_file`) and systemd (`EnvironmentFile`) also
read `.env` at start-up, so a restart is enough there.

---

## 🔎 Google indexing (why "digitalstation" finds nothing)

The whole site declares **`https://digitalstation.bf`** (no `www`) as its address:
canonical tags, hreflang, `sitemap.xml`, `robots.txt` and JSON-LD all come from
`site.url` in `config/site.config.ts`. The host must serve that exact address and
redirect `www` to it, never the other way round.

The previous Vercel deployment did the opposite: `digitalstation.bf` → 308 →
`www.digitalstation.bf`, whose pages then named `digitalstation.bf` as canonical. Every
URL in the sitemap redirected, and every page it landed on pointed back to the
redirect, so Google had no indexable URL. The Nginx config in `deploy/nginx/` gets it
right (`www` → bare domain, 301).

After the VPS is live:

1. **DNS:** `A @ → VPS IP` and `CNAME www → digitalstation.bf.` (remove any Vercel records).
2. **Check:** `curl -I https://digitalstation.bf/fr` returns `200`, and
   `curl -I https://www.digitalstation.bf/fr` returns `301` to `https://digitalstation.bf/fr`.
3. **Search Console:** add a *Domain* property for `digitalstation.bf` (DNS TXT
   verification), submit `https://digitalstation.bf/sitemap.xml`, and use *URL
   inspection → Request indexing* on `/fr` and `/en`.
4. Give it a few days to a few weeks. A new domain shows up for its exact name
   ("Digital Station", "digitalstation.bf") first; ranking for the generic one-word
   query "digitalstation" against older sites with the same name takes longer and
   benefits from links back to the site (Google Business Profile, LinkedIn, Facebook,
   directories).

---

## 📊 Quality & Compliance Scorecard

Audited against [FrontendChecklist.io](https://frontendchecklist.io/) and Google Lighthouse standards:

| Category | Score / Standard | Verification |
| :--- | :---: | :--- |
| **Performance** | **99–100** | Full SSG prerendering, modern WebP/AVIF images, minimal TTFB, pause-offscreen canvas loops. |
| **Accessibility (a11y)** | **100** | WCAG 2.1 AA/AAA contrast, keyboard trap drawer, visible focus rings, ARIA labels. |
| **Best Practices** | **100** | Strict HTTPS/HSTS, modern ES modules, zero console warnings, secure headers. |
| **SEO Authority** | **100** | Schema.org JSON-LD graph, canonical/hreflang tags, geo-targeting, sitemap.xml. |

---

## 📄 Documentation

- **[`DEPLOYMENT.md`](DEPLOYMENT.md)** — Production VPS deployment guide (Ubuntu/Debian, Nginx, Docker, PM2, SSL).
- **[`docs/REFERENCEMENT-IA.md`](docs/REFERENCEMENT-IA.md)** — How the site is made findable by Google and AI assistants (ChatGPT, Gemini, Claude, Perplexity), and the off-site checklist (Google Business Profile, directories, Odoo partner listing).
- **[`AUDIT-REPORT.md`](AUDIT-REPORT.md)** — Comprehensive quality, credibility, and security audit report.
- **[`AUDIT-STRATEGY.md`](AUDIT-STRATEGY.md)** — Strategic marketing, positioning, and architectural roadmap.
- **[`FRONTEND-CHECKLIST.md`](FRONTEND-CHECKLIST.md)** — 385-point frontend checklist rule compliance status.

---

## 🏢 Corporate Identity & Legal

- **Entity:** DIGITAL STATION SARL
- **RCCM:** `BF-OUA-01-2018-B12-08492`
- **IFU:** `00108492X`
- **Capital:** `1 000 000 FCFA`
- **Headquarters:** Ouagadougou, Burkina Faso
- **Email:** `infos@digitalstation.bf`
- **Phone:** `+226 50 22 28 94` / **WhatsApp:** `+226 66 16 97 62`
