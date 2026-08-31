# rocloud-site

The public marketing site and legal pages for **ROCloud**, served at **https://rocloud.in**.

Plain static HTML/CSS/JS — no framework, no runtime dependencies. The only build-time dependency is
`marked`, used to render the legal pages from Markdown.

## Why this exists

Razorpay (and any payment gateway) requires the merchant's policies to be reachable at **public
URLs**, with no login. The portals can't serve that purpose: `app.rocloud.in` is behind a sign-in
screen, and the tenant subdomains (`*.rocloud.in`) would duplicate the same legal text across every
customer's hostname. So the policies live here, once, on the apex domain.

## The legal pages are generated — don't edit them by hand

`docs/legal/*.md` is the **single source of truth** for ROCloud's legal text. `build.mjs` renders
those drafts into `dist/legal/*.html`. Editing the generated HTML directly means the next build
silently overwrites you, and the published text drifts from the drafts under review.

| Source | Published at |
|---|---|
| `docs/legal/terms-and-conditions.md` | `/legal/terms` |
| `docs/legal/privacy-policy.md` | `/legal/privacy` |
| `docs/legal/refund-policy.md` | `/legal/refunds` |
| `docs/legal/cancellation-policy.md` | `/legal/cancellation` |
| `docs/legal/shipping-delivery-policy.md` | `/legal/delivery` |
| `docs/legal/contact.md` | `/legal/contact` |

## Before you publish: fill in `site.config.mjs`

The Markdown drafts carry `[TOKEN]` placeholders (`[LEGAL ENTITY NAME]`, `[BUSINESS ADDRESS]`,
`[SUPPORT EMAIL]`, …). **`site.config.mjs` is the one place you fill them in** — the build
substitutes them into every page.

Any token left empty stays visible in the output, and `npm run build:prod` **exits 1 rather than
publish it**. A Razorpay reviewer must never see `[BUSINESS ADDRESS]`.

Two fields are exempt because they are genuinely optional — `gstNumber` and `proprietorName`. Their
clauses are wrapped in outer brackets in the Markdown, so an empty value deletes the clause instead
of failing the build (`OPTIONAL` in `build.mjs`). `proprietorName` is empty on purpose: the pages
name the business, not a person. See the note in `site.config.mjs` for what that costs while the
business is an unregistered proprietorship.

## Commands

```bash
npm install
npm run build        # build to dist/ — warns about unfilled placeholders
npm run build:prod   # build, but FAIL if any placeholder is unfilled — use before deploying
npm start            # build and serve at http://localhost:4300
```

## Pricing is fetched live — never hardcode it

The pricing section renders from `GET https://api.rocloud.in/api/plans` (the `[AllowAnonymous]`
endpoint the sign-up wizard uses), so prices and limits here can never drift from the `plans` table.
`assets/site.js` does this.

The static cards in `templates/index.html` are the no-JS / API-down fallback. They contain the one
hand-written price on the whole site — a **"from ₹499/month"** floor. It tracks the **cheapest
active plan**, not a named tier: it followed Basic until the Starter plan was added below it. If
that plan's price changes — or a cheaper tier is added — update that line.

`build.mjs` now guards it: every build fetches the catalogue and compares the floor. A mismatch
warns, and under `--strict` it refuses to publish. The check is skipped when the API is unreachable
(so the site still builds offline and in CI), which is why the line above still needs updating by
hand when a price moves.

The annual price and its saving are **computed** from `yearlyPrice` in the same response — nothing
about the discount is written by hand, and the line disappears entirely if a yearly price ever stops
beating twelve monthly ones.

## Deploying

1. `npm run build:prod` (fails if placeholders remain, or if the fallback price no longer matches
   the live plan catalogue).
2. Publish the contents of `dist/`.

   > **The live site is on Netlify**, not IIS — `https://rocloud.in` 301s to `https://www.rocloud.in`
   > and the response carries `Server: Netlify` and **no** security headers.
   >
   > `web.config` only applies to an IIS host. It is kept for that case, but note two things before
   > relying on it: it redirects `www` → apex, which is the **opposite** of the live behaviour; and
   > the security headers it defines (CSP included) are **not being served today**. There is no
   > `netlify.toml` / `_headers` / `_redirects` in this repo, so nothing ports them across.
3. Verify every URL returns **200 while signed out**, in a private window:

   ```
   /  /legal/terms  /legal/privacy  /legal/refunds
   /legal/cancellation  /legal/delivery  /legal/contact
   ```

4. Paste those URLs into the Razorpay dashboard.

## Brand

`assets/site.css` mirrors the tokens in `rocloud-owner-portal/tailwind.config.js` (navy `#0C447C`,
teal `#1D9E75`, shell `#F1EFE8`, Plus Jakarta Sans + Inter). If a brand colour changes there, change
it here too.
