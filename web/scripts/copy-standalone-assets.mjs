/**
 * Post-build step for `output: 'standalone'`.
 *
 * `next build` writes a self-contained server to `.next/standalone/server.js`,
 * but it deliberately does NOT copy two things into it:
 *
 *   public/       → favicons, brand images, robots assets
 *   .next/static/ → the hashed JS/CSS bundles the pages ask for
 *
 * Without them the server boots and serves unstyled HTML with broken images.
 * The Next.js docs tell you to copy them by hand; this script does it for you,
 * so `npm run build` alone produces a directory that can be uploaded as-is.
 *
 * Written in Node rather than `cp -r` on purpose: the site is developed on
 * Windows and deployed on the owner's Linux cPanel host, and this runs
 * identically on both.
 */

import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const standalone = join(root, '.next', 'standalone');

if (!existsSync(standalone)) {
  console.error(
    '[postbuild] .next/standalone is missing. Did `next build` run, and is ' +
      "output: 'standalone' still set in next.config.ts?",
  );
  process.exit(1);
}

/** Copy `from` over `to`, replacing whatever was there from a previous build. */
function sync(from, to, label) {
  if (!existsSync(from)) {
    console.warn(`[postbuild] skipped ${label}: ${from} does not exist`);
    return;
  }
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log(`[postbuild] copied ${label} → ${to}`);
}

sync(join(root, 'public'), join(standalone, 'public'), 'public/');
sync(
  join(root, '.next', 'static'),
  join(standalone, '.next', 'static'),
  '.next/static/',
);

console.log('[postbuild] .next/standalone is ready to run or upload.');
