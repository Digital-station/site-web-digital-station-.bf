import {
  site,
  absoluteUrl,
  activeSocials,
  openingHoursSpec,
} from '@/config/site.config';

/**
 * JSON-LD builders.
 *
 * Canonical schema.org graph providing structured data for search engines:
 * Organization / ProfessionalService, WebSite, Service, BreadcrumbList,
 * ContactPage, FAQPage, ItemList, and SoftwareApplication entities.
 */

/** The single identifier every other node points at. */
export const ORG_ID = `${site.url}/#organization`;

type Json = Record<string, unknown>;

/** `{ '@id': … }` — a reference to the canonical Organization node. */
const orgRef = () => ({ '@id': ORG_ID });

const postalAddress = (): Json => {
  const { street, locality, region, country } = site.contact.address;
  return {
    '@type': 'PostalAddress',
    ...(street ? { streetAddress: street } : {}),
    addressLocality: locality,
    ...(region ? { addressRegion: region } : {}),
    addressCountry: country,
  };
};

/**
 * The canonical company node, rendered on every page layout.
 * Declares both Organization and ProfessionalService with geo-coordinates,
 * tax registration, opening hours, and service domains for maximum local & global ranking authority.
 */
export const organizationLd = (description: string): Json => ({
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: site.name,
  legalName: site.contact.legal.entity,
  url: site.url,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl(site.brand.logoPng),
  },
  image: absoluteUrl(site.brand.logoPng),
  description,
  foundingDate: site.foundingDate,
  email: site.contact.email,
  telephone: site.contact.phone,
  taxID: site.contact.legal.ifu,
  vatID: site.contact.legal.ifu,
  address: postalAddress(),
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.3714,
    longitude: -1.5197,
  },
  priceRange: '$$',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.contact.email,
      telephone: site.contact.phone,
      availableLanguage: ['fr', 'en'],
      hoursAvailable: openingHoursSpec(),
    },
  ],
  areaServed: [
    {
      '@type': 'Country',
      name: site.contact.address.countryName,
    },
    {
      '@type': 'Place',
      name: 'West Africa',
    },
    {
      '@type': 'Place',
      name: 'Global',
    },
  ],
  knowsAbout: [
    'Digital Transformation',
    'Custom Software Development',
    'ERP Integration (Odoo, Oracle, Microsoft)',
    'Cybersecurity & ISO/IEC Compliance',
    'Cloud Architecture & Hosting',
    'Artificial Intelligence & Process Automation',
    'IT Managed Services & Support',
    'IT Equipment Procurement & Hardware',
  ],
  sameAs: activeSocials().map((s) => s.url),
});

/**
 * The WebSite node, emitted by both home pages (/fr and /en).
 */
export const webSiteLd = (description: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: site.name,
  url: site.url,
  inLanguage: ['fr', 'en'],
  description,
  publisher: orgRef(),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${site.url}/fr/services?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

/** One service offering. Provider is a reference to the Organization node. */
export const serviceLd = (args: {
  name: string;
  description: string;
  url: string;
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${args.url}#service`,
  name: args.name,
  description: args.description,
  serviceType: args.name,
  url: args.url,
  provider: orgRef(),
  areaServed: [
    {
      '@type': 'Country',
      name: site.contact.address.countryName,
    },
    {
      '@type': 'Place',
      name: 'West Africa',
    },
    {
      '@type': 'Place',
      name: 'Global',
    },
  ],
});

/** Breadcrumb trail. `items` is ordered from the site root downwards. */
export const breadcrumbLd = (
  items: readonly { name: string; url: string }[],
): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

/** ContactPage node. `mainEntity` references the Organization node. */
export const contactPageLd = (args: {
  locale: string;
  name: string;
  description: string;
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: args.name,
  description: args.description,
  url: `${site.url}/${args.locale}/contact`,
  inLanguage: args.locale,
  mainEntity: orgRef(),
});

/**
 * FAQPage for the questions shown on the contact page.
 */
export const faqPageLd = (
  items: readonly { question: string; answer: string }[],
): Json => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

/** ItemList node — the services catalogue and the solutions catalogue. */
export const itemListLd = (args: {
  name: string;
  description: string;
  items: readonly Json[];
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: args.name,
  description: args.description,
  itemListElement: args.items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    ...item,
  })),
});

/**
 * Serialise for `dangerouslySetInnerHTML`.
 * Escapes closing script tags to prevent XSS / markup breaking.
 */
export const ldJson = (node: Json): string =>
  JSON.stringify(node).replace(/</g, '\\u003c');
