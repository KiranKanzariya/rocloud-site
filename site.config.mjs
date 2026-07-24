/**
 * The ONE place to put ROCloud's business details.
 *
 * These values are substituted into the landing page and into the legal pages generated from
 * ../docs/legal/*.md — the Markdown keeps its [TOKEN] placeholders as the reusable template, and
 * this file supplies the real values at build time. Fill these in before you publish.
 *
 * Any value left empty keeps its [TOKEN] visible in the output, and `npm run build:prod` will
 * refuse to build — so a placeholder can never reach a Razorpay reviewer or a customer.
 *
 * The exception is `gstNumber`, which is optional: leaving it empty removes the GST sentence from
 * the Terms entirely, rather than failing the build.
 */
export default {
  // ── Business / legal identity ─────────────────────────────────────────────
  // Once registered, e.g. 'Sharma Softworks' or 'ROCloud Technologies Pvt Ltd'.
  legalEntityName: 'ROCloud',
  // The individual who owns/operates the business (used while unregistered).
  proprietorName: 'Kiran Kanzariya',
  // Full postal address, ending in '<City>, Gujarat, India – <PIN>'.
  businessAddress: 'Kothariya, Wadhwan, Surendranagar, Gujarat, India – 363030',
  // The Gujarat city whose courts have exclusive jurisdiction (e.g. 'Ahmedabad').
  courtCity: 'Surendranagar',
  // OPTIONAL — the only field you may leave empty. Set it only if you are GST-registered, and then
  // use the full 15-character GSTIN (e.g. '24ABCDE1234F1Z5'). Leave '' and the Terms simply won't
  // mention GST at all.
  gstNumber: '',

  // ── Contact ───────────────────────────────────────────────────────────────
  // The mailbox must actually exist and be monitored before Razorpay review.
  supportEmail: 'support@mail.rocloud.in',          // suggested: support@rocloud.app
  grievanceEmail: 'support@mail.rocloud.in',        // suggested: grievance@rocloud.app (may reuse supportEmail)
  supportPhone: '+91 88499 27914',          // a reachable +91 number
  grievanceOfficer: 'Kiran Kanzariya',      // a named person — the DPDP Act 2023 expects one

  // ── URLs (these are already correct; change only if the domains move) ──────
  siteUrl: 'https://rocloud.in',
  appUrl: 'https://app.rocloud.in',
  apiUrl: 'https://api.rocloud.in/api',
};
