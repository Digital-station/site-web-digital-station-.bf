/**
 * Client references shown by the (currently DISABLED) "Ils nous font
 * confiance" section on the home page — see README › Client references.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  PLACEHOLDER DATA — every organisation below is FICTIONAL.           │
 * │  They are illustrative Burkinabè examples so the section can be      │
 * │  designed and reviewed before the first real customers sign. Do NOT  │
 * │  enable the section with this list: replace each entry with a real   │
 * │  client who has agreed in writing to be named, then delete this box. │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Structure only — the quotes, author names and roles live in
 * messages/<locale>.json under `home.references.items.<id>` so the section
 * works in both languages. Sector labels come from
 * `home.references.sectors.<sector>`.
 */

export type ReferenceSector =
  | 'healthcare'
  | 'retail'
  | 'education'
  | 'realestate'
  | 'transport'
  | 'hospitality';

export type ClientReference = {
  /** Stable key, also the message key for the optional testimonial. */
  id: string;
  /** Organisation name as it should appear on the site. */
  name: string;
  /** City, shown next to the name — all current entries are in Burkina Faso. */
  city: string;
  sector: ReferenceSector;
  /**
   * Optional logo under /public (e.g. '/references/clinique-wendpanga.svg').
   * Without one, the card shows a monogram built from the first letters of
   * `name`. Ask the client for an SVG or a PNG at least 400px wide.
   */
  logo?: string;
  /**
   * Set when `home.references.items.<id>` exists in BOTH message files.
   * The testimonial grid only renders entries with this flag.
   */
  hasTestimonial?: boolean;
};

export const REFERENCES: readonly ClientReference[] = [
  {
    id: 'clinique-wendpanga',
    name: 'Clinique Wendpanga',
    city: 'Ouagadougou',
    sector: 'healthcare',
    hasTestimonial: true,
  },
  {
    id: 'faso-agro-distribution',
    name: 'Faso Agro Distribution',
    city: 'Bobo-Dioulasso',
    sector: 'retail',
    hasTestimonial: true,
  },
  {
    id: 'complexe-scolaire-nakanbe',
    name: 'Complexe scolaire Nakanbé',
    city: 'Koudougou',
    sector: 'education',
    hasTestimonial: true,
  },
  {
    id: 'immobiliere-tanghin',
    name: 'Immobilière Tanghin Services',
    city: 'Ouagadougou',
    sector: 'realestate',
  },
  {
    id: 'kaya-express',
    name: 'Kaya Express Transport',
    city: 'Kaya',
    sector: 'transport',
  },
  {
    id: 'hotel-les-manguiers',
    name: 'Hôtel Les Manguiers',
    city: 'Ziniaré',
    sector: 'hospitality',
  },
] as const;
