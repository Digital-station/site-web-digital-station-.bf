import localFont from 'next/font/local';

/**
 * Typography for Digital Station — self-hosted.
 *
 * okta-DESIGN.md specifies Aeonik (display + body) and Season Mix (headings).
 * Both are commercial typefaces, so free stand-ins are used:
 *   Aeonik     → Plus Jakarta Sans  (geometric grotesque, close metrics)
 *   Season Mix → Instrument Serif   (editorial serif, high contrast)
 *
 * next/font/LOCAL rather than next/font/google: the build must work with no
 * network, and the runtime must make zero third-party requests. The .woff2
 * files are committed under assets/fonts/ — see the README there for
 * provenance and the OFL licence texts that must ship alongside them.
 *
 * `variable` MUST be a CSS CUSTOM PROPERTY name ('--font-…'), not a class
 * name. next/font generates a class that DECLARES that property; app/
 * globals.css then reads it inside `@theme inline`. A previous revision
 * passed bare class names here, so --font-display-sans was never declared
 * and every font-* utility silently fell through to the system font stack.
 */

/** Body + headings. One variable file (wght 200-800, ~27KB) covers every
 *  weight globals.css uses (300/400/500/600/700/800) instead of six static
 *  cuts. font-black is pinned to 800 in globals.css. */
export const displaySans = localFont({
  src: '../assets/fonts/PlusJakartaSans-Variable.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-display-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

/** Selective editorial accents (.type-heading, font-serif). Instrument Serif
 *  has no variable axis upstream, so regular + italic ship as two static
 *  files. preload:false — it sits below the fold on most routes. */
export const editorialSerif = localFont({
  src: [
    { path: '../assets/fonts/InstrumentSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/InstrumentSerif-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-editorial-serif',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
});

/** Eyebrows, counters, the footer's RCCM/IFU line — above the fold on every
 *  page, so this one is preloaded. One variable file, wght 300-700. */
export const technicalMono = localFont({
  src: '../assets/fonts/SpaceGrotesk-Variable.woff2',
  weight: '300 700',
  style: 'normal',
  variable: '--font-technical-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'monospace'],
});

/** Convenience: every font variable class, ready to drop on <html>. */
export const fontVariables = [
  displaySans.variable,
  editorialSerif.variable,
  technicalMono.variable,
].join(' ');
