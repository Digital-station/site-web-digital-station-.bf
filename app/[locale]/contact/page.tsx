import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { ContactForm } from '@/components/sections/contact/ContactForm';
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
