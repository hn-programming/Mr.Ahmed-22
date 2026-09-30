/* ═══════════════════════════════════════════════════════════════════
   darkmode.js  —  Mr. Ahmed Hassan | Educational Platform
   Phase 4: Dark Mode System (localStorage persisted)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var root = document.documentElement;

  /* ── Resolve initial theme ──────────────────────────────────────
     Priority: localStorage > prefers-color-scheme > 'light' default.
     This runs immediately (script is not deferred-blocking critical
     paint) to avoid a flash of incorrect theme.
  ────────────────────────────────────────────────────────────────── */
  function getPreferredTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage unavailable (privacy mode, etc.) — ignore */
    }

    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);

    /* Update aria-labels on all theme toggle buttons */
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore storage errors */
    }
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }

  /* ── Apply theme as early as possible ───────────────────────────── */
  applyTheme(getPreferredTheme());

  /* ── Wire up toggle buttons once DOM is ready ───────────────────── */
  function init() {
    var toggleButtons = document.querySelectorAll('.theme-toggle');
    toggleButtons.forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });

    /* Keep in sync with system preference changes, but only if the
       user has never explicitly chosen a theme. */
    if (window.matchMedia) {
      var media = window.matchMedia('(prefers-color-scheme: dark)');
      var handleSystemChange = function (e) {
        var stored = null;
        try {
          stored = localStorage.getItem(STORAGE_KEY);
        } catch (err) { /* ignore */ }

        if (stored !== 'light' && stored !== 'dark') {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      };

      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handleSystemChange);
      } else if (typeof media.addListener === 'function') {
        /* Safari < 14 fallback */
        media.addListener(handleSystemChange);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
