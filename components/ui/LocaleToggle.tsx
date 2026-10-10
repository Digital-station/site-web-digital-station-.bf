'use client';

import { Suspense, useEffect, useId, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname, type AppLocale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import styles from './LocaleToggle.module.css';

/**
 * FR / EN "vault toggle" — the Vite app's `Languageswitcher.tsx`, ported.
 *
 * Same object down to the noise filter and the circuit traces; see the module
 * stylesheet for what changed and why. The one structural difference is here:
 * the original was a bare `<input type="checkbox">` that toggled nothing, this
 * is a real link to the other locale. A language is a URL — it has to be
 * openable in a new tab, bookmarkable and crawlable — and next-intl's
 * `<Link locale>` keeps the current pathname across the switch. The query
 * string and hash are carried over too (a `?service=` prefill on /contact, a
 * `#section` anchor), which the bare pathname used to drop.
 *
 * The whole machine is `aria-hidden`: the FR/EN glyphs are decoration for the
 * eye, and screen readers get the link's own label, which starts with the
 * visible glyph of the current language ("FR – Passer en anglais") so the
 * accessible name contains the text a sighted user would read out loud
 * (WCAG 2.5.3), then says what pressing it does.
 *
 * `useSearchParams()` opts its subtree into client rendering, so Next requires
 * a Suspense boundary around it on a statically rendered route — and this
 * sits in the layout, on every static page. The boundary is here rather than
 * in the navbar so the two call sites (header and drawer) both get it. The
 * fallback is the same toggle without the query string: identical pixels, so
 * nothing flashes.
 */
export function LocaleToggle({ className }: { className?: string }) {
  return (
    <Suspense fallback={<LocaleToggleLink className={className} search="" />}>
      <LocaleToggleWithSearch className={className} />
    </Suspense>
  );
}

function LocaleToggleWithSearch({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const qs = searchParams.toString();
  return <LocaleToggleLink className={className} search={qs ? `?${qs}` : ''} />;
}

/** Reads the URL hash — which the router does not expose — after mount. */
function useHash(): string {
  const [hash, setHash] = useState('');
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  return hash;
}

function LocaleToggleLink({
  className,
  search,
}: {
  className?: string;
  /** `?a=b` or empty. */
  search: string;
}) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const hash = useHash();
  const t = useTranslations('common');

  /** Per-instance so the navbar and the mobile menu don't share an SVG id. */
  const filterId = useId().replace(/:/g, '');

  const isEnglish = locale === 'en';
  const other: AppLocale = isEnglish ? 'fr' : 'en';
  const label = `${locale.toUpperCase()} – ${
    other === 'fr' ? t('switchToFrench') : t('switchToEnglish')
  }`;

  return (
    <Link
      href={`${pathname}${search}${hash}`}
      locale={other}
      scroll={false}
      hrefLang={other}
      data-on={isEnglish ? 'true' : 'false'}
      aria-label={label}
      title={label}
      className={cn(styles.vault, className)}
    >
      <span className={styles.wrapper} aria-hidden="true">
        <svg className={styles.filter} width={0} height={0}>
          <defs>
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves={3}
                result="noise"
              />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.12 0"
                in="noise"
                result="coloredNoise"
              />
              <feComposite
                operator="in"
                in="coloredNoise"
                in2="SourceGraphic"
                result="composite"
              />
              <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>

        <span className={styles.track}>
          <span
            className={styles.texture}
            style={{ filter: `url(#${filterId})` }}
          />

          <svg className={styles.circuit} viewBox="0 0 140 60">
            <path
              d="M 35 30 L 60 30 L 75 18 L 115 18"
              className={cn(styles.path, styles.pathOff)}
            />
            <path
              d="M 25 42 L 65 42 L 80 30 L 105 30"
              className={cn(styles.path, styles.pathOn)}
            />
          </svg>

          <span className={cn(styles.status, styles.statusOff)}>
            <span style={{ '--i': 1 } as CSSProperties}>F</span>
            <span style={{ '--i': 2 } as CSSProperties}>R</span>
          </span>
          <span className={cn(styles.status, styles.statusOn)}>
            <span style={{ '--i': 1 } as CSSProperties}>E</span>
            <span style={{ '--i': 2 } as CSSProperties}>N</span>
          </span>
        </span>

        <span className={styles.thumb}>
          <span className={styles.thumbRing} />
          <span className={styles.thumbCore}>
            <svg
              className={styles.thumbIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={12} cy={12} r={5} />
              <path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12" />
            </svg>
          </span>
          <span className={styles.thumbGlare} />
        </span>
      </span>
    </Link>
  );
}
