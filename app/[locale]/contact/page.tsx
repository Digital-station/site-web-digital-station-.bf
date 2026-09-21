import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { ContactInfo } from '@/components/sections/contact/ContactInfo';
import { MeetingScheduler } from '@/components/sections/contact/MeetingScheduler';
import { site } from '@/config/site.config';
import { pageMeta } from '@/lib/seo';
import { FAQ_KEYS } from '@/content/faq';
import { contactPageLd, breadcrumbLd, faqPageLd, ldJson } from '@/lib/schema';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });

  return pageMeta({
    locale,
    path: '/contact',
    title: t('title'),
    description: t('description'),
  });
}

/**
 * The form (react-hook-form + zod, ~340 KB) gets its own chunk. It still
 * renders on the server — the point is the JS payload, not the HTML — and
 * the placeholder matches the form shell's own dimensions so the swap does
 * not move the layout.
 *
 * This also keeps the home page fast: the hero links to /contact, so Next
 * prefetches this route on every home visit, and that prefetch used to
 * drag the whole form library along with it.
 */
const ContactForm = dynamic(
  () =>
    import('@/components/sections/contact/ContactForm').then(
      (m) => m.ContactForm,
    ),
  {
    loading: () => (
      <div
        aria-hidden="true"
        className="bg-brand-surface border border-brand-border p-8 md:p-12 rounded-[2rem] relative overflow-hidden min-h-[640px]"
      />
    ),
  },
);

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');
  const tn = await getTranslations('nav');

  const contact = contactPageLd({
    locale,
    name: t('meta.title'),
    description: t('meta.description'),
  });

  const breadcrumb = breadcrumbLd([
    { name: tn('home'), url: `${site.url}/${locale}` },
    { name: tn('contact'), url: `${site.url}/${locale}/contact` },
  ]);

  // Same keys, same messages as the FAQ the form renders.
  const faq = faqPageLd(
    FAQ_KEYS.map((key) => ({
      question: t(`faq.items.${key}.q`),
      answer: t(`faq.items.${key}.a`),
    })),
  );

  return (
    <div className="lg:pl-16 pt-36 md:pt-44 pb-20 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(contact) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(faq) }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 space-y-16 md:space-y-24">
        {/* Top: Standard Contact Channels & Lead Submission */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24">
          <ContactInfo locale={locale} />
          <ContactForm />
        </div>

        {/* Feature Enhancement: Direct Meeting Scheduler with Leadership */}
        <div>
          <MeetingScheduler />
        </div>
      </div>
    </div>
  );
}
