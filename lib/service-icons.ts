import {
  Box,
  Cloud,
  Code2,
  Cpu,
  GraduationCap,
  Headphones,
  KeyRound,
  Rocket,
  Share2,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icon per service slug — the single source of truth for both the home page
 * grid and the /services catalogue, which previously each carried their own
 * copy of this map.
 *
 * NOTE: the Vite app's equivalent map was keyed on a retired slug set
 * (`gbp-optimization`, `seo-strategy`, `ppc-advertising`…), none of which
 * exist in the catalogue any more — so every card fell through to the `Zap`
 * fallback and all ten showed the same icon. This map is keyed to the current
 * slugs in `content/services.ts`. Delete an entry to send that card back to
 * `Zap`.
 */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  'software-development': Code2,
  'social-media-management': Share2,
  'integration-solutions': Workflow,
  'licences-editeurs': KeyRound,
  'support-infogerance': Headphones,
  'formation-accompagnement': GraduationCap,
  'transformation-digitale': Rocket,
  'cybersecurite-conformite': ShieldCheck,
  'cloud-hebergement': Cloud,
  'intelligence-artificielle': Cpu,
  'negoce': Box,
};

export const getServiceIcon = (slug: string): LucideIcon =>
  SERVICE_ICONS[slug] ?? Zap;
