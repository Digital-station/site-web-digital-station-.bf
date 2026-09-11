import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Resolves the active locale for every server render and loads its messages.
 *
 * `requestLocale` comes from the [locale] segment in the URL. If it is missing
 * or unrecognised (a hand-typed /de/… for example), we fall back to French
 * rather than throwing, so a bad URL degrades gracefully instead of 500ing.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Ouagadougou is UTC+0 year-round. Pinning it keeps formatted dates
    // identical whatever zone the host machine happens to run in.
    timeZone: 'Africa/Ouagadougou',
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
