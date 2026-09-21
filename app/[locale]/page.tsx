import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/home/Hero';
import { HomeServices } from '@/components/sections/home/HomeServices';
import { AudienceSegmentation } from '@/components/sections/home/AudienceSegmentation';
import { ProjectEstimator } from '@/components/sections/home/ProjectEstimator';
import { CTASection } from '@/components/sections/home/CTASection';
import { RevealRoot } from '@/components/ui/RevealRoot';
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

/**
 * Below-the-fold interactive sections, each in its own chunk. They still
 * render on the server — the point is the JS payload, not the HTML.
 *
 * The `loading` placeholders reserve roughly the section's own height so the
 * page does not jump when the chunk lands.
 *
 * No `id` on the placeholders on purpose: the real section owns its id (the
 * placeholder used to carry it too, so every home page shipped two elements
 * with the same id — invalid HTML that broke `getElementById`-based anchors
 * such as the ScrollIndicator).
 */
const IndustriesWeServe = dynamic(
  () =>
    import('@/components/sections/IndustriesWeServe').then(
      (m) => m.IndustriesWeServe,
    ),
  { loading: () => <SectionPlaceholder /> },
);

const ToolsWeMaster = dynamic(
  () => import('@/components/sections/ToolsWeMaster').then((m) => m.ToolsWeMaster),
  { loading: () => <SectionPlaceholder /> },
);

const ArchitectureDiagrams = dynamic(
  () =>
    import('@/components/sections/home/ArchitectureDiagrams').then(
      (m) => m.ArchitectureDiagrams,
    ),
  { loading: () => <SectionPlaceholder /> },
);

function SectionPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="lg:pl-16 border-t border-brand-border py-24 lg:py-32 min-h-[600px]"
    />
  );
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

      {/* Server components render their HTML with zero JS; the client
          islands (Hero, estimator, dynamic sections) hydrate around them.
          RevealRoot owns the page-level scroll reveals for [data-rv]. */}
      <RevealRoot>
        <Hero />
        <AudienceSegmentation />
        <HomeServices />
        <ArchitectureDiagrams />
        <IndustriesWeServe />
        <ProjectEstimator />
        <ToolsWeMaster />
        <CTASection />
      </RevealRoot>
    </>
  );
}
