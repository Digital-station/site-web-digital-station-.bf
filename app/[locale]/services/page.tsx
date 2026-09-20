import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { SERVICES } from '@/content/services';
import { ServicesContent } from '@/components/sections/services/ServicesContent';
import { site } from '@/config/site.config';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd, itemListLd, ldJson } from '@/lib/schema';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicesPage.meta' });

  return pageMeta({
    locale,
    path: '/services',
    title: t('title'),
    description: t('description'),
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('servicesPage.meta');
  const ts = await getTranslations('services.items');
  const tn = await getTranslations('nav');

  /**
   * ItemList for the service catalogue. Built as an object and serialised,
   * never string-concatenated — an apostrophe in a title would otherwise
   * produce invalid JSON-LD.
   */
  const list = itemListLd({
    name: t('title'),
    description: t('description'),
    items: SERVICES.map((s) => ({
      name: ts(`${s.slug}.title`),
      description: ts(`${s.slug}.desc`),
      url: `${site.url}/${locale}/services/${s.slug}`,
    })),
  });

  const breadcrumb = breadcrumbLd([
    { name: tn('home'), url: `${site.url}/${locale}` },
    { name: tn('services'), url: `${site.url}/${locale}/services` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(list) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(breadcrumb) }}
      />
      <ServicesContent />
    </>
  );
}
