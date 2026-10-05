import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Every page is prerendered at build time and nothing revalidates at runtime,
  // so the prerendered HTML is read straight from the ASSETS binding. No KV
  // namespaces, no tag cache, no queue: the only thing the Worker does on a
  // request is answer /api/quote.
  incrementalCache: staticAssetsIncrementalCache,
  // Serve prerendered pages without booting NextServer. This is what keeps the
  // public pages under the Free plan's 10ms CPU budget.
  enableCacheInterception: true,
});
