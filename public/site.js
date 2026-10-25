(function () {
  'use strict';

  // Email address is assembled at runtime so scrapers don't find it in the HTML.
  document.querySelectorAll('a.mail').forEach(function (a) {
    var address = a.dataset.user + '@' + a.dataset.domain;
    a.href = 'mailto:' + address;
    if (!a.classList.contains('button')) a.textContent = address;
  });

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Highlight the nav link of the section in view. Deterministic: the last section whose top
  // has passed 40% of the viewport wins; at the very bottom the last section wins.
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  if (links.length && sections.every(Boolean)) {
    var ticking = false;
    var updateNav = function () {
      ticking = false;
      var line = window.innerHeight * 0.4;
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      var current = -1;
      sections.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) current = i; });
      if (atBottom) current = sections.length - 1;
      links.forEach(function (a, i) {
        if (i === current) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    };
    var requestUpdate = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateNav); }
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    updateNav();
  }

  // Google Analytics only loads after explicit consent.
  var GA_ID = 'G-C1W7Z8S337';
  var KEY = 'analytics-consent';
  var banner = document.getElementById('consent');

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* stay session-only */ }
  }
  function loadAnalytics() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearAnalyticsCookies() {
    // GA sets host-only or parent-domain cookies depending on the host, so try every form.
    var parts = location.hostname.split('.');
    var scopes = [''];
    for (var i = 0; i < Math.max(1, parts.length - 1); i++) {
      var domain = parts.slice(i).join('.');
      scopes.push('; domain=' + domain, '; domain=.' + domain);
    }
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      scopes.forEach(function (scope) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + scope;
      });
    });
  }

  if (banner) {
    var state = read();
    if (state === 'granted') loadAnalytics();
    else {
      clearAnalyticsCookies();           // sweep anything left over from an earlier choice
      if (state !== 'denied') banner.hidden = false;
    }

    document.querySelectorAll('[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var choice = btn.dataset.consent;
        var wasLoaded = typeof window.gtag === 'function';
        write(choice);
        banner.hidden = true;
        if (choice === 'granted') loadAnalytics();
        else if (wasLoaded) {
          window['ga-disable-' + GA_ID] = true;   // Google's opt-out switch, stops any pending hit
          clearAnalyticsCookies();
          location.reload();
        }
      });
    });
    document.querySelectorAll('[data-consent-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { banner.hidden = false; });
    });
  }
}());
