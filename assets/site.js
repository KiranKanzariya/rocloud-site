/*
 * Mobile navigation disclosure.
 *
 * Its own IIFE, before the pricing one: that block returns early when there is no #pricing
 * section, so anything appended to it would never run on the legal pages.
 */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Following an in-page link should close the panel, not leave it covering the target.
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // Resizing past the breakpoint leaves the panel styled as a desktop bar; reset the state
  // so the toggle and the markup can't disagree.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 840) setOpen(false);
  });
})();

/*
 * Renders the pricing section from the LIVE plan catalogue (GET /api/plans, [AllowAnonymous]) — the
 * same endpoint the sign-up wizard uses, so prices and limits here can never drift from the plans
 * table. Never hardcode a price in this file.
 *
 * The static cards in index.html are the no-JS / API-down fallback: they stay put unless we get a
 * usable response, so the pricing section is never empty for a visitor (or a payment-gateway
 * reviewer) whose browser blocks scripts.
 */
(function () {
  'use strict';

  var section = document.getElementById('pricing');
  if (!section) return;

  var grid = section.querySelector('[data-plans]');
  var apiUrl = section.getAttribute('data-api');
  var appUrl = section.getAttribute('data-app');
  if (!grid || !apiUrl) return;

  /** These exist in the plans table but aren't shipped yet — shown, honestly, as "Coming soon". */
  var COMING_SOON = { whatsappEnabled: 'WhatsApp notifications', multiBranchEnabled: 'Multi-branch', apiAccessEnabled: 'API access' };

  /*
   * Tier ordering, mirroring PLAN_ORDER in rocloud-owner-portal permission.service.ts.
   *
   * Most plan features come off a boolean in the catalogue (customRolesEnabled, whatsappEnabled…),
   * but a few are gated by TIER instead and have no field in PlanDto — so the pricing cards had no
   * way to show them and simply didn't, leaving a paid-only feature invisible on the pricing page
   * while the page meta still advertised it.
   *
   * Anything listed in TIER_FEATURES must stay in step with the portal's own gate. Reports: the
   * `plan: 'Pro'` on the /reports route in app.routes.ts. The proper fix is a flag on PlanDto so
   * this is data-driven like the rest; until then, keep these two in sync by hand.
   */
  var PLAN_ORDER = { Basic: 1, Pro: 2, Enterprise: 3 };
  var TIER_FEATURES = [{ minTier: 'Pro', label: 'Reports, charts & CSV/Excel export' }];

  function atLeastTier(planType, minTier) {
    return (PLAN_ORDER[planType] || 0) >= (PLAN_ORDER[minTier] || Infinity);
  }

  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function escape(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /**
   * The plans table uses 0 to mean unlimited. Nouns are passed in plural and de-pluralised at
   * one — Basic allows a single delivery boy, which read as "1 delivery boys".
   */
  function limit(count, noun) {
    if (count === 0) return 'Unlimited ' + noun;
    return count.toLocaleString('en-IN') + ' ' + (count === 1 ? noun.replace(/s$/, '') : noun);
  }

  function item(label, soon) {
    return (
      '<li' + (soon ? ' class="is-soon"' : '') + '>' + CHECK + '<span>' + escape(label) + '</span>' +
      (soon ? '<span class="badge badge-soon">Coming soon</span>' : '') +
      '</li>'
    );
  }

  /**
   * The annual line under the monthly price.
   *
   * `yearlyPrice` is in every /api/plans response and the whole billing flow supports it
   * (InitiateSubscriptionCommand takes a BillingCycle), but this page used to drop the field on
   * the floor — a visitor could not tell annual billing existed, let alone that it is cheaper.
   *
   * The saving is computed, never written by hand: a yearly price that stops beating monthly
   * simply renders no line rather than advertising a discount that isn't there.
   */
  function yearlyLine(plan) {
    var yearly = Number(plan.yearlyPrice);
    var monthly = Number(plan.monthlyPrice);
    if (!isFinite(yearly) || !isFinite(monthly) || yearly <= 0) return '';

    var saving = monthly * 12 - yearly;
    if (saving <= 0) return '';                   // no discount — don't imply one

    return (
      '<p class="plan-yearly">or ₹' + yearly.toLocaleString('en-IN') + '/year ' +
      '<span class="plan-save">save ₹' + Math.round(saving).toLocaleString('en-IN') + '</span></p>'
    );
  }

  function card(plan) {
    var popular = plan.planType === 'Pro';
    var features = [
      item(limit(plan.maxCustomers, 'customers')),
      item(limit(plan.maxUsers, 'team members')),
      item(limit(plan.maxDeliveryBoys, 'delivery boys')),
      item('Orders, deliveries & invoicing'),
    ];

    TIER_FEATURES.forEach(function (f) {
      if (atLeastTier(plan.planType, f.minTier)) features.push(item(f.label));
    });

    if (plan.customRolesEnabled) features.push(item('Custom roles & permissions'));

    Object.keys(COMING_SOON).forEach(function (flag) {
      if (plan[flag]) features.push(item(COMING_SOON[flag], true));
    });

    return (
      '<div class="plan' + (popular ? ' is-popular' : '') + '">' +
        '<div class="plan-head">' +
          '<h3>' + escape(plan.name) + '</h3>' +
          (popular ? '<span class="badge">Most popular</span>' : '') +
        '</div>' +
        '<div class="plan-price">' +
          '<span class="amount">₹' + plan.monthlyPrice.toLocaleString('en-IN') + '</span>' +
          '<span class="per">/month</span>' +
        '</div>' +
        yearlyLine(plan) +
        '<ul>' + features.join('') + '</ul>' +
        '<a class="btn ' + (popular ? 'btn-primary' : 'btn-ghost') + '" href="' + appUrl + '/register">' +
          'Start free trial' +
        '</a>' +
      '</div>'
    );
  }

  fetch(apiUrl + '/plans', { headers: { Accept: 'application/json' } })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (body) {
      var plans = (body && body.data) || [];
      if (!plans.length) return; // Keep the fallback rather than render an empty grid.
      grid.innerHTML = plans.map(card).join('');
      grid.classList.remove('plans-fallback');
      grid.classList.add('plans');
    })
    .catch(function () {
      /* Offline or API down — the static fallback cards remain on screen. */
    });
})();
