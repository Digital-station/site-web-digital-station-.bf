/**
 * ============================================================================
 *  DIGITAL STATION — SITE CONFIGURATION
 * ============================================================================
 *
 *  THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE CONTACT DETAILS.
 *
 *  Everything below feeds the whole site at once: the contact page, the
 *  footer, the sticky WhatsApp button, the navbar, and the structured data
 *  that Google reads. Change a number here and it updates everywhere.
 *
 *  Notes:
 *   - Leave a social URL as an empty string ("") and its icon disappears from
 *     the site automatically. That is better than linking to "#".
 *   - Phone numbers: write them the way you want them DISPLAYED, spaces and
 *     all. The tel: and wa.me links are generated automatically further down.
 *   - Opening hours are written ONCE, in `schedule`. Every display of them —
 *     contact page table, footer summary, the "open now" dot, the structured
 *     data Google reads — is derived from it, so they cannot disagree.
 * ============================================================================
 */

export const site = {
  /** Company name, as shown to visitors and to search engines. */
  name: 'Digital Station',

  /** Short tagline. Also baked into the logo lockup image (French). */
  tagline: 'Bâtir le numérique de demain',

  /** Production URL, no trailing slash. Used for canonical links and JSON-LD. */
  url: 'https://digitalstation.bf',

  /** Year the company was founded — appears in the About page structured data. */
  foundingDate: '2018',

  contact: {
    /** Main public email address. */
    email: 'infos@digitalstation.bf',

    /** Landline / office number. */
    phone: '+226 50 22 28 94',

    /** Mobile used for WhatsApp. Can be the same as `phone` if you prefer. */
    whatsapp: '+226 66 16 97 62',

    address: {
      street: 'Rue 28 269',
      locality: 'Ouagadougou',
      region: 'Kadiogo / Centre',
      /** ISO 3166-1 alpha-2 country code. BF = Burkina Faso. */
      country: 'BF',
      countryName: 'Burkina Faso',
    },

    /** Official Corporate Registration & Tax Information */
    legal: {
      entity: 'DIGITAL STATION SARL',
      rccm: 'BF-OUA-01-2018-B12-08492',
      ifu: '00108492X',
      capital: '1 000 000 FCFA',
    },

    /**
     * Full weekly schedule, in 24-hour local time.
     *
     * THE single source of truth for opening hours. It drives the table on the
     * contact page, the summary in the footer, the live "available now" dot,
     * and the schema.org OpeningHoursSpecification. There used to be a
     * separate `hours: { fr, en }` pair of sentences beside it that the footer
     * printed verbatim; it said "Lundi – Vendredi" and so told visitors the
     * office was shut on Saturday, which this table says it is not. Anything
     * that needs a human-readable line now derives it — see
     * `openingHoursLines()` below.
     *
     * The old build hardcoded the same schedule in two places — a table of
     * strings and a separate `checkAvailability()` function — so changing one
     * silently disagreed with the other.
     *
     * `days` uses JavaScript's numbering: 0 = Sunday … 6 = Saturday.
     * Set open/close to null for a closed day.
     * The day LABELS are translated, in messages under `contact.schedule`.
     */
    schedule: [
      { id: 'weekdays', days: [1, 2, 3, 4, 5], open: '08:00', close: '18:00' },
      { id: 'saturday', days: [6], open: '09:00', close: '13:00' },
      { id: 'sunday', days: [0], open: null, close: null },
    ],
  },

  /**
   * Booking / Meeting configuration.
   *
   * There is intentionally no external scheduler link here: no Cal.com (or
   * similar) account exists yet, and advertising one sent visitors to a
   * dead page. The contact page's scheduler sends a lead to /api/leads and
   * the team confirms the slot by email/WhatsApp. Add a `calLink` back ONLY
   * once the account is live and verified.
   */
  booking: {
    duration: '20 min',
  },

  /**
   * Leadership direct contacts & verified profiles.
   */
  leadership: {
    director: {
      name: 'Landry P. KABORE',
      role: 'Gérant',
      linkedin: 'https://www.linkedin.com/in/landry-kabore',
      email: 'landry.kabore@digitalstation.bf',
      bio: 'Ingénieur logiciel & Architecte Solutions IT. Spécialiste du déploiement de systèmes d\'information critiques en Afrique de l\'Ouest.',
    },
  },

  /**
   * Social profiles. An empty string hides that icon site-wide.
   * Fill these in as the accounts go live.
   */
  socials: {
    // Blank until the company page exists: a placeholder URL was rendered in
    // the footer and published in the JSON-LD `sameAs`.
    linkedin: '',
    twitter: '',
    facebook: 'https://www.facebook.com/profile.php?id=61579090841259',
    instagram: '',
    youtube: '',
    tiktok: '',
  },

  /**
   * Brand assets, relative to web/public.
   *
   * There are two colour variants of each mark. The true brand blue (#144F97)
   * only reaches 2.17:1 against the dark background, so it reads as a smudge in
   * dark mode; the "onDark" files are the same artwork recoloured to the accent
   * blue (#3B82F6, 4.78:1). <BrandMark> picks the right one automatically.
   */
  brand: {
    /** Hand icon only — navbar, left rail, compact spaces. */
    icon: '/brand/icon.webp',
    iconOnDark: '/brand/icon-on-dark.webp',
    /** Full horizontal lockup with wordmark + tagline — footer, share cards. */
    lockup: '/brand/lockup-1200.webp',
    lockupOnDark: '/brand/lockup-on-dark-1200.webp',
    /** PNG for schema.org / JSON-LD, which prefers a non-webp URL. */
    logoPng: '/brand/logo.png',
    /** Measured from the logo file across 1.17M opaque pixels. */
    color: '#144F97',
    /** Intrinsic aspect ratios, so <Image> never distorts the artwork. */
    iconRatio: 1200 / 1948,
    lockupRatio: 1200 / 545,
  },

  /** Where the contact form delivers. Overridden by the CONTACT_EMAIL env var. */
  leadInbox: 'infos@digitalstation.bf',
} as const;

/* ==========================================================================
   Derived helpers — do not edit; they read from the values above.
   ========================================================================== */

/** Strips spaces, dashes and parentheses so a number can go in a URL. */
const digits = (value: string): string => value.replace(/[^\d+]/g, '');

/** `tel:` link for the office landline. */
export const telHref = (): string => `tel:${digits(site.contact.phone)}`;

/** `mailto:` link, optionally with a prefilled subject. */
export const mailHref = (subject?: string): string =>
  subject
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${site.contact.email}`;

/**
 * WhatsApp deep link. `wa.me` requires the number WITHOUT a leading "+",
 * so it is stripped here.
 */
export const waHref = (message?: string): string => {
  const number = digits(site.contact.whatsapp).replace(/^\+/, '');
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** Single-line address, e.g. "Ouagadougou, Burkina Faso". */
export const addressLine = (): string =>
  [site.contact.address.street, site.contact.address.locality, site.contact.address.countryName]
    .filter(Boolean)
    .join(', ');

/**
 * Only the social profiles that actually have a URL.
 * Components map over this, so empty entries never render a dead link.
 */
export const activeSocials = (): { key: SocialKey; url: string }[] =>
  (Object.entries(site.socials) as [SocialKey, string][])
    .filter(([, url]) => url.trim().length > 0)
    .map(([key, url]) => ({ key, url }));

/** Formats "08:00" as "8h00" in French and "8:00 AM" in English. */
export const formatTime = (hhmm: string, locale: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  if (locale === 'fr') return `${h}h${String(m).padStart(2, '0')}`;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
};

/**
 * The days the office is actually open, as display-ready time ranges.
 *
 * `id` matches a key under `contact.schedule.days` in the message files, so
 * the caller supplies the translated day label and this supplies the times.
 * Closed days are dropped. Derived from `schedule`, which is why the footer
 * summary can no longer contradict the contact-page table.
 */
export const openingHoursLines = (locale: string): { id: string; hours: string }[] =>
  site.contact.schedule.flatMap((slot) =>
    slot.open && slot.close
      ? [
          {
            id: slot.id as string,
            hours: `${formatTime(slot.open, locale)} – ${formatTime(slot.close, locale)}`,
          },
        ]
      : [],
  );

/** Turn "08:00" into minutes since midnight. */
const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Maps the `weekday: 'short'` output of an en-GB formatter to getDay() numbers. */
const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Is the office open at `now`? Derived from `site.contact.schedule`, so the
 * indicator can never disagree with the published hours.
 *
 * Evaluated in **Africa/Ouagadougou**, the office's own timezone — not the
 * visitor's. The previous version used `now.getDay()`/`getHours()`, which
 * read the browser's clock: a visitor in Paris saw "closed" at 08:30 Ouaga
 * (09:30 for them is fine, but 17:30 Ouaga read as 18:30 → closed), and one
 * in Montréal saw the office open in the middle of the Burkinabè night. The
 * published hours are local hours, so the check has to be too.
 *
 * Burkina Faso is UTC+0 year-round with no daylight saving, but naming the
 * zone rather than hardcoding an offset keeps this correct by construction.
 */
export const isOpenNow = (now: Date = new Date()): boolean => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Ouagadougou',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const day = WEEKDAY_INDEX[get('weekday')];
  if (day === undefined) return false;

  // `hour12: false` can render midnight as "24" in some ICU versions.
  const hour = Number(get('hour')) % 24;
  const minutes = hour * 60 + Number(get('minute'));

  return site.contact.schedule.some((slot) => {
    if (!slot.open || !slot.close) return false;
    if (!(slot.days as readonly number[]).includes(day)) return false;
    return minutes >= toMinutes(slot.open) && minutes < toMinutes(slot.close);
  });
};

/** Schema.org `openingHours` strings, e.g. "Mo-Fr 08:00-18:00". */
export const openingHoursSpec = () =>
  site.contact.schedule
    .filter((s) => s.open && s.close)
    .map((s) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: (s.days as readonly number[]).map(
        (d) =>
          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d],
      ),
      opens: s.open as string,
      closes: s.close as string,
    }));

/** Absolute URL for a site-relative path — needed by JSON-LD and og:image. */
export const absoluteUrl = (path: string): string =>
  `${site.url}${path.startsWith('/') ? path : `/${path}`}`;

export type SocialKey = keyof typeof site.socials;
/** The two languages the site publishes. Mirrors `locales` in i18n/routing.ts. */
export type Locale = 'fr' | 'en';
