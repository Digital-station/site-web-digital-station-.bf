import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/sections/legal/LegalPage';
import { CookieSettingsButton } from '@/components/ui/CookieSettingsButton';
import { pageMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const SECTIONS = ['what', 'necessary', 'analytics', 'duration', 'manage'] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cookies' });

  return {
    ...pageMeta({
      locale,
      path: '/cookies',
      title: t('metaTitle'),
      description: t('metaDescription'),
    }),
    // Policy annex, like privacy/terms: stays out of the index, same reasoning
    // documented in app/robots.ts.
    robots: { index: false, follow: true },
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage
      namespace="cookies"
      sectionKeys={SECTIONS}
      footerSlot={
        <section>
          <CookieSettingsButton />
        </section>
      }
    />
  );
}
