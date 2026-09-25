# Changelog

All notable changes to the **Digital Station** web platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-25

### Added
- **Core Architecture:**
  - Modern Next.js 16 (App Router) + React 19 + TypeScript architecture.
  - Complete SSG static pre-rendering across all 43 localized routes.
  - Bilingual routing via `next-intl` (French `/fr` default, English `/en`) with strict 1:1 message key parity and automated ICU placeholder validation tests.
  - Standalone Node.js bundle creation with automated post-build asset synchronization script (`scripts/copy-standalone-assets.mjs`).
- **Design System & Visual Engineering:**
  - Dark futuristic obsidian design system (`#0b0d11`, `#12161f`, `#181f2c`, `#38bdf8`) with Tailwind CSS v4 design tokens.
  - Fully reactive `Wavemesh` hero canvas with dynamic viewport container scaling and particle luminance adjustment across dark and light themes.
  - Dynamic `KnowledgeConvergence` node-and-stream SVG flow diagram with real-time bounding box coordinate calibration.
  - Themed `LocaleToggle` vault switch matching active theme surface variables.
  - Viewport-entry auto-scrolling trigger for the `IndustriesWeServe` showcase.
- **Structured Data & SEO Authority:**
  - Comprehensive Schema.org JSON-LD graph: `Organization`, `ProfessionalService` (with Ouagadougou coordinates, official RCCM and IFU identifiers), `WebSite` with SearchAction, `Service` (11 offerings), `ItemList` / `CreativeWork` (for Ticketia, Alimgesto, ImmoPilot, EduManager), `BreadcrumbList`, `ContactPage`, and `FAQPage`.
  - Regional & global SEO optimizations with localized `hreflang` headers and dynamic `sitemap.xml` generator.
- **Production VPS Deployment Suite:**
  - Multi-stage `Dockerfile` (`node:22-alpine`, non-root `nextjs` user, standalone bundle).
  - `docker-compose.yml` and `.dockerignore` for unified container lifecycle management.
  - Nginx reverse proxy configuration (`deploy/nginx/digitalstation.bf.conf`) with HTTP/2, TLS 1.3/1.2 intermediate ciphers, OCSP stapling, Gzip compression, and rate limiting zone for lead submissions.
  - PM2 cluster configuration (`ecosystem.config.js`) and native Linux `digitalstation.service` systemd unit.
  - One-command zero-downtime deployment script (`deploy/deploy.sh`).
  - Comprehensive VPS setup manual (`DEPLOYMENT.md`).
- **Pro Git Ecosystem:**
  - GitHub Actions CI pipeline (`.github/workflows/ci.yml`) testing typecheck, lint, unit tests, and security audit.
  - Docker build test workflow (`.github/workflows/docker-build.yml`).
  - Release automation workflow (`.github/workflows/release.yml`).
  - Pull Request template (`.github/pull_request_template.md`).
  - Issue templates for bug reports and feature requests.
  - Dependabot configuration (`.github/dependabot.yml`).

### Changed
- Streamlined `ProductPreviewModal` for in-house products: eliminated internal developer framework tags to focus on business features, KPIs, ROI metrics, and practical modules.
- Enhanced WCAG 2.1 AA/AAA contrast ratios across dark and light color tokens.

### Security
- Hardened lead intake endpoint (`POST /api/leads`):
  - 16 KB maximum payload ceiling.
  - Origin / Referer validation.
  - IP-based and global in-memory rate limiting.
  - Honeypot anti-spam defense.
  - Strict Zod input schema validation and HTML sanitization before dispatching via Resend.
- Production security headers: HSTS 2-year preload (`Strict-Transport-Security`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
