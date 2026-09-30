/* ═══════════════════════════════════════════════════════════════════
   language.js  —  Mr. Ahmed Hassan | Educational Platform
   Phase 4: English / Arabic Language Switcher (RTL support)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';
  var root = document.documentElement;

  var LABELS = {
    en: { switchLabel: 'عربي', toggleAria: 'Switch to Arabic language' },
    ar: { switchLabel: 'English', toggleAria: 'التبديل إلى اللغة الإنجليزية' }
  };

  /* ── Resolve initial language ───────────────────────────────────── */
  function getPreferredLang() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }

    if (stored === 'en' || stored === 'ar') {
      return stored;
    }

    return DEFAULT_LANG;
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  /* ── Apply language: swap text nodes, dir, html attrs, labels ──── */
  function applyLanguage(lang) {
    var isAr = lang === 'ar';

    root.setAttribute('lang', isAr ? 'ar' : 'en');
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    root.setAttribute('data-lang', lang);

    /* Swap every element carrying data-en / data-ar */
    var nodes = document.querySelectorAll('[data-en]');
    nodes.forEach(function (el) {
      var text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (text !== null && text !== undefined) {
        el.textContent = text;
      }
    });

    /* Swap placeholder text where data-en-placeholder / data-ar-placeholder exist */
    var placeholderNodes = document.querySelectorAll('[data-en-placeholder]');
    placeholderNodes.forEach(function (el) {
      var ph = isAr
        ? el.getAttribute('data-ar-placeholder')
        : el.getAttribute('data-en-placeholder');
      if (ph !== null && ph !== undefined) {
        el.setAttribute('placeholder', ph);
      }
    });

    /* Swap aria-label text where data-en-aria / data-ar-aria exist */
    var ariaNodes = document.querySelectorAll('[data-en-aria]');
    ariaNodes.forEach(function (el) {
      var label = isAr ? el.getAttribute('data-ar-aria') : el.getAttribute('data-en-aria');
      if (label !== null && label !== undefined) {
        el.setAttribute('aria-label', label);
      }
    });

    /* Update language-toggle button labels (header + footer) */
    var labelSet = isAr ? LABELS.ar : LABELS.en;

    var langLabelEls = document.querySelectorAll('#lang-label, #footer-lang-label');
    langLabelEls.forEach(function (el) {
      el.textContent = labelSet.switchLabel;
    });

    var langToggleButtons = document.querySelectorAll('.lang-toggle');
    langToggleButtons.forEach(function (btn) {
      btn.setAttribute('aria-label', labelSet.toggleAria);
    });

    /* Update <title> if it carries data-en / data-ar (optional support) */
    var titleEl = document.querySelector('title[data-en]');
    if (titleEl) {
      document.title = isAr
        ? titleEl.getAttribute('data-ar')
        : titleEl.getAttribute('data-en');
    }
  }

  function toggleLanguage() {
    var current = root.getAttribute('data-lang') === 'ar' ? 'ar' : 'en';
    var next = current === 'ar' ? 'en' : 'ar';
    applyLanguage(next);
    storeLang(next);
  }

  /* ── Apply language as early as possible (before paint) ─────────── */
  applyLanguage(getPreferredLang());

  /* ── Wire up toggle buttons once DOM is ready ───────────────────── */
  function init() {
    var toggleButtons = document.querySelectorAll('.lang-toggle');
    toggleButtons.forEach(function (btn) {
      btn.addEventListener('click', toggleLanguage);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
