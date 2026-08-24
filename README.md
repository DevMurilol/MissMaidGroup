# Miss Maid Group

Professional house cleaning landing page for the Gold Coast, built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma 7, and Resend.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **Cloudflare Workers** via `@opennextjs/cloudflare` (see [Deploying to Cloudflare](#deploying-to-cloudflare))
- **TailwindCSS v4** with a custom brand token system (green/beige palette, Inter + Lato)
- **Prisma 7** + PostgreSQL (driver adapter, `src/generated/prisma` client)
- **Resend** for transactional quote emails
- **Zod** for form/API validation

## Getting started

```bash
npm install
cp .env.example .env   # fill in real values
npx prisma migrate dev --name init   # once DATABASE_URL is set
npm run dev
```

## Connecting Supabase

1. In the Supabase dashboard open your project and click **Connect** (top bar).
2. Copy two strings from the **ORMs / Postgres** tab and paste them into `.env`:
   - **Transaction pooler** (`:6543`) into `DATABASE_URL` — used by the app at runtime,
     it is the pooled connection that survives serverless concurrency.
   - **Session pooler** (`:5432`) into `DIRECT_DATABASE_URL` — used only by
     `prisma migrate`/`prisma db`, since DDL needs a non transaction-pooled session.
     (The **Direct connection** string works too, but it is IPv6-only unless the
     project has the IPv4 add-on.)
3. Replace `[YOUR-PASSWORD]` with the database password (Settings > Database >
   *Reset database password* if you no longer have it). URL-encode special
   characters: `@` -> `%40`, `#` -> `%23`, `/` -> `%2F`.
4. Keep `?sslmode=require` at the end of both — Supabase requires TLS.
5. Create the tables and generate the client:

```bash
npx prisma migrate dev --name init
```

6. Start the app, sign in at `/admin` and click **"Load starter data from spec"**
   on the Services or Add-ons page to seed the defaults.

Migrations are resolved through `prisma.config.ts`, which prefers
`DIRECT_DATABASE_URL` and falls back to `DATABASE_URL` when it is empty.
In production these are Cloudflare secrets, not `.env` values — see
[Deploying to Cloudflare](#deploying-to-cloudflare).

The site works with zero configuration, the homepage renders from the static
content in `src/lib/site-config.ts` if no database is connected. Connecting a
database unlocks the admin panel and lets it override services, add-ons, and
pricing live.

## Deploying to Cloudflare

The app runs on **Cloudflare Workers** through the OpenNext adapter. Everything
below fits the Workers **Free** plan (100k requests/day, commercial use allowed).

### One-time setup

```bash
npx wrangler login
```

Create the two KV namespaces used for the ISR cache and paste the returned ids
into `wrangler.jsonc`:

```bash
npx wrangler kv namespace create NEXT_INC_CACHE_KV
```

```bash
npx wrangler kv namespace create NEXT_TAG_CACHE_KV
```

Then set the production secrets (these are *not* read from `.env`):

```bash
for v in DATABASE_URL RESEND_API_KEY ADMIN_EMAIL ADMIN_PASSWORD ADMIN_SESSION_SECRET; do npx wrangler secret put $v; done
```

`DIRECT_DATABASE_URL` is only used by `prisma migrate`, so it stays local.

### Deploying

```bash
npm run deploy
```

`npm run preview` does the same build but serves it locally in the Workers
runtime (workerd) instead of deploying.

### Staying inside the Free plan

The Free plan allows 3 MiB (gzip) per Worker and **10 ms of CPU per request**,
which plain SSR would blow past. Three things keep the app inside it:

- **The public pages are prerendered.** `src/app/page.tsx` sets
  `export const revalidate = 3600`, and `enableCacheInterception` in
  `open-next.config.ts` serves those pages from Workers Static Assets without
  booting the Next server. Static asset requests are free, unlimited, and cost
  no CPU. Only `/admin` and `/api/*` actually invoke the Worker.
- **Admin edits still publish instantly.** `/api/admin/services` and
  `/api/admin/seed` call `revalidatePath("/")`, so the homepage regenerates on
  save rather than waiting out the hour.
- **The Prisma query compiler is the `small` build** (`compilerBuild` in
  `prisma/schema.prisma`). The default `fast` build embeds a ~4.8 MB base64 WASM
  blob that pushes the Worker to ~3.1 MiB gzip, just over the limit. With
  `small` the bundle is ~2.4 MiB.

Check the size after any dependency change:

```bash
npx wrangler deploy --dry-run
```

### Building on Windows

The bundling step creates symlinks, which Windows only permits with **Developer
Mode** enabled (Settings > Privacy & security > For developers) or from an
elevated terminal. Without it the build fails with `EPERM: operation not
permitted, symlink`. Building in WSL or in CI avoids this entirely.

### Notes and limits

- `next/image` optimization is off (`unoptimized: true`): the files in
  `public/images` are already sized WebP and are served straight from static
  assets. To re-enable it, add the `IMAGES` binding to `wrangler.jsonc` —
  Cloudflare Images bills per transformation.
- The database client is created **per request** (`src/lib/prisma.ts`). Workers
  cannot reuse a connection across requests, so there is no global singleton and
  the pool is set to `maxUses: 1`.
- `pg-cloudflare` is force-included through `outputFileTracingIncludes` in
  `next.config.ts`; Next's tracer otherwise misses it and the bundle fails to
  resolve the Workers TCP socket implementation.

## Environment variables

See `.env.example`. Required for full functionality:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string used at runtime (Supabase transaction pooler, `:6543`) |
| `DIRECT_DATABASE_URL` | Non-pooled connection used by `prisma migrate` (Supabase session pooler, `:5432`). Optional — falls back to `DATABASE_URL` |
| `RESEND_API_KEY` | Sends the internal + customer quote emails |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for `/admin` |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie (`openssl rand -hex 32`) |
| `SHOW_AIRBNB_SERVICE` | Fallback toggle for the hidden Airbnb service when no database is connected |

## Admin panel

Visit `/admin` (redirects to `/admin/login`). Once signed in:

- **Leads** — every quote request, status tracking, CSV export.
- **Services** — toggle services on/off (this is what reveals Airbnb Cleaning), edit copy, mark a featured service.
- **Add-ons** — add/remove/reprice extras shown in the price simulator.
- **Quote Rules** — base pricing, per-service multipliers, frequency discounts. Changes apply to new quotes immediately.

The first time you connect a database, open **Services** or **Add-ons** and
click **"Load starter data from spec"** to seed the defaults from
`site-config.ts` and `pricing.ts`.

## Images

`public/images/hero-home.webp` and the kitchen before/after pair were AI-generated
and optimized to WebP via `npm run optimize-images` (uses `sharp`). The gallery
section intentionally shows one real, well-matched before/after pair rather than
mismatched stock placeholders — add more real pairs in `src/lib/site-config.ts`
(`galleryShowcase`) as photos become available.

## Notes on scope

- The public quote simulator's add-on catalog is served from the static config
  for reliability; admin-managed add-on **prices** are honored server-side when
  calculating quotes if the slugs match.
- Admin pages and API routes each verify the signed session cookie through
  `src/lib/admin-session.ts` (`requireAdminPage` / `requireAdminApi`). There is
  deliberately no `proxy.ts`: Next 16 pins Proxy to the Node.js runtime, which
  Cloudflare Workers cannot run, and the Next.js auth guide recommends checking
  per route rather than in a proxy or layout anyway.
