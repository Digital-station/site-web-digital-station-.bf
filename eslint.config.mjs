import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * ESLint — Next.js core-web-vitals + TypeScript presets.
 *
 * `npm run lint` is part of the pre-commit routine alongside `npm run
 * typecheck`. The Next.js preset brings the React hooks rules, jsx-a11y
 * basics, and the Core Web Vitals rules (no <img> where next/image is
 * required, no sync scripts, font/link hygiene).
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'node_modules/**', 'out/**', 'build/**', 'scripts/**']),
]);
