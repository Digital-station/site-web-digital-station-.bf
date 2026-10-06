import { getTranslations } from 'next-intl/server';

/**
 * A scope card. `description` is optional on purpose: only the services that
 * define real `scopeItems` have one. See the fallback in `useServiceContent`.
 */
export type ScopeItem = { title: string; description?: string };
export type Platform = {
  name: string;
  insight: string;
  focus: string[];
  color: string;
};

export type ServiceContent = {
  title: string;
  desc: string;
  longDesc: string;
  benefits: string[];
  process: string[];
  featureTitle: string;
  featureDesc: string;

  // Extended page fields — every one has a fallback derived from the base
  // fields above, so a service only overrides what it wants to customise.
  scopeTitle: string;
  scopeIntro: string;
  scopeItems: ScopeItem[];
  heroBadgeLabel: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCtaLabel: string;
  whyUsTitle: string;
  whyUsIntro: string;
  whyUsItems: string[];
  featureCtaLabel: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
  platforms?: Platform[];

  /**
   * True only when the service authored its own `scopeItems` / `whyUsItems`.
   * Without them the fallbacks are the process steps and the benefits, which
   * the page already shows elsewhere — so the page skips the second copy
   * instead of printing the same list twice or three times.
   */
  hasOwnScopeItems: boolean;
  hasOwnWhyUsItems: boolean;
};

/**
 * Resolve a service's full page content for the active locale.
 *
 * This is the Next.js equivalent of the `config` object in the Vite
 * ServicePage: the catalogue is deliberately heterogeneous — only
 * `software-development` currently defines the extended hero/scope/whyUs/cta
 * fields — so every extended field falls back to something derived from the
 * base fields. Adding a field means adding a fallback here, not filling it in
 * on all ten services.
 *
 * The generic fallbacks live under the `servicePage.defaults` namespace so
 * they are translated once rather than repeated per service.
 *
 * `metric` / `metricLabel` are deliberately NOT resolved any more. They held
 * unsourced figures ("+40 % de conversions" and the like) that the service
 * page no longer displays. The keys still exist in the message files; nothing
 * reads them.
 *
 * Async, using `getTranslations` (next-intl/server) rather than the client
 * `useTranslations` hook: this lets the single consumer, ServiceDetail,
 * render as a Server Component instead of shipping its own translation
 * resolution to the client.
 */
export async function getServiceContent(slug: string): Promise<ServiceContent> {
  const t = await getTranslations(`services.items.${slug}`);
  const d = await getTranslations('servicePage.defaults');

  const has = (key: string) => t.has(key);
  const str = (key: string, fallback: string) => (has(key) ? t(key) : fallback);
  const arr = <T,>(key: string, fallback: T[]): T[] =>
    has(key) ? (t.raw(key) as T[]) : fallback;

  const title = t('title');
  const benefits = t.raw('benefits') as string[];
  const process = t.raw('process') as string[];
  const longDesc = t('longDesc');

  return {
    title,
    desc: t('desc'),
    longDesc,
    benefits,
    process,
    featureTitle: t('featureTitle'),
    featureDesc: t('featureDesc'),

    scopeTitle: str('scopeTitle', d('scopeTitle')),
    scopeIntro: str('scopeIntro', d('scopeIntro')),
    // Fallback: turn each process step into a scope card, TITLE ONLY.
    //
    // These used to carry a generic caption ("Une exécution rigoureuse à
    // chaque étape…"), which meant nine of the ten service pages printed the
    // same sentence four times in a row under four different headings. A
    // step name on its own says more than a sentence that says nothing.
    scopeItems: arr<ScopeItem>(
      'scopeItems',
      process.map((step) => ({ title: step })),
    ),

    heroBadgeLabel: str('heroBadgeLabel', d('heroBadgeLabel')),
    heroSubtitle: str('heroSubtitle', d('heroSubtitle')),
    heroDescription: str('heroDescription', longDesc),
    heroCtaLabel: str('heroCtaLabel', d('heroCtaLabel')),

    whyUsTitle: str('whyUsTitle', d('whyUsTitle')),
    whyUsIntro: str('whyUsIntro', d('whyUsIntro')),
    whyUsItems: arr<string>('whyUsItems', benefits),

    featureCtaLabel: str('featureCtaLabel', d('featureCtaLabel')),
    ctaTitle: str('ctaTitle', d('ctaTitle')),
    ctaSubtitle: str('ctaSubtitle', d('ctaSubtitle')),
    ctaButtonLabel: str('ctaButtonLabel', d('ctaButtonLabel')),

    platforms: has('platforms') ? (t.raw('platforms') as Platform[]) : undefined,

    hasOwnScopeItems: has('scopeItems'),
    hasOwnWhyUsItems: has('whyUsItems'),
  };
}
