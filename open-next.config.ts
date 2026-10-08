import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * No incremental cache on purpose: every page is prerendered at build time
 * and nothing uses ISR or `revalidate`, so there is nothing to cache between
 * requests. If that changes, add the R2 incremental cache from
 * https://opennext.js.org/cloudflare/caching and an `r2_buckets` entry in
 * wrangler.jsonc.
 */
export default defineCloudflareConfig({});
