# Digital Station — website

Marketing site for **Digital Station**, an IT services company based in
Ouagadougou, Burkina Faso.

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **next-intl 4** — every URL carries its language: `/fr/…` and `/en/…`.
  French is the default; a bare `/contact` redirects to `/fr/contact`.
- **Tailwind CSS v4** — design tokens only, no raw hex in components.
- **Resend** for the contact form (`POST /api/leads`).
- Built with `output: 'standalone'` and deployed to the company's **own cPanel
  server behind Passenger** — not Vercel, not a serverless platform.

Content lives in `messages/fr.json` and `messages/en.json`; contact details,
opening hours and social links live in `config/site.config.ts`.

---

## Local development

```bash
npm install
npm run dev
```

The dev server listens on <http://localhost:3000> (set `PORT` to change it).

Type-check before committing — this is the only checker configured:

```bash
npx tsc --noEmit
```

## Build

```bash
npm run build
```

`build` runs `next build`, then `postbuild` runs
`scripts/copy-standalone-assets.mjs`, which copies

- `public/` → `.next/standalone/public/`
- `.next/static/` → `.next/standalone/.next/static/`

Next.js does **not** put those inside the standalone output itself; without
them the server boots but serves unstyled pages with broken images. The script
is plain Node, so it behaves the same on Windows and on the Linux host.

## Running the production build

```bash
npm start          # → node .next/standalone/server.js
PORT=3005 npm start
```

`next start` is **not** the entrypoint for a standalone build — use
`.next/standalone/server.js`, which is what `npm start` now does.

## Deploying to cPanel / Passenger

1. `npm ci && npm run build` (locally or on the server).
2. Upload the whole `.next/standalone/` directory — it already contains the
   trimmed `node_modules`, `public/` and `.next/static/` it needs.
3. In cPanel → **Setup Node.js App**, point the *Application startup file* at
   `server.js` inside that directory and set the *Application root* to it.
4. Set the environment variables below in the same cPanel screen.
5. Passenger assigns the port through `PORT`; `server.js` reads it. Do not
   hardcode a port.

Restart the app from cPanel after every upload.

### Before launch: HTTPS must be live

`next.config.ts` sends `Strict-Transport-Security: max-age=63072000;
includeSubDomains; preload` on **every** response. Once a browser has seen that
header it will refuse to talk to `digitalstation.bf` — or any subdomain — over
plain HTTP for two years, and `preload` makes the domain eligible for the
browser-baked HSTS list, which is slow and awkward to get removed from.

So: install and verify the TLS certificate (cPanel → SSL/TLS, or AutoSSL) and
confirm `https://` works for the apex **and every subdomain** before the site
goes public. If HTTPS is not ready, remove that header from `next.config.ts`
first and add it back on launch day.

## Environment variables

Copy `.env.example` to `.env.local` for development; set the same keys in
cPanel for production. `NEXT_PUBLIC_*` values are inlined into the browser
bundle — never put a secret in one.

| Variable | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | **Yes** | Resend API key. Without it `/api/leads` returns 503 and the contact form shows an error rather than pretending to have sent. |
| `CONTACT_EMAIL` | Recommended | Inbox that receives the leads. Any address you can read. Defaults to `leadInbox` in `config/site.config.ts`. |
| `LEADS_FROM` | **Yes in production** | The `From:` address. **Must be on a domain verified in the Resend dashboard**, e.g. `"Digital Station <contact@digitalstation.bf>"`. Unset, it falls back to Resend's sandbox sender, which can only deliver to the address the Resend account was registered with — every other recipient is rejected and the lead is lost. This is the most common reason the form "works" but no mail arrives. |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | No | Only `ga4` is supported. Blank means no third-party request is made at all. |
| `NEXT_PUBLIC_ANALYTICS_SITE_ID` | With a provider | GA4 measurement ID (`G-XXXXXXX`). |
| `GOOGLE_SITE_VERIFICATION` | No | Search Console token for the HTML-tag method (the `content` value only). **Build time**: set it where `npm run build` runs. See below. |
| `PORT` | No | Port the server listens on. Passenger sets this for you. |

> GA4 loads with Google Consent Mode defaulting to *denied*, and nothing in
> this codebase grants consent. It will therefore collect almost nothing until
> a consent banner is built, and no such banner exists yet.

### Google Search Console

Two ways to prove ownership; either is enough.

1. **DNS (preferred).** In Search Console add a *Domain* property for
   `digitalstation.bf` and publish the `TXT` record it gives you at the DNS
   host. It covers `http`, `https` and every subdomain, and needs no code or
   rebuild.
2. **HTML tag.** Add a *URL-prefix* property for `https://digitalstation.bf/`,
   choose *HTML tag*, and copy only the `content="…"` value into
   `GOOGLE_SITE_VERIFICATION`. The pages are pre-rendered, so the variable
   must be present when `npm run build` runs; rebuild and redeploy, then click
   *Verify*.

Once verified, submit `https://digitalstation.bf/sitemap.xml`.

## Project layout

```
app/[locale]/      routes (home, services, services/[slug], solutions,
                   about, contact, privacy, terms)
app/api/leads/     contact-form endpoint
components/        layout chrome, page sections, UI primitives
config/            site.config.ts — contact details, hours, socials, brand
content/           service and solution catalogues
i18n/              next-intl routing and request config
messages/          fr.json / en.json — all user-facing text, key-for-key equal
lib/               SEO, schema.org, analytics, helpers
proxy.ts           locale redirect (Next 16's renamed middleware)
scripts/           postbuild standalone-asset copy
```

Two rules worth keeping: **all visible text goes through a next-intl key** (and
both message files must stay at exact key parity), and **colours come from the
Tailwind design tokens**, never a literal hex value.
