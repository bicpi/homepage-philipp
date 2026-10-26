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
}());
