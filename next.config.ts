import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/**
 * Security headers, applied to every response.
 *
 * There is deliberately NO Content-Security-Policy here yet. A useful CSP for
 * this app has to allow the inline theme script in the locale layout, which
 * means generating a per-request nonce in proxy.ts and threading it into that
 * <script> — a change inside app/[locale]/layout.tsx. Shipping a CSP without
 * the nonce would either break the theme script or need 'unsafe-inline',
 * which is a CSP in name only. Tracked as follow-up work.
 */
const SECURITY_HEADERS = [
  /**
   * Two years, subdomains included, and eligible for the preload list.
   * Only ever sent over HTTPS, so it is inert during local development.
   */
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  /** Stops a browser from re-interpreting a response as a type we did not send. */
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  /** Full URL to same-origin, origin only to third parties, nothing on downgrade. */
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  /** The site asks for none of these; deny them outright. */
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  /** No page here is meant to be framed — clickjacking has no surface. */
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  /**
   * The Vite app at the repo root has its own package-lock.json, so Turbopack
   * would otherwise guess the wrong workspace root. Pin it to this folder.
   */
  turbopack: {
    root: __dirname,
  },

  /**
   * Import only the icons actually used from the lucide-react barrel
   * (~30 modules import it; without this each of them pays to parse
   * every icon). `motion` is deliberately NOT listed: its barrel is
   * unshakable, so the flag is a no-op there — the fix was removing
   * Motion from the initial graph instead (see MotionProvider docs).
   */
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  /** Do not advertise the framework and its version to every scanner. */
  poweredByHeader: false,

  /**
   * Deployed on Vercel today; the `deploy/` scripts and this `standalone`
   * output also support a self-hosted single-process target (cPanel/Docker/
   * PM2 behind Nginx or Passenger) as a documented fallback — see
   * DEPLOYMENT.md. `standalone` emits .next/standalone/server.js with only
   * the files that server needs, so a self-hosted upload is a fraction of a
   * full node_modules tree; Vercel's own build pipeline uses this output
   * format internally regardless, so it costs nothing there.
   *
   * On the self-hosted path: remember to copy `public/` and `.next/static/`
   * into .next/standalone/ after building — the minimal server does not
   * bundle them (scripts/copy-standalone-assets.mjs does this as `postbuild`).
   *
   * The rate limiter in app/api/leads/route.ts is the other half of this:
   * it needs Upstash Redis on Vercel (serverless, multi-instance) but is
   * correct with no configuration at all on the self-hosted path.
   */
  output: 'standalone',

  images: {
    /**
     * No remotePatterns: every image is now self-hosted under public/, so
     * next/image never needs to be told about a third-party host.
     */
    formats: ['image/avif', 'image/webp'],
    // Optimized images are content-hashed upstream (same bytes, same URL),
    // so the optimizer cache can live far longer than the 60 s default.
    minimumCacheTTL: 86400,
  },

  async headers() {
    return [
      {
        // Brand, logo and content assets under public/. Not `immutable`:
        // unlike /_next/static (which Next already serves immutable),
        // these filenames carry no content hash, so a day-long max-age
        // with stale-while-revalidate is the safe ceiling.
        source:
          '/:prefix(brand|logo|process|team|placeholders|docs)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Every path, including static assets and the API route.
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ];
  },

  async redirects() {
    return [
      /**
       * The products page was called /case-studies while it has only ever
       * listed Digital Station's own software. Renamed to /solutions; these
       * keep every existing link and any indexed URL working.
       *
       * 308 (permanent) so search engines transfer the old URL's ranking to
       * the new one instead of indexing both.
       */
      {
        source: '/:locale(fr|en)/case-studies',
        destination: '/:locale/solutions',
        permanent: true,
      },
      {
        // Unprefixed legacy URL: send it to the default locale.
        source: '/case-studies',
        destination: '/fr/solutions',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
