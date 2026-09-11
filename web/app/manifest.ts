import type { MetadataRoute } from 'next';

import { site } from '@/config/site.config';

/**
 * /manifest.webmanifest — what a phone shows when the site is added to the
 * home screen. Next.js links it from every page's <head> automatically.
 *
 * One manifest for both languages (it lives at the app root, outside
 * [locale]), so it opens on /fr, the default locale.
 *
 * Colours are the dark theme's `--ds-bg` from app/globals.css: dark is the
 * theme a first visit gets. Keep them in step if that token changes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.tagline,
    lang: 'fr',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    background_color: '#191919',
    theme_color: '#191919',
    icons: [
      { src: '/brand/icon-square-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
