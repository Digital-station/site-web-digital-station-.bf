import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/**
 * Unit tests for the pure, framework-free parts of the site: the shared lead
 * schema, message-file parity, config invariants. Nothing here needs a DOM
 * or a Next.js runtime, so the default Node environment is used.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
