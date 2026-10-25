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

  // Highlight the nav link of the section in view.
  var links = document.querySelectorAll('.site-nav a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        byId[entry.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
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
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearAnalyticsCookies() {
    var host = location.hostname;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      [host, '.' + host.replace(/^www\./, '')].forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain;
      });
    });
  }

  if (banner) {
    var state = read();
    if (state === 'granted') loadAnalytics();
    else if (state !== 'denied') banner.hidden = false;

    document.querySelectorAll('[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var choice = btn.dataset.consent;
        var wasGranted = read() === 'granted';
        write(choice);
        banner.hidden = true;
        if (choice === 'granted') loadAnalytics();
        else if (wasGranted) { clearAnalyticsCookies(); location.reload(); }
      });
    });
    document.querySelectorAll('[data-consent-open]').forEach(function (btn) {
      btn.addEventListener('click', function () { banner.hidden = false; });
    });
  }
}());
