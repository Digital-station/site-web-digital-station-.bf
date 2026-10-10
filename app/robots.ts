import type { MetadataRoute } from 'next';

import { site } from '@/config/site.config';

/**
 * robots.txt
 *
 * `/api/` is disallowed because the only route there is the lead intake
 * endpoint — it accepts POST and has nothing for a crawler to index.
 *
 * Privacy and Terms are not listed here: they already send
 * `X-Robots-Tag`/meta `noindex` from their own metadata, which is the
 * stronger and more reliable signal. Disallowing them in robots.txt as well
 * would actually be counterproductive — a blocked page can still be indexed
 * from external links, and blocking it stops crawlers from ever seeing the
 * noindex directive that would have kept it out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // AI search and assistant crawlers, named explicitly so the site is
      // eligible to be cited when someone asks ChatGPT, Claude, Gemini or
      // Perplexity for an IT agency in Burkina Faso. `*` already allows
      // them; listing them documents the choice and survives a future
      // tightening of the wildcard rule. See also public/llms.txt.
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
          'Perplexity-User',
          'Bingbot',
          'Applebot',
          'Applebot-Extended',
          'Amazonbot',
          'Meta-ExternalAgent',
          'CCBot',
          'DuckAssistBot',
          'YouBot',
        ],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    // No `host:` line. It was a Yandex-only directive that Google ignores,
    // and Yandex itself dropped it in favour of redirects.
    sitemap: `${site.url}/sitemap.xml`,
  };
}
