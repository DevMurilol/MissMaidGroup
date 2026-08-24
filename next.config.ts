import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers has no sharp-based optimizer. The images in /public are
    // already sized and converted to WebP by `npm run optimize-images`, so they
    // are served as-is from Workers Static Assets (free and unlimited).
    // To turn optimization back on, add the `IMAGES` binding in wrangler.jsonc
    // (Cloudflare Images, billed per transformation) and drop this flag.
    unoptimized: true,
  },
  // `pg` reaches for `pg-cloudflare` to open TCP sockets on Workers. That package
  // exposes it only under the "workerd" export condition, which Next's file
  // tracing (running as node) does not follow, so it copies dist/empty.js and the
  // OpenNext bundle then fails to resolve dist/index.js. Force the whole package in.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/pg-cloudflare/**/*"],
    "/**/*": ["./node_modules/pg-cloudflare/**/*"],
  },
};

export default nextConfig;
