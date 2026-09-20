import { Instrument_Serif, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';

/**
 * Typography for Digital Station.
 *
 * okta-DESIGN.md specifies Aeonik (display + body) and Season Mix (headings).
 * Both are commercial typefaces and cannot ship without a purchased licence,
 * so free stand-ins are used:
 *
 *   Aeonik      → Plus Jakarta Sans   (geometric grotesque, very close metrics)
 *   Season Mix  → Instrument Serif    (editorial serif, high-contrast)
 *
 * TO SWAP IN THE REAL SATOSHI/AEONIK LATER:
 *   1. drop the .woff2 files into web/public/fonts/
 *   2. replace `displaySans` below with next/font/local:
 *
 *      import localFont from 'next/font/local'
 *      export const displaySans = localFont({
 *        src: [
 *          { path: '../public/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
 *          { path: '../public/fonts/Satoshi-Medium.woff2',  weight: '500', style: 'normal' },
 *          { path: '../public/fonts/Satoshi-Bold.woff2',    weight: '700', style: 'normal' },
 *          { path: '../public/fonts/Satoshi-Black.woff2',   weight: '900', style: 'normal' },
 *        ],
 *        variable: '--font-display-sans',
 *        display: 'swap',
 *      })
 *
 * Nothing else needs to change — globals.css binds to the CSS variables, not
 * to the font names.
 */

export const displaySans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  // 300 draws font-light; 500 is the okta body weight; 700/800 cover the
  // site's bold headings. Google serves one variable file for all of these,
  // so the list costs no bytes. font-black is pinned to 800 in globals.css.
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-display-sans',
  display: 'swap',
});

export const editorialSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-editorial-serif',
  display: 'swap',
});

export const technicalMono = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-technical-mono',
  display: 'swap',
});

/** Convenience: every font variable, ready to drop on <html>. */
export const fontVariables = [
  displaySans.variable,
  editorialSerif.variable,
  technicalMono.variable,
].join(' ');
