import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { statSync } from 'node:fs';
import { join } from 'node:path';

import { routing } from '@/i18n/routing';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { RevealRoot } from '@/components/ui/RevealRoot';
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

/**
 * Real on-disk sizes of the downloadable documents, measured at render time.
 * TrustDocuments prints them verbatim, so the site can never advertise a
 * "1.2 Mo" deck when the file is smaller — the sizes are the files.
 */
function docSizes() {
  const read = (file: string) => {
    try {
      return statSync(join(process.cwd(), 'public', 'docs', file)).size;
    } catch {
      return 0;
    }
  };
  return {
    capabilities: read('digital-station-capabilities-deck.pdf'),
    nda: read('digital-station-mutual-nda.pdf'),
  };
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
      <MotionProvider>
        <RevealRoot>
          <AboutContent trustDocSizes={docSizes()} />
        </RevealRoot>
      </MotionProvider>
    </>
  );
}
