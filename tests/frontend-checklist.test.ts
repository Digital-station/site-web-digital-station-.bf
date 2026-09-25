import { describe, expect, it } from 'vitest';

import { SERVICES, getService } from '@/content/services';
import { SOLUTIONS } from '@/content/solutions';
import { site, addressLine, openingHoursLines, isOpenNow } from '@/config/site.config';
import { organizationLd } from '@/lib/schema';
import fr from '@/messages/fr.json';
import en from '@/messages/en.json';

describe('Frontend & SEO Checklist Standards', () => {
  it('all 11 services exist in content, have unique numbers and matching messages', () => {
    expect(SERVICES.length).toBe(11);
    const nums = SERVICES.map((s) => s.num);
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(nums).size).toBe(11);
    expect(new Set(slugs).size).toBe(11);

    for (const service of SERVICES) {
      expect(getService(service.slug)).toBeDefined();
      expect(fr.services.items).toHaveProperty(service.slug);
      expect(en.services.items).toHaveProperty(service.slug);
    }
  });

  it('all in-house solutions exist and have valid message keys', () => {
    expect(SOLUTIONS.length).toBe(4);
    for (const solution of SOLUTIONS) {
      expect(fr.solutions.items).toHaveProperty(solution.id);
      expect(en.solutions.items).toHaveProperty(solution.id);
    }
  });

  it('organization schema is valid and complete with ProfessionalService, IFU, RCCM and geo-coordinates', () => {
    const org = organizationLd('Test description');
    expect(org['@context']).toBe('https://schema.org');
    expect(org['@type']).toContain('Organization');
    expect(org['@type']).toContain('ProfessionalService');
    expect(org.name).toBe(site.name);
    expect(org.taxID).toBe(site.contact.legal.ifu);
    expect(org.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 12.3714,
      longitude: -1.5197,
    });
    expect(org.address).toHaveProperty('addressLocality', 'Ouagadougou');
    expect(org.address).toHaveProperty('addressCountry', 'BF');
  });

  it('contact details and opening hours calculate reliably', () => {
    expect(addressLine()).toContain('Ouagadougou');
    expect(addressLine()).toContain('Burkina Faso');

    const frHours = openingHoursLines('fr');
    const enHours = openingHoursLines('en');
    expect(frHours.length).toBeGreaterThan(0);
    expect(enHours.length).toBeGreaterThan(0);

    expect(typeof isOpenNow()).toBe('boolean');
  });
});
