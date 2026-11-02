/* Small progressive enhancement: theme preference + active navigation. */
(function () {
  'use strict';
  var STORAGE_KEY = 'govind_portfolio_theme';
  var root = document.documentElement;

  function readSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (error) { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (error) { /* Storage may be unavailable. */ }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var button = document.getElementById('theme-toggle');
    if (!button) return;
    var label = theme === 'dark' ? 'Use light theme' : 'Use dark theme';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    var text = button.querySelector('.toggle-text');
    var icon = button.querySelector('.toggle-icon');
    if (text) text.textContent = theme === 'dark' ? 'Light' : 'Dark';
    if (icon) icon.textContent = theme === 'dark' ? '☼' : '◐';
  }

  function init() {
    var saved = readSavedTheme();
    applyTheme(saved === 'dark' || saved === 'light' ? saved : systemTheme());

    var button = document.getElementById('theme-toggle');
    if (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        saveTheme(next);
      });
    }

    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      if (link.getAttribute('href') === page) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (window.matchMedia) {
      var media = window.matchMedia('(prefers-color-scheme: dark)');
      var sync = function (event) {
        if (!readSavedTheme()) applyTheme(event.matches ? 'dark' : 'light');
      };
      if (media.addEventListener) media.addEventListener('change', sync);
      else if (media.addListener) media.addListener(sync);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
