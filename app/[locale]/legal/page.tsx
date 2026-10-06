import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { LegalPage } from '@/components/sections/legal/LegalPage';
import { pageMeta } from '@/lib/seo';
import { site, addressLine } from '@/config/site.config';

type Props = { params: Promise<{ locale: string }> };

const SECTIONS = ['publisher', 'director', 'host', 'ip', 'liability'] as const;

/**
 * Hébergeur, for the mentions légales. Deploy target is Vercel today; if this
 * ever moves to the VPS path documented in DEPLOYMENT.md (Docker/PM2/Nginx),
 * update this block to that provider's own legal name and address instead.
 */
const HOST = {
  name: 'Vercel Inc.',
  address: '440 N Barranca Ave #4133, Covina, CA 91723, USA',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  // Indexed, unlike privacy/terms: the entity name, RCCM, IFU and address
  // here are a genuine LocalBusiness / E-E-A-T trust signal for Google.
  return pageMeta({
    locale,
    path: '/legal',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const values = {
    entity: site.contact.legal.entity,
    capital: site.contact.legal.capital,
    rccm: site.contact.legal.rccm,
    ifu: site.contact.legal.ifu,
    address: addressLine(),
    phone: site.contact.phone,
    email: site.contact.email,
    director: site.leadership.director.name,
    directorRole: site.leadership.director.role,
    host: HOST.name,
    hostAddress: HOST.address,
  };

  return <LegalPage namespace="legal" sectionKeys={SECTIONS} values={values} />;
}
