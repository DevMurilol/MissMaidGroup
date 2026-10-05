# Miss Maid Group

Professional house cleaning landing page for the Gold Coast, built with Next.js 16
(App Router), TypeScript, Tailwind CSS v4 and Resend, deployed to Cloudflare Workers.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Cloudflare Workers** via `@opennextjs/cloudflare` (see [Deploying](#deploying-to-cloudflare))
- **Tailwind CSS v4** with a custom brand token system
- **Resend** for the quote emails
- **Zod** for form and API validation

There is no database. Every word on the site lives in `src/lib/site-config.ts`
and ships with a deploy. The only thing that runs on the server is
`/api/quote`, which validates the form, prices it and sends two emails.

## Getting started

```bash
npm install
cp .env.example .env   # add the Resend key
npm run dev
```

The site runs without the key; quote submissions just log a warning instead of
sending.

## How a quote flows

```
browser form  ->  POST /api/quote (Worker)  ->  Resend
                                                 |- internal email  -> hello@missmaidgroup.com.au
                                                 '- confirmation    -> the customer
```

The internal email carries every field plus the calculated price, arrives with
`Reply-To` set to the customer, and is the system of record. The Resend key
never reaches the browser: the form only ever calls `/api/quote`.

**A lead is never silently lost.** The Resend SDK resolves with
`{ data: null, error }` rather than throwing, so `src/lib/resend.ts` reads that
error field explicitly. If the lead email does not go out, `/api/quote` answers
502 and the form tells the visitor to call or email instead of showing a
confirmation. The customer acknowledgement failing is only logged: by then the
lead is already safe.

Pricing lives in `src/lib/pricing.ts`, services and add-ons in
`src/lib/site-config.ts`. To show the Airbnb service, flip `hidden: true` to
`false` on that entry and deploy.

## Deploying to Cloudflare

The app runs on **Cloudflare Workers** through the OpenNext adapter and fits the
Workers **Free** plan (100k requests/day, commercial use allowed).

### One-time setup

**1. Verify the sending domain in Resend.** Add `missmaidgroup.com.au` under
Domains at resend.com and publish the DKIM, SPF and return-path records it gives
you at your DNS provider. Until that is green, Resend rejects every send and the
form shows its error message instead of a confirmation.

Both emails are sent from `siteConfig.email`, the one mailbox the business owns.
Resend only needs the domain verified, so an invented sender like `quotes@` would
also be accepted, but nothing would be watching that address if a reply or a
bounce landed there.

| | From | To | Reply-To |
|---|---|---|---|
| Lead notification | `hello@missmaidgroup.com.au` | `hello@missmaidgroup.com.au` | the customer |
| Customer confirmation | `hello@missmaidgroup.com.au` | the customer | — |

The lead notification is addressed to the same mailbox it is sent from. Replying
to it answers the customer, because `Reply-To` carries their address.

**2. Set the key on the Worker:**

```bash
npx wrangler login
```

```bash
npx wrangler secret put RESEND_API_KEY
```

That is the whole setup. There are no KV namespaces, queues or bindings to
create: every page is prerendered and served from Workers Static Assets, and
`wrangler.jsonc` declares nothing beyond the assets directory.

### Deploying

Pushes to `main` deploy automatically through
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Pull requests
run the same build without deploying, so a broken bundle is caught before merge.

Two repository secrets are needed once (Settings > Secrets and variables > Actions):

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com > My Profile > API Tokens > Create, using the **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Workers & Pages overview, right-hand column |

The deploy job targets a GitHub environment called `production`. Add required
reviewers to it if you want a manual approval step before anything goes live.

To deploy from a machine instead:

```bash
npm run deploy
```

`npm run preview` does the same build but serves it locally in the Workers
runtime (workerd) instead of deploying. Put the Resend key in `.dev.vars` for
that; the Worker runtime does not read `.env`.

### How it stays inside the Free plan

The Free plan allows 3 MiB (gzip) per Worker and **10 ms of CPU per request**.
The Worker is ~1.2 MiB, and almost no request touches it:

- **Every page is fully static.** Nothing has `revalidate`, so Next prerenders
  the lot at build time. `open-next.config.ts` uses the
  `staticAssetsIncrementalCache` override with `enableCacheInterception`, which
  serves those pages from the `ASSETS` binding without booting the Next server.
  Static asset requests are free, unlimited and cost no CPU.
- **Only `/api/quote` runs code.** One Zod parse, one price calculation, two
  Resend calls.

Check the size after any dependency change:

```bash
npx wrangler deploy --dry-run
```

### Notes and limits

- `next/image` optimization is off (`unoptimized: true`): the files in
  `public/images` are already sized WebP and are served straight from static
  assets. To re-enable it, add the `IMAGES` binding to `wrangler.jsonc` and
  note that Cloudflare Images bills per transformation.
- Deploy with `opennextjs-cloudflare deploy`, not bare `wrangler deploy`. The
  former copies the prerendered pages into the assets bundle
  (`cdn-cgi/_next_cache/`) first. Without that copy the cache lookup misses on
  every request, the Next server renders each page, and the logs fill with
  `StaticAssetsIncrementalCache: Failed to set to read-only cache`.
- The build works on Windows. An earlier version of this project pulled in
  Prisma and `pg`, which Next externalises as directory junctions that OpenNext
  then failed to recreate as symlinks without Developer Mode. With those gone,
  `npm run deploy` runs anywhere.

## Environment variables

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Sends the internal lead email and the customer confirmation |

Local dev reads it from `.env`. The local Worker (`npm run preview`) reads
`.dev.vars`. Production reads the Cloudflare secret. All three are gitignored.

## Images

`public/images/` holds the hero, the logo in three variants, and one real
before/after pair from a job. The gallery uses a cross-fade rather than a wipe
because hand-held job photos never register pixel for pixel, and a wipe shows
that as a hard seam. Add more pairs in `src/lib/site-config.ts`
(`galleryShowcase`) as photos come in; keep both frames at the same aspect
ratio and run `npm run optimize-images` to convert them to WebP.
