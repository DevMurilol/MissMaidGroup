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
};

export default nextConfig;
