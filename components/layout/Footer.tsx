import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { SERVICES } from "@/content/services";
import { BrandMark } from "@/components/ui/BrandMark";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsApp";
import {
  site,
  activeSocials,
  mailHref,
  telHref,
  waHref,
  addressLine,
  openingHoursLines,
  type Locale,
  type SocialKey,
} from "@/config/site.config";

/** Icon per social network. Keys match site.config.ts `socials`. */
const SOCIAL_ICONS: Record<SocialKey, LucideIcon> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
};

const SOCIAL_NAMES: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  twitter: "X",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

/** Column heading. Same look as before — it is now a real heading element. */
const HEADING =
  "text-[11px] uppercase tracking-[0.3em] text-brand-accent font-black mb-8";

/**
 * 44 px tall hit area without changing how the link looks: the padding grows
 * the box, the negative margin gives the space back to the layout.
 */
const FOOTER_LINK_BASE =
  "py-2 -my-2 text-sm text-brand-muted hover:text-brand-text transition-colors";
const FOOTER_LINK = `inline-block ${FOOTER_LINK_BASE}`;
/** Contact rows pair an icon with a label — inline-flex keeps them on one line. */
const FOOTER_CONTACT_LINK = `inline-flex items-center gap-3 ${FOOTER_LINK_BASE}`;

/**
 * Site footer. A server component — no interactivity, so it ships zero JS.
 *
 * Social icons come from `activeSocials()`, which filters out empty entries in
 * site.config.ts. Adding a URL there makes the icon appear; clearing it makes
 * the icon disappear.
 *
 * The address is plain text, not a Google Maps link: `site.contact.address
 * .street` is empty, so a map link would drop the visitor somewhere in
 * Ouagadougou rather than at the office.
 */
export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const ts = await getTranslations("contact.schedule");
  const tsv = await getTranslations("services.items");
  const locale = (await getLocale()) as Locale;
  /**
   * Derived from `schedule` in site.config.ts rather than from a hand-written
   * sentence, which used to say "Lundi – Vendredi" while the same file listed
   * Saturday 09:00–13:00.
   */
  const hours = openingHoursLines(locale);
  const socials = activeSocials();
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: tn("home") },
    { href: "/services", label: tn("services") },
    { href: "/solutions", label: tn("solutions") },
    { href: "/about", label: tn("about") },
    { href: "/contact", label: tn("contact") },
  ] as const;

  return (
    <footer className="lg:pl-16 border-t border-brand-border py-20 bg-brand-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
        {/* Four columns from xl, not lg: at 1024px the rail padding and gap-12
            leave the contacts column narrower than the email address. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-12 mb-16">
          <div className="sm:col-span-2 xl:col-span-4">
            <Link href="/" className="inline-flex group mb-6">
              <BrandMark
                variant="lockup"
                height={56}
                className="transition-transform group-hover:scale-[1.03]"
              />
            </Link>
            <p className="text-brand-muted text-sm max-w-sm mb-4">
              {t("intro")}
            </p>
            <p className="text-brand-text text-sm font-bold max-w-sm mb-8">
              {tc("promise")}
            </p>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socials.map(({ key, url }) => {
                  const Icon = SOCIAL_ICONS[key];
                  const name = SOCIAL_NAMES[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full border border-brand-border flex items-center justify-center text-brand-muted hover:border-brand-accent hover:text-brand-accent transition-all hover:scale-110"
                      aria-label={t("followUs", { network: name })}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <nav aria-label={t("navigationTitle")} className="xl:col-span-2">
            <h2 className={HEADING}>{t("navigationTitle")}</h2>
            <ul className="space-y-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={FOOTER_LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Every service page, from every page. Without these, the only
              server-rendered links to them were on /services itself. */}
          <nav aria-label={tn("servicesEyebrow")} className="xl:col-span-3">
            <h2 className={HEADING}>{tn("servicesEyebrow")}</h2>
            <ul className="space-y-4">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={FOOTER_LINK}>
                    {tsv(`${s.slug}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 xl:col-span-3">
            <h2 className={HEADING}>{t("contactsTitle")}</h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={mailHref()}
                  className={FOOTER_CONTACT_LINK}
                >
                  <Mail
                    className="w-4 h-4 shrink-0 text-brand-accent"
                    aria-hidden="true"
                  />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={telHref()}
                  className={FOOTER_CONTACT_LINK}
                >
                  <Phone
                    className="w-4 h-4 shrink-0 text-brand-accent"
                    aria-hidden="true"
                  />
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={waHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${FOOTER_CONTACT_LINK} whitespace-nowrap`}
                >
                  <WhatsAppIcon
                    size={16}
                    className="shrink-0 text-brand-accent"
                  />
                  <span>{tc("whatsappCta")}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-brand-muted">
                <MapPin
                  className="w-4 h-4 shrink-0 text-brand-accent"
                  aria-hidden="true"
                />
                {addressLine()}
              </li>
              <li className="flex items-start gap-3 text-sm text-brand-muted">
                <Clock
                  className="w-4 h-4 shrink-0 mt-0.5 text-brand-accent"
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-brand-faint">
                    {t("hoursTitle")}
                  </span>
                  {hours.map(({ id, hours: range }) => (
                    <span key={id} className="block">
                      {ts(`days.${id}`)}, {range}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[11px] text-brand-muted">
              © {year} / {site.contact.legal.entity}. {t("rights")}
            </p>
            <p className="text-[10px] text-brand-faint font-mono">
              RCCM : {site.contact.legal.rccm} • IFU : {site.contact.legal.ifu} • {t("headquarters")} : Ouagadougou (Burkina Faso)
            </p>
          </div>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="inline-block py-2 -my-2 text-[11px] uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="inline-block py-2 -my-2 text-[11px] uppercase tracking-widest text-brand-muted hover:text-brand-text transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
