import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { waHref } from '@/config/site.config';
import { Container } from '@/components/layout/Container';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsApp';

/**
 * Closing call-to-action. A server component — no interactivity, so it
 * ships zero JS. The scroll reveal is `data-rv` (see RevealRoot).
 */
export async function CTASection() {
  const t = await getTranslations('home.cta');
  const tc = await getTranslations('common');

  return (
    <section
      id="cta"
      className="lg:pl-16 py-24 lg:py-32 text-center relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-accent/10 rounded-full blur-[120px]"
      />
      <Container data-rv className="relative z-10">
        {/* clamp() rather than a bare 8vw: the title stopped growing at 9rem
            on wide screens and never shrank below the md size on narrow ones,
            so it cannot overflow the Container at either end. */}
        <h2 className="text-5xl md:text-7xl lg:text-[clamp(4rem,8vw,9rem)] font-black italic uppercase leading-[1.15] tracking-tighter mb-10 md:mb-16 text-balance break-words">
          {t.rich('title', {
            br: () => <br />,
            accent: (chunks) => <span className="text-brand-accent">{chunks}</span>,
          })}
        </h2>
        <p className="text-brand-muted text-lg md:text-xl max-w-xl mx-auto mb-12 md:mb-16 font-light leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center">
          <Link
            href="/contact"
            className="btn-primary text-lg md:text-2xl px-10 py-5 md:px-16 md:py-7 inline-block tracking-tighter uppercase font-black"
          >
            {t('button')}
          </Link>

          <a
            href={waHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-3 text-base md:text-xl px-8 py-5 md:px-12 md:py-7 tracking-tighter uppercase font-black"
          >
            {/* green-500 passes on charcoal, not on cream — see the `light:`
                variant in globals.css. */}
            <WhatsAppIcon size={22} className="text-green-500 light:text-green-700" />
            {tc('whatsappCta')}
          </a>
        </div>
        {/* No promise line here: the hero already carries it and the footer
            directly below repeats it. */}
      </Container>
    </section>
  );
}
