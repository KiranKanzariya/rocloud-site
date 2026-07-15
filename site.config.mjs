/**
 * The ONE place to put ROCloud's business details.
 *
 * These values are substituted into the landing page and into the legal pages generated from
 * ../docs/legal/*.md — the Markdown keeps its [TOKEN] placeholders as the reusable template, and
 * this file supplies the real values at build time. Fill these in before you publish.
 *
 * Any value left empty keeps its [TOKEN] visible in the output, and `npm run build:prod` will
 * refuse to build — so a placeholder can never reach a Razorpay reviewer or a customer.
 */
export default {
  // ── Business / legal identity ─────────────────────────────────────────────
  // Once registered, e.g. 'Sharma Softworks' or 'ROCloud Technologies Pvt Ltd'.
  legalEntityName: 'ROCloud',
  // The individual who owns/operates the business (used while unregistered).
  proprietorName: 'Rajesh Sharma',
  // Full postal address, ending in '<City>, Gujarat, India – <PIN>'.
  businessAddress: 'Kothariya, Wadhwan, Surendranagar, Gujarat, India – 363030',
  // The Gujarat city whose courts have exclusive jurisdiction (e.g. 'Ahmedabad').
  courtCity: 'Surendranagar',
  // Only if/when GST-registered. Leave '' if not — see the note in the Terms.
  gstNumber: '123',

  // ── Contact ───────────────────────────────────────────────────────────────
  // The mailbox must actually exist and be monitored before Razorpay review.
  supportEmail: 'support@rocloud.app',          // suggested: support@rocloud.app
  grievanceEmail: 'support@rocloud.app',        // suggested: grievance@rocloud.app (may reuse supportEmail)
  supportPhone: '+91 98765 43210',          // a reachable +91 number
  grievanceOfficer: 'Rajesh Sharma',      // a named person — the DPDP Act 2023 expects one

  // ── URLs (these are already correct; change only if the domains move) ──────
  siteUrl: 'https://rocloud.app',
  appUrl: 'https://app.rocloud.app',
  apiUrl: 'https://api.rocloud.app/api',
};
