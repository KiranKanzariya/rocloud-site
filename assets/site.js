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

  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function escape(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /** The plans table uses 0 to mean unlimited. */
  function limit(count, noun) {
    return count === 0 ? 'Unlimited ' + noun : count.toLocaleString('en-IN') + ' ' + noun;
  }

  function item(label, soon) {
    return (
      '<li' + (soon ? ' class="is-soon"' : '') + '>' + CHECK + '<span>' + escape(label) + '</span>' +
      (soon ? '<span class="badge badge-soon">Coming soon</span>' : '') +
      '</li>'
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
