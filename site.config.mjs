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
 * Two fields are exceptions, and are optional: `gstNumber` and `proprietorName`. Leaving either
 * empty removes its clause from the drafts entirely rather than failing the build — no GST sentence
 * in the Terms, no "operated by <person>" anywhere. Both are listed in OPTIONAL in build.mjs.
 */
export default {
  // ── Business / legal identity ─────────────────────────────────────────────
  // Once registered, e.g. 'Sharma Softworks' or 'ROCloud Technologies Pvt Ltd'.
  legalEntityName: 'ROCloud',
  // OPTIONAL. The individual who owns/operates the business. Deliberately EMPTY: the published
  // pages name only the business, not a person, so the "operated by …" clause drops out of the
  // Terms preamble, the Privacy Policy opener and the Contact page's business details.
  //
  // Understand what that costs before you leave it empty. While the business is an unregistered
  // sole proprietorship, "ROCloud" is a trade name with no legal existence of its own — so the
  // Terms name a counterparty that cannot be identified from the page, and a customer wanting to
  // serve notice (or Razorpay reconciling the site against an Individual-KYC merchant) has no name
  // to match. Registering an entity and putting its name in `legalEntityName` is what resolves
  // this properly; filling this field back in is the interim fix.
  proprietorName: '',
  // Full postal address, ending in '<City>, Gujarat, India – <PIN>'.
  businessAddress: 'Kothariya, Wadhwan, Surendranagar, Gujarat, India – 363030',
  // The Gujarat city whose courts have exclusive jurisdiction (e.g. 'Ahmedabad').
  courtCity: 'Surendranagar',
  // OPTIONAL (like proprietorName above). Set it only if you are GST-registered, and then
  // use the full 15-character GSTIN (e.g. '24ABCDE1234F1Z5'). Leave '' and the Terms simply won't
  // mention GST at all.
  gstNumber: '',

  // ── Contact ───────────────────────────────────────────────────────────────
  // The mailbox must actually exist and be monitored before Razorpay review.
  supportEmail: 'support@mail.rocloud.in',          // suggested: support@rocloud.app
  grievanceEmail: 'support@mail.rocloud.in',        // suggested: grievance@rocloud.app (may reuse supportEmail)
  supportPhone: '+91 88499 27914',          // a reachable +91 number
  // There is deliberately NO grievanceOfficer name. The Privacy Policy and Contact page publish the
  // office by ROLE — "Grievance Officer, <legalEntityName>" at grievanceEmail — so the mailbox can
  // change hands without a text edit, and no personal name is published twice over (the proprietor
  // is already named in the Terms). Note SPDI Rule 5(9) reads as expecting a NAME; DPDP §13(3) asks
  // only for contact information of a person able to answer. Reversing this means adding the field
  // back here, restoring the [GRIEVANCE OFFICER NAME] token in build.mjs, and naming the person in
  // privacy-policy.md §10 and contact.md.

  // ── URLs (these are already correct; change only if the domains move) ──────
  siteUrl: 'https://rocloud.in',
  appUrl: 'https://app.rocloud.in',
  apiUrl: 'https://api.rocloud.in/api',
};
