import { describe, expect, it } from 'vitest';

import { site, activeSocials, waHref } from '@/config/site.config';
import { SERVICES } from '@/content/services';

describe('site config', () => {
  it('has an https canonical origin without a trailing slash', () => {
    expect(site.url).toMatch(/^https:\/\/[^/]+$/);
  });

  it('only lists https social profiles', () => {
    for (const s of activeSocials()) expect(s.url).toMatch(/^https:\/\//);
  });

  it('builds a WhatsApp link from digits only', () => {
    expect(waHref()).toMatch(/^https:\/\/wa\.me\/\d+/);
  });
});

describe('service catalogue', () => {
  it('uses lowercase, hyphenated, unique slugs', () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});
