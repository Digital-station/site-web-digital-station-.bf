import type { Metadata } from 'next';

import { site, absoluteUrl } from '@/config/site.config';
import { routing, type AppLocale } from '@/i18n/routing';

/**
 * One builder for every page's <head>.
 *
 * Before this existed, each page hand-rolled the same six blocks — canonical,
 * hreflang, openGraph, twitter — and they had already drifted: some pages
 * shipped no og:image at all, others no twitter card, and the locale codes
 * disagreed. Everything a page can get wrong is now computed here from two
 * inputs: the locale and the path.
 *
 * `title` is returned as a PLAIN STRING on purpose. app/[locale]/layout.tsx
 * defines `title.template = '%s | Digital Station'`, and Next.js applies a
 * template to CHILD segments only — every caller of this helper is a child of
 * [locale], so the suffix is appended for them. The home page shares the
 * [locale] segment with that layout and therefore has to opt out; it passes
 * `absoluteTitle: true` and gets the suffix baked in here instead.
 */

/**
 * The share card, one per language: the French card carries the French
 * tagline, so English shares got French text under the logo. Regenerate with
 * scratch-task-2/og.mjs (fr) and og-en.mjs (en).
 */
export const ogImage = (locale: string) =>
  ({
    url: absoluteUrl(
      locale === 'en' ? '/brand/og-1200x630-en.png' : '/brand/og-1200x630.png',
    ),
    width: 1200,
    height: 630,
    alt: site.name,
  }) as const;

/**
 * og:locale values, shared with app/[locale]/layout.tsx so the two can't drift
 * again (the layout said fr_BF/en_US while pages said fr_FR/en_GB). fr_FR
 * rather than fr_BF: Facebook only accepts locales from its own list, and
 * fr_BF is not on it.
 */
export const OG_LOCALE: Record<AppLocale, string> = {
  fr: 'fr_FR',
  en: 'en_GB',
};

const ogLocale = (locale: string) => OG_LOCALE[locale as AppLocale] ?? OG_LOCALE.fr;

/** The other languages' og:locale values, for og:locale:alternate. */
export const ogAlternateLocales = (locale: string) =>
  routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]);

export type PageMetaInput = {
  locale: string;
  /** Path WITHOUT the locale prefix: '' for home, '/about', '/services/x'. */
  path: string;
  title: string;
  description: string;
  /**
   * Set on the home page only, where the layout's title template does not
   * apply because the page shares the [locale] segment with the layout.
   */
  absoluteTitle?: boolean;
};

export function pageMeta({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = `${site.url}/${locale}${path}`;
  const fullTitle = `${title} | ${site.name}`;
  const image = ogImage(locale);

  /**
   * hreflang. Every locale gets an entry plus `x-default` pointing at French,
   * which is the language Digital Station actually operates in.
   */
  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, `/${l}${path}`]),
    ['x-default', `/${routing.defaultLocale}${path}`],
  ]) as Record<string, string>;

  return {
    title: absoluteTitle ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      // Every page, service pages included, is a standing page rather than a
      // dated article.
      type: 'website',
      images: [{ ...image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}
