import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";

export default defineCloudflareConfig({
  // Workers KV is used for both caches: it is included in the Workers Free plan
  // and, unlike R2, does not require a payment method on the account.
  incrementalCache: kvIncrementalCache,
  // Tag cache is what makes on-demand `revalidatePath()` work from the admin.
  tagCache: kvTagCache,
  // No queue/Durable Object: revalidations run inline. Fine at this traffic level.
  queue: "direct",
  // Serve prerendered pages straight from the cache without booting NextServer.
  // This is the setting that keeps the public pages under the Free plan's 10ms
  // CPU budget. Safe here because the app does not use PPR.
  enableCacheInterception: true,
});
