import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing, type AppLocale } from '@/i18n/routing';
import { site } from '@/config/site.config';
import { OG_LOCALE, ogAlternateLocales, ogImage } from '@/lib/seo';
import { organizationLd, ldJson } from '@/lib/schema';
import { fontVariables } from '@/lib/fonts';
import { ThemeProvider, ThemeScript } from '@/components/providers/ThemeProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { LeftRail } from '@/components/layout/LeftRail';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/providers/Analytics';
import { RouteAnnouncer } from '@/components/providers/RouteAnnouncer';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { StickyCTA } from '@/components/ui/StickyCTA';
import { CookieConsent } from '@/components/ui/CookieConsent';

import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/** Pre-render both languages at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t('defaultTitle'),
      template: `%s | ${site.name}`,
    },
    description: t('defaultDescription'),
    applicationName: site.name,
    icons: {
      icon: '/brand/icon-square-512.png',
      apple: '/brand/apple-touch-icon.png',
    },
    /**
     * Google Search Console, HTML-tag method. Set GOOGLE_SITE_VERIFICATION to
     * the token only (the `content` value Google shows), at BUILD time: the
     * pages are static. Unset, no tag is rendered. DNS verification needs
     * none of this; see README.
     */
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    /**
     * Deliberately NO `alternates` (canonical/hreflang) and no og:url here.
     * Every real page sets its own through pageMeta() in lib/seo.ts; the only
     * pages that ever fell back to these were 404s, which then declared
     * themselves canonical copies of the home page.
     */
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: OG_LOCALE[locale as AppLocale] ?? OG_LOCALE.fr,
      alternateLocale: ogAlternateLocales(locale),
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      images: [{ ...ogImage(locale) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      images: [ogImage(locale).url],
    },
    other: {
      'geo.region': 'BF-03',
      'geo.placename': 'Ouagadougou',
      'geo.position': '12.3714;-1.5197',
      'ICBM': '12.3714, -1.5197',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // A hand-typed /de/… should 404, not silently render French.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering — without it every page opts into dynamic.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'common' });
  const tm = await getTranslations({ locale, namespace: 'meta' });

  return (
    /**
     * suppressHydrationWarning is required on <html> because the inline theme
     * script writes data-theme before React hydrates, so the server markup and
     * the live DOM legitimately differ on that one attribute.
     */
    /**
     * `data-theme="dark"` is stamped server-side so the attribute always
     * exists, even before the inline script runs. The script rewrites it to
     * "light" before first paint when that is the stored choice.
     */
    <html
      lang={locale}
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        {/* Renders nothing unless NEXT_PUBLIC_ANALYTICS_PROVIDER is set. */}
        <Analytics />
      </head>
      {/*
        suppressHydrationWarning here too: browser extensions (Grammarly,
        Google Translate, etc.) inject attributes like data-gr-ext-installed
        onto <body> before React hydrates, which is a false-positive mismatch
        unrelated to anything this app renders.
      */}
      <body suppressHydrationWarning>
        {/* Front-End Checklist › HTML › noscript fallback. The pages are
            server-rendered and readable without JS; this only explains what
            will not work (form, theme toggle) and where to go instead. */}
        <noscript>
          <p role="status" className="bg-brand-accent-strong px-4 py-3 text-center text-sm text-white">
            {t('noscript')}
          </p>
        </noscript>
        {/* The one Organization node, on every page; everything else
            references it by @id. See lib/schema.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ldJson(organizationLd(tm('defaultDescription'))) }}
        />
        <ThemeProvider>
          <NextIntlClientProvider>
            <RouteAnnouncer />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-20 focus:z-[100] focus:bg-brand-accent-strong focus:text-brand-on-accent focus:px-6 focus:py-3 focus:rounded-full focus:font-black focus:uppercase focus:text-xs"
            >
              {t('skipToContent')}
            </a>

            {/* Second tab stop, deliberately: it is fixed-positioned so DOM
                order has no layout effect, but it IS tab order, and a consent
                prompt should not be buried behind the whole page. */}
            <CookieConsent />

            <SmoothScrollProvider>
              <StickyCTA />

              <div className="min-h-screen relative bg-brand-primary">
                <LeftRail />
                {/* The one <header> landmark. Navbar renders a <nav> (a
                    sub-landmark), not the banner itself; a bare wrapper is
                    enough since the navbar is position: fixed and the
                    header has no box of its own. The skip link above stays
                    outside it on purpose — it must be the first tab stop. */}
                <header>
                  <Navbar />
                </header>
                <ScrollIndicator />
                {/* tabIndex={-1} makes the skip link's focus land reliably:
                    without it some browsers move the scroll position but
                    leave focus where it was, so the next Tab resumed inside
                    the navbar instead of the page content. */}
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </div>
            </SmoothScrollProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
