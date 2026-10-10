import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { SOLUTIONS } from '@/content/solutions';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { SolutionsContent } from '@/components/sections/solutions/SolutionsContent';
import { site } from '@/config/site.config';
import { pageMeta } from '@/lib/seo';
import { breadcrumbLd, itemListLd, ldJson, ORG_ID } from '@/lib/schema';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'solutions.meta' });

  return pageMeta({
    locale,
    path: '/solutions',
    title: t('title'),
    description: t('description'),
  });
}

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('solutions');
  const ti = await getTranslations('solutions.items');
  const tn = await getTranslations('nav');

  /**
   * The solutions, as CreativeWork items.
   *
   * Not SoftwareApplication: Google only accepts that type with a price and a
   * rating or review count, and there is neither to publish, so every item was
   * flagged as invalid. No per-item `url` either: the products have no pages of
   * their own, and `/solutions#id` fragments are the same URL to a crawler.
   */
  const list = itemListLd({
    name: t('meta.title'),
    description: t('meta.description'),
    items: SOLUTIONS.map((s) => ({
      item: {
        '@type': 'CreativeWork',
        name: ti(`${s.id}.name`),
        description: ti(`${s.id}.desc`),
        creator: { '@id': ORG_ID },
      },
    })),
  });

  const breadcrumb = breadcrumbLd([
    { name: tn('home'), url: `${site.url}/${locale}` },
    { name: tn('solutions'), url: `${site.url}/${locale}/solutions` },
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
      <MotionProvider>
        <SolutionsContent />
      </MotionProvider>
    </>
  );
}
