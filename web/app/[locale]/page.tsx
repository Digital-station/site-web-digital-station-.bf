import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { HomeContent } from '@/components/sections/home/HomeContent';
import { pageMeta } from '@/lib/seo';
import { webSiteLd, ldJson } from '@/lib/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });

  return pageMeta({
    locale,
    path: '',
    title: t('title'),
    description: t('description'),
    /**
     * The `%s | Digital Station` template in app/[locale]/layout.tsx does NOT
     * apply here: Next.js applies a title template to CHILD route segments
     * only, and this page shares the [locale] segment with that layout.
     * Deeper pages (/about, /services/…) do inherit it.
     */
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home.meta');
  const description = t('description');

  return (
    <>
      {/* JSON-LD renders on the server, so crawlers see it in the initial
          HTML — one of the main SEO wins over the old client-only SPA.
          The Organization node comes from the locale layout; the WebSite
          node belongs on the home page only. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(webSiteLd(description)) }}
      />

      <HomeContent />
    </>
  );
}
