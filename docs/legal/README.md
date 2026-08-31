<!--
  ============================================================================
  BEFORE YOU PUBLISH — replace every placeholder below across ALL files here.
  Search each file for square-bracket tokens and fill them in:

    [LEGAL ENTITY NAME]   e.g. "Acme Softworks (Sole Proprietorship)" once you register.
    [PROPRIETOR NAME]     OPTIONAL, and currently empty on purpose — the pages name the
                          business, not a person. Its clause is wrapped in outer brackets
                          so an empty value removes it. See site.config.mjs for the caveat:
                          until an entity is registered, this leaves the Terms with a
                          counterparty that has no legal existence of its own.
    [BUSINESS ADDRESS]    full postal address, ending in "<City>, Gujarat, India, <PIN>".
    [COURT CITY]          the Gujarat city whose courts have jurisdiction (e.g. Ahmedabad, Rajkot, Surat).
    [SUPPORT EMAIL]       suggested: support@rocloud.in  (create the mailbox first).
    [GRIEVANCE EMAIL]     suggested: grievance@rocloud.in or reuse support.
    [SUPPORT PHONE]       a reachable +91 number.
    [GST NUMBER]          only if/when GST-registered; otherwise delete GST lines.

  The Grievance Officer is published by ROLE, not by name — "Grievance Officer,
  <LEGAL ENTITY NAME>" at [GRIEVANCE EMAIL], in privacy-policy.md §10 and contact.md.
  Keep that mailbox monitored: it is the only channel a data principal has. If a lawyer
  asks for a named individual (SPDI Rule 5(9) reads that way; DPDP s.13(3) does not),
  name them in those two files and add the token back to build.mjs.

  These are drafts, not legal advice. Have a qualified Indian lawyer review them
  before you publish, especially the Terms, Privacy Policy, and Refund Policy.
  ============================================================================
-->

# ROCloud — Legal & Policy Pages

Public-facing policy documents for **ROCloud** (https://rocloud.in), the SaaS platform
for RO water-delivery businesses. These are the pages a payment gateway such as
**Razorpay** requires to be reachable at public URLs during merchant onboarding.

| Page | File | Suggested public URL |
|------|------|----------------------|
| Terms & Conditions | [terms-and-conditions.md](terms-and-conditions.md) | `https://rocloud.in/legal/terms` |
| Privacy Policy | [privacy-policy.md](privacy-policy.md) | `https://rocloud.in/legal/privacy` |
| Refund Policy | [refund-policy.md](refund-policy.md) | `https://rocloud.in/legal/refunds` |
| Cancellation Policy | [cancellation-policy.md](cancellation-policy.md) | `https://rocloud.in/legal/cancellation` |
| Shipping / Delivery Policy | [shipping-delivery-policy.md](shipping-delivery-policy.md) | `https://rocloud.in/legal/delivery` |
| Contact | [contact.md](contact.md) | `https://rocloud.in/legal/contact` |

**Effective date on all documents:** 7 July 2026 (update when you publish).

> ROCloud is a business-to-business (B2B) software service. It sells **software access**,
> not water. Physical water/bottle delivery is carried out by the subscribing business for
> its own customers — ROCloud is not a party to those deliveries. The Shipping/Delivery
> Policy therefore describes **electronic delivery of the software service**.
