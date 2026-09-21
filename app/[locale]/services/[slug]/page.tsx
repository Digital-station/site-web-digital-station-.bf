import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { SERVICES, getService } from '@/content/services';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { ServiceDetail } from '@/components/sections/service/ServiceDetail';
import { site } from '@/config/site.config';
import { pageMeta } from '@/lib/seo';
import { serviceLd, breadcrumbLd, ldJson } from '@/lib/schema';

type Props = { params: Promise<{ locale: string; slug: string }> };

/**
 * Only the slugs below exist. Any other slug is a 404 straight from the
 * router, never rendered on demand and never cached as a page.
 */
export const dynamicParams = false;

/**
 * Pre-render all 20 pages at build time (10 services × 2 locales).
 * Slugs are identical in both locales, so /fr/services/<slug> and
 * /en/services/<slug> resolve to the same service in different languages.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getService(slug)) return {};

  const t = await getTranslations({ locale, namespace: `services.items.${slug}` });

  return pageMeta({
    locale,
    path: `/services/${slug}`,
    title: t('title'),
    description: t('desc'),
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = getService(slug);
  // An unknown slug 404s. The Vite page silently redirected to "/", which hid
  // broken links from both visitors and crawlers.
  if (!service) notFound();

  const t = await getTranslations(`services.items.${slug}`);
  const tn = await getTranslations('nav');

  const detail = serviceLd({
    name: t('title'),
    description: t('desc'),
    url: `${site.url}/${locale}/services/${slug}`,
  });

  const breadcrumb = breadcrumbLd([
    { name: tn('home'), url: `${site.url}/${locale}` },
    { name: tn('services'), url: `${site.url}/${locale}/services` },
    { name: t('title'), url: `${site.url}/${locale}/services/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(detail) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(breadcrumb) }}
      />
      <MotionProvider>
        <ServiceDetail service={service} />
      </MotionProvider>
    </>
  );
}
