/**
 * Builds the ROCloud marketing site into dist/.
 *
 * The six legal pages are RENDERED FROM docs/legal/*.md — that Markdown is the single source of
 * truth for our legal text. Nothing here restates it, so the published pages can never drift from
 * the drafts under review.
 *
 *   node build.mjs            build (warns about unfilled placeholders)
 *   node build.mjs --strict   build, but exit 1 if any placeholder survives — use before deploying
 */
import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { marked } from 'marked';
import cfg from './site.config.mjs';

const root = dirname(fileURLToPath(import.meta.url));
// Inside this repo on purpose: the host (Netlify) only checks out rocloud-site, so a path outside
// it can never be built remotely. Keeping the Markdown here is what lets the site auto-deploy.
const LEGAL_SRC = join(root, 'docs', 'legal');
const DIST = join(root, 'dist');
const STRICT = process.argv.includes('--strict');

/** Markdown source → published slug + browser-tab title. Order drives the footer/nav listing. */
const PAGES = [
  { md: 'terms-and-conditions.md', slug: 'terms', title: 'Terms & Conditions' },
  { md: 'privacy-policy.md', slug: 'privacy', title: 'Privacy Policy' },
  { md: 'refund-policy.md', slug: 'refunds', title: 'Refund Policy' },
  { md: 'cancellation-policy.md', slug: 'cancellation', title: 'Cancellation Policy' },
  { md: 'shipping-delivery-policy.md', slug: 'delivery', title: 'Shipping & Delivery Policy' },
  { md: 'contact.md', slug: 'contact', title: 'Contact' },
];

/**
 * [TOKEN] in the Markdown / templates → the real value from site.config.mjs. An empty config value
 * deliberately leaves the [TOKEN] in place so the placeholder scan below can catch it.
 */
const TOKENS = {
  '[LEGAL ENTITY NAME]': cfg.legalEntityName,
  '[PROPRIETOR NAME]': cfg.proprietorName,
  '[BUSINESS ADDRESS]': cfg.businessAddress,
  '[COURT CITY]': cfg.courtCity,
  '[GST NUMBER]': cfg.gstNumber,
  '[SUPPORT EMAIL]': cfg.supportEmail,
  '[GRIEVANCE EMAIL]': cfg.grievanceEmail,
  '[SUPPORT PHONE]': cfg.supportPhone,
  '[GRIEVANCE OFFICER NAME]': cfg.grievanceOfficer,
  '[SITE URL]': cfg.siteUrl,
  '[APP URL]': cfg.appUrl,
  '[API URL]': cfg.apiUrl,
};

/**
 * Tokens that are legitimately allowed to be empty. In the Markdown their sentence is wrapped in
 * outer square brackets, e.g.
 *
 *   [Our GST registration number, where applicable, is **[GST NUMBER]**.]
 *
 * Filled in  → the brackets are dropped and the value substituted.
 * Left empty → the whole sentence is removed, and the build does NOT fail.
 *
 * This is how a business that isn't GST-registered publishes Terms with no GST claim in them.
 */
const OPTIONAL = ['[GST NUMBER]'];

const substitute = (text) => {
  let out = text;

  for (const token of OPTIONAL) {
    const value = TOKENS[token];
    // The optional sentence: an outer [...] that contains this token.
    const sentence = new RegExp(`\\s*\\[[^\\[\\]]*${escapeRegex(token)}[^\\[\\]]*\\]`, 'g');

    if (value) {
      // Keep the sentence, but unwrap its outer brackets so they don't show on the page.
      out = out.replace(sentence, (match) => ' ' + match.trim().slice(1, -1));
    } else {
      out = out.replace(sentence, '');
    }
  }

  return Object.entries(TOKENS).reduce(
    (acc, [token, value]) => (value ? acc.replaceAll(token, value) : acc),
    out,
  );
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Anything still shaped like [SOME TOKEN] after substitution is an unfilled business detail. */
const findPlaceholders = (text) => [...new Set(text.match(/\[[A-Z][A-Z0-9 &_/-]{2,}\]/g) ?? [])];

/** Cross-links inside the Markdown ("refund-policy.md") → the published clean URLs ("/legal/refunds"). */
const relinkMarkdown = (md) =>
  PAGES.reduce((acc, p) => acc.replaceAll(`(${p.md})`, `(/legal/${p.slug})`), md);

const navLinks = (active) =>
  PAGES.map(
    (p) =>
      `<a href="/legal/${p.slug}"${p.slug === active ? ' aria-current="page"' : ''}>${p.title}</a>`,
  ).join('\n          ');

const footer = () => `
    <footer class="footer">
      <div class="wrap footer-grid">
        <div class="footer-brand">
          <a class="logo" href="/">${LOGO_SVG}<span class="wordmark"><b>RO</b><i>Cloud</i></span></a>
          <p>Delivery, billing and payments for RO water businesses across India.</p>
        </div>
        <nav class="footer-col" aria-label="Product">
          <h2>Product</h2>
          <a href="/#features">Features</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#faq">FAQ</a>
          <a href="${cfg.appUrl}/login">Sign in</a>
          <a href="${cfg.appUrl}/register">Start free trial</a>
        </nav>
        <nav class="footer-col" aria-label="Legal">
          <h2>Legal</h2>
          ${navLinks()}
        </nav>
        <div class="footer-col">
          <h2>Contact</h2>
          <a href="mailto:[SUPPORT EMAIL]">[SUPPORT EMAIL]</a>
          <a href="tel:[SUPPORT PHONE]">[SUPPORT PHONE]</a>
          <address>[BUSINESS ADDRESS]</address>
        </div>
      </div>
      <div class="wrap footer-bar">
        <p>&copy; ${new Date().getFullYear()} [LEGAL ENTITY NAME]. All rights reserved.</p>
        <p>Payments secured by Razorpay.</p>
      </div>
    </footer>`;

const LOGO_SVG = `<svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="44" height="44" rx="10" fill="#0C447C"/>
    <rect x="8" y="26" width="28" height="10" rx="5" fill="#185FA5"/>
    <rect x="12" y="22" width="20" height="10" rx="5" fill="#378ADD"/>
    <rect x="15" y="18" width="14" height="10" rx="5" fill="#B5D4F4"/>
    <circle cx="22" cy="15" r="6" fill="#1D9E75"/>
    <path d="M20 15L21.5 16.5L24.5 13" stroke="#E1F5EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

/** The shared page chrome for the six legal pages. The landing page has its own template. */
const legalShell = ({ title, slug, body }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title} · ROCloud</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${title} for ROCloud, the delivery and billing platform for RO water businesses.">
  <meta name="theme-color" content="#0C447C">
  <link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">
  <link rel="stylesheet" href="/assets/site.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="header">
    <div class="wrap header-inner">
      <a class="logo" href="/">${LOGO_SVG}<span class="wordmark"><b>RO</b><i>Cloud</i></span></a>
      <nav class="header-nav" aria-label="Main">
        <a href="/#features">Features</a>
        <a href="/#pricing">Pricing</a>
        <a href="/legal/contact">Contact</a>
        <a class="btn btn-ghost" href="${cfg.appUrl}/login">Sign in</a>
        <a class="btn btn-primary" href="${cfg.appUrl}/register">Start free trial</a>
      </nav>
    </div>
  </header>

  <main id="main" class="wrap legal">
    <nav class="legal-nav" aria-label="Policies">
      ${navLinks(slug)}
    </nav>
    <article class="prose">
${body}
    </article>
  </main>
${footer()}
</body>
</html>
`;

async function build() {
  await mkdir(join(DIST, 'legal'), { recursive: true });

  // Static assets + the IIS config ride along unchanged.
  await cp(join(root, 'assets'), join(DIST, 'assets'), { recursive: true });
  await cp(join(root, 'web.config'), join(DIST, 'web.config'));

  const written = [];

  // 1. Landing page.
  const indexTpl = await readFile(join(root, 'templates', 'index.html'), 'utf8');
  const index = substitute(indexTpl.replace('<!--FOOTER-->', footer()).replaceAll('<!--LOGO-->', LOGO_SVG));
  await writeFile(join(DIST, 'index.html'), index);
  written.push(['index.html', index]);

  // 2. The six legal pages, rendered from the Markdown drafts.
  const available = await readdir(LEGAL_SRC);
  for (const page of PAGES) {
    if (!available.includes(page.md)) throw new Error(`Missing legal source: docs/legal/${page.md}`);

    const raw = await readFile(join(LEGAL_SRC, page.md), 'utf8');
    // Drop the maintainer-only HTML comment at the top of each draft, then rewrite cross-links.
    const md = relinkMarkdown(raw.replace(/<!--[\s\S]*?-->/g, '').trim());
    const html = substitute(legalShell({ ...page, body: marked.parse(md) }));

    await writeFile(join(DIST, 'legal', `${page.slug}.html`), html);
    written.push([`legal/${page.slug}.html`, html]);
  }

  // 3. Refuse to ship business details we never filled in.
  const unfilled = [...new Set(written.flatMap(([, html]) => findPlaceholders(html)))];
  for (const [name] of written) console.log(`  ✓ dist/${name}`);

  if (unfilled.length) {
    const msg = `\n  ${unfilled.length} unfilled placeholder(s): ${unfilled.join(', ')}\n  → fill them in rocloud-site/site.config.mjs`;
    if (STRICT) {
      console.error(`\n✖ Refusing to publish.${msg}\n`);
      process.exit(1);
    }
    console.warn(`\n⚠ Built for PREVIEW ONLY — do not deploy.${msg}\n`);
  } else {
    console.log('\n✓ No placeholders left — safe to deploy.\n');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
