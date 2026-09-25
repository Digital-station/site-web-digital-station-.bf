/**
 * Typography for Digital Station.
 *
 * Configures font variables for Plus Jakarta Sans, Instrument Serif, and Space Grotesk.
 * Designed to provide full font definitions with robust fallbacks, compatible with
 * air-gapped builds, SSR, and production environments.
 */

export const displaySans = {
  variable: 'font-display-sans',
  className: 'font-display-sans',
};

export const editorialSerif = {
  variable: 'font-editorial-serif',
  className: 'font-editorial-serif',
};

export const technicalMono = {
  variable: 'font-technical-mono',
  className: 'font-technical-mono',
};

/** Convenience: every font variable, ready to drop on <html>. */
export const fontVariables = 'font-display-sans font-editorial-serif font-technical-mono';
