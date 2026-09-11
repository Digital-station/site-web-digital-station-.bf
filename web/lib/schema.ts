import {
  site,
  absoluteUrl,
  activeSocials,
  openingHoursSpec,
} from '@/config/site.config';

/**
 * JSON-LD builders.
 *
 * The pages used to each declare their own Organization node. Three of them
 * did, with different fields, and search engines had no way to know they were
 * the same company — so the entity signal was split three ways.
 *
 * The fix is the standard one: ONE canonical Organization node at a stable
 * `@id`, and every other node referencing it by that `@id` instead of
 * restating it.
 *
 * The node is emitted by app/[locale]/layout.tsx, so it is on EVERY page. It
 * used to be on the home page only, but a crawler reads each page on its own:
 * a service page's `provider: { '@id': … }` pointed at a node that page did
 * not contain.
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
    // An empty streetAddress is worse than none — omit it rather than ship "".
    ...(street ? { streetAddress: street } : {}),
    addressLocality: locality,
    ...(region ? { addressRegion: region } : {}),
    addressCountry: country,
  };
};

/**
 * The canonical company node, on every page (see above).
 *
 * Plain Organization, not ProfessionalService. ProfessionalService is a
 * LocalBusiness, and Google expects a LocalBusiness to have a street address a
 * visitor can go to; there is none to publish yet (`address.street` is empty).
 * Once there is one, add 'ProfessionalService' back to `@type` and move the
 * opening hours from the contact point onto the node itself.
 */
export const organizationLd = (description: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: site.name,
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
  address: postalAddress(),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.contact.email,
      telephone: site.contact.phone,
      availableLanguage: ['fr', 'en'],
      // On the contact point, where schema.org defines it for an Organization.
      hoursAvailable: openingHoursSpec(),
    },
  ],
  areaServed: {
    '@type': 'Country',
    name: site.contact.address.countryName,
  },
  sameAs: activeSocials().map((s) => s.url),
});

/**
 * The WebSite node, emitted by both home pages (/fr and /en).
 *
 * One `@id` for both. It used to be `/fr#website` and `/en#website`, which
 * declared two separate websites. The site is one website in two languages.
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
  areaServed: {
    '@type': 'Country',
    name: site.contact.address.countryName,
  },
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
 * FAQPage for the questions shown on the contact page. Built from the same
 * messages the page renders, so the markup can't claim an answer the visitor
 * doesn't see. Google now shows FAQ rich results only for government and
 * health sites, so this is for understanding the page, not for a snippet.
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
 *
 * `</script>` inside a string value would close the tag early and drop the
 * rest of the document into the page as markup, so the forward slash is
 * escaped — the standard, and the only, safe way to inline JSON in HTML.
 */
export const ldJson = (node: Json): string =>
  JSON.stringify(node).replace(/</g, '\\u003c');
