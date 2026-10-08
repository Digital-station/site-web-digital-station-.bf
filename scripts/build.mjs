/**
 * `npm run build` dispatcher.
 *
 * Cloudflare Workers Builds runs the dashboard's build command (`npm run
 * build`) and then `npx wrangler deploy`. With wrangler.jsonc committed,
 * Wrangler hands the deploy to `opennextjs-cloudflare deploy`, which needs the
 * Worker bundle in .open-next/ — and only `opennextjs-cloudflare build`
 * produces it. So on Cloudflare this runs the OpenNext build; everywhere else
 * (Docker, PM2, local) it is a plain `next build`.
 *
 * OpenNext itself runs `npm run build` for the Next.js step, which would
 * re-enter this script. DS_NEXT_BUILD_INNER marks that inner call so it
 * falls through to `next build`.
 *
 * Cloudflare sets WORKERS_CI=1 on Workers Builds (CF_PAGES=1 on Pages).
 */
import { spawnSync } from 'node:child_process';

const onCloudflare = Boolean(process.env.WORKERS_CI || process.env.CF_PAGES);
const inner = process.env.DS_NEXT_BUILD_INNER === '1';

const command =
  onCloudflare && !inner ? 'npx opennextjs-cloudflare build' : 'npx next build';

console.log(`[build] ${command}${onCloudflare ? ' (Cloudflare)' : ''}`);

const result = spawnSync(command, {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DS_NEXT_BUILD_INNER: '1' },
});

process.exit(result.status ?? 1);
