import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/sections/legal/LegalPage';
import { pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const SECTIONS = ['engagement', 'services', 'intellectual', 'obligations', 'liability', 'law'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });

  return {
    ...pageMeta({
      locale,
      path: '/terms',
      title: t('metaTitle'),
      description: t('metaDescription'),
    }),
    // Legal pages stay out of the index, but links from them still count.
    robots: { index: false, follow: true },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage namespace="terms" sectionKeys={SECTIONS} />;
}
