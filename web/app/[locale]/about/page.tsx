import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { AboutContent } from '@/components/sections/about/AboutContent';
import { site } from '@/config/site.config';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd, ldJson } from '@/lib/schema';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });

  return pageMeta({
    locale,
    path: '/about',
    title: t('title'),
    description: t('description'),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tn = await getTranslations('nav');

  /**
   * A breadcrumb only. The Organization node comes from the locale layout at
   * a stable @id; restating it here — as this page used to — told crawlers
   * there were two companies with the same name and address.
   */
  const breadcrumb = breadcrumbLd([
    { name: tn('home'), url: `${site.url}/${locale}` },
    { name: tn('about'), url: `${site.url}/${locale}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(breadcrumb) }}
      />
      <AboutContent />
    </>
  );
}
