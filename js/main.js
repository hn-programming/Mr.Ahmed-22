/* ═══════════════════════════════════════════════════════════════════
   main.js  —  Mr. Ahmed Hassan | Educational Platform
   Phase 4: Core Site Interactions
   ═══════════════════════════════════════════════════════════════════

   TABLE OF CONTENTS
   01. Loading Screen
   02. Header Scroll State
   03. Desktop Dropdown (Years)
   04. Mobile Menu + Accordion
   05. Scroll-Triggered Animations (IntersectionObserver)
   06. Testimonials Carousel
   07. Contact Form Validation
   08. Scroll-To-Top Button
   09. Smooth Anchor Scrolling (header offset)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initLoadingScreen();
    initHeaderScrollState();
    initDesktopDropdown();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialsCarousel();
    initContactForm();
    initScrollToTop();
    initAnchorScrollOffset();
  });

  /* ═══════════════════════════════════════════════════════════════
     01. LOADING SCREEN
     ═══════════════════════════════════════════════════════════════ */
  function initLoadingScreen() {
    var loader = document.getElementById('loading-screen');
    if (!loader) return;

    function hideLoader() {
      loader.classList.add('hidden');
      loader.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        if (loader.parentNode) {
          loader.style.display = 'none';
        }
      }, 600);
    }

    /* Hide once everything (images, fonts, etc.) has loaded, with a
       minimum display time so the animation isn't jarring on fast
       connections, and a maximum fallback in case 'load' is delayed. */
    var minDelay = 700;
    var start = Date.now();

    function attemptHide() {
      var elapsed = Date.now() - start;
      var remaining = Math.max(minDelay - elapsed, 0);
      window.setTimeout(hideLoader, remaining);
    }

    if (document.readyState === 'complete') {
      attemptHide();
    } else {
      window.addEventListener('load', attemptHide);
    }

    /* Safety fallback: never let the loader block the site for more
       than 4 seconds. */
    window.setTimeout(hideLoader, 4000);
  }

  /* ═══════════════════════════════════════════════════════════════
     02. HEADER SCROLL STATE
     ═══════════════════════════════════════════════════════════════ */
  function initHeaderScrollState() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var threshold = 12;
    var ticking = false;

    function updateHeaderState() {
      if (window.scrollY > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    }

    updateHeaderState();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════
     03. DESKTOP DROPDOWN (Years)
     ═══════════════════════════════════════════════════════════════ */
  function initDesktopDropdown() {
    var trigger = document.querySelector('.nav-dropdown-trigger');
    var dropdown = document.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    function open() {
      trigger.setAttribute('aria-expanded', 'true');
    }

    function close() {
      trigger.setAttribute('aria-expanded', 'false');
    }

    function toggle(e) {
      e.preventDefault();
      var expanded = trigger.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        close();
      } else {
        open();
      }
    }

    trigger.addEventListener('click', toggle);

    /* Keyboard / focus: close on outside click */
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        close();
      }
    });

    /* Close on Escape */
    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        close();
        trigger.focus();
      }
    });

    /* Close dropdown when a link inside it is activated */
    var dropdownLinks = dropdown.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(function (link) {
      link.addEventListener('click', close);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     04. MOBILE MENU + ACCORDION
     ═══════════════════════════════════════════════════════════════ */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    function toggleMenu() {
      var isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    /* Close menu when a top-level (non-accordion) link is clicked */
    var mobileLinks = mobileMenu.querySelectorAll(
      '.mobile-nav-link:not(.mobile-accordion-trigger), .mobile-sub-link, .mobile-nav-cta a'
    );
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    /* Close on resize past the tablet breakpoint */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    /* — Mobile accordion (Years submenu) — */
    var accordionTrigger = mobileMenu.querySelector('.mobile-accordion-trigger');
    var subMenu = mobileMenu.querySelector('.mobile-sub-menu');

    if (accordionTrigger && subMenu) {
      accordionTrigger.addEventListener('click', function () {
        var expanded = accordionTrigger.getAttribute('aria-expanded') === 'true';
        accordionTrigger.setAttribute('aria-expanded', String(!expanded));
        subMenu.classList.toggle('open');
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     05. SCROLL-TRIGGERED ANIMATIONS
     ═══════════════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    var animatedEls = document.querySelectorAll('[data-animate]');
    if (!animatedEls.length) return;

    /* Apply delay classes from data-delay attribute */
    animatedEls.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) {
        el.classList.add('delay-' + delay);
      }
    });

    if (!('IntersectionObserver' in window)) {
      /* Fallback: reveal everything immediately */
      animatedEls.forEach(function (el) {
        el.classList.add('in-view');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     06. TESTIMONIALS CAROUSEL
     ═══════════════════════════════════════════════════════════════ */
  function initTestimonialsCarousel() {
    var track = document.getElementById('testimonials-track');
    var prevBtn = document.getElementById('testimonials-prev');
    var nextBtn = document.getElementById('testimonials-next');
    var dotsContainer = document.getElementById('testimonials-dots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    var cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    var currentIndex = 0;
    var visibleCount = getVisibleCount();
    var autoplayTimer = null;
    var autoplayDelay = 6000;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 768) return 1;
      if (w <= 1024) return 2;
      if (w <= 1280) return 3;
      return 4;
    }

    function maxIndex() {
      return Math.max(cards.length - visibleCount, 0);
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      var dotCount = maxIndex() + 1;
      for (var i = 0; i < dotCount; i++) {
        var dot = document.createElement('button');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial group ' + (i + 1));
        dot.setAttribute('type', 'button');
        (function (idx) {
          dot.addEventListener('click', function () {
            goTo(idx);
            restartAutoplay();
          });
        })(i);
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      var dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function updateTrack() {
      var isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      var cardWidth = cards[0].getBoundingClientRect().width;
      var gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      var offset = currentIndex * (cardWidth + gap);
      track.style.transform = 'translateX(' + (isRTL ? offset : -offset) + 'px)';
    }

    function goTo(index) {
      currentIndex = Math.min(Math.max(index, 0), maxIndex());
      updateTrack();
      updateDots();
    }

    function next() {
      var nextIndex = currentIndex + 1 > maxIndex() ? 0 : currentIndex + 1;
      goTo(nextIndex);
    }

    function prev() {
      var prevIndex = currentIndex - 1 < 0 ? maxIndex() : currentIndex - 1;
      goTo(prevIndex);
    }

    function startAutoplay() {
      if (maxIndex() === 0) return;
      autoplayTimer = window.setInterval(next, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    nextBtn.addEventListener('click', function () {
      next();
      restartAutoplay();
    });

    prevBtn.addEventListener('click', function () {
      prev();
      restartAutoplay();
    });

    /* Pause on hover / focus within the carousel region */
    var wrapper = track.closest('.testimonials-track-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoplay);
      wrapper.addEventListener('mouseleave', startAutoplay);
      wrapper.addEventListener('focusin', stopAutoplay);
      wrapper.addEventListener('focusout', startAutoplay);
    }

    /* Basic touch swipe support */
    var touchStartX = 0;
    var touchEndX = 0;

    track.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      },
      { passive: true }
    );

    track.addEventListener(
      'touchend',
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var delta = touchEndX - touchStartX;
        var isRTL = document.documentElement.getAttribute('dir') === 'rtl';

        if (Math.abs(delta) > 40) {
          if ((delta < 0 && !isRTL) || (delta > 0 && isRTL)) {
            next();
          } else {
            prev();
          }
        }
        startAutoplay();
      },
      { passive: true }
    );

    /* Recalculate on resize */
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        var newVisibleCount = getVisibleCount();
        if (newVisibleCount !== visibleCount) {
          visibleCount = newVisibleCount;
          buildDots();
        }
        currentIndex = Math.min(currentIndex, maxIndex());
        updateTrack();
        updateDots();
      }, 150);
    });

    /* Recalculate position on language change (RTL flip) */
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.setTimeout(updateTrack, 50);
      });
    });

    buildDots();
    updateTrack();
    startAutoplay();
  }

  /* ═══════════════════════════════════════════════════════════════
     07. CONTACT FORM VALIDATION
     ═══════════════════════════════════════════════════════════════ */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var nameInput = document.getElementById('contact-name');
    var phoneInput = document.getElementById('contact-phone');
    var emailInput = document.getElementById('contact-email');
    var subjectSelect = document.getElementById('contact-subject');
    var messageInput = document.getElementById('contact-message');
    var submitBtn = document.getElementById('contact-submit');
    var successEl = document.getElementById('contact-success');

    var isRTL = function () {
      return document.documentElement.getAttribute('dir') === 'rtl';
    };

    var ERRORS = {
      nameRequired: { en: 'Please enter your name.', ar: 'يرجى إدخال اسمك.' },
      emailRequired: { en: 'Please enter your email address.', ar: 'يرجى إدخال بريدك الإلكتروني.' },
      emailInvalid: { en: 'Please enter a valid email address.', ar: 'يرجى إدخال بريد إلكتروني صحيح.' },
      messageRequired: { en: 'Please enter a message.', ar: 'يرجى إدخال رسالة.' },
      messageShort: { en: 'Message must be at least 10 characters.', ar: 'يجب ألا تقل الرسالة عن 10 أحرف.' }
    };

    function setError(input, errorEl, errorObj) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = errorObj ? (isRTL() ? errorObj.ar : errorObj.en) : '';
      }
    }

    function clearError(input, errorEl) {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.textContent = '';
      }
    }

    function validateName() {
      var errorEl = document.getElementById('contact-name-error');
      var value = nameInput.value.trim();
      if (!value) {
        setError(nameInput, errorEl, ERRORS.nameRequired);
        return false;
      }
      clearError(nameInput, errorEl);
      return true;
    }

    function validateEmail() {
      var errorEl = document.getElementById('contact-email-error');
      var value = emailInput.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        setError(emailInput, errorEl, ERRORS.emailRequired);
        return false;
      }
      if (!emailPattern.test(value)) {
        setError(emailInput, errorEl, ERRORS.emailInvalid);
        return false;
      }
      clearError(emailInput, errorEl);
      return true;
    }

    function validateMessage() {
      var errorEl = document.getElementById('contact-message-error');
      var value = messageInput.value.trim();

      if (!value) {
        setError(messageInput, errorEl, ERRORS.messageRequired);
        return false;
      }
      if (value.length < 10) {
        setError(messageInput, errorEl, ERRORS.messageShort);
        return false;
      }
      clearError(messageInput, errorEl);
      return true;
    }

    /* Live validation on blur */
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    /* Clear error as the user types */
    nameInput.addEventListener('input', function () {
      if (nameInput.classList.contains('error')) validateName();
    });
    emailInput.addEventListener('input', function () {
      if (emailInput.classList.contains('error')) validateEmail();
    });
    messageInput.addEventListener('input', function () {
      if (messageInput.classList.contains('error')) validateMessage();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isNameValid = validateName();
      var isEmailValid = validateEmail();
      var isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        var firstInvalid = form.querySelector('.error');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      /* Simulate submission (no backend wired up in this phase) */
      submitBtn.setAttribute('disabled', 'true');

      window.setTimeout(function () {
        form.reset();
        [nameInput, emailInput, phoneInput, subjectSelect, messageInput].forEach(function (el) {
          if (el) clearError(el, null);
        });

        form.hidden = true;
        if (successEl) {
          successEl.hidden = false;
        }

        submitBtn.removeAttribute('disabled');

        /* Reset back to the form after a delay so the user can send
           another message if desired. */
        window.setTimeout(function () {
          if (successEl) successEl.hidden = true;
          form.hidden = false;
        }, 5000);
      }, 900);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     08. SCROLL-TO-TOP BUTTON
     ═══════════════════════════════════════════════════════════════ */
  function initScrollToTop() {
    var btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    var threshold = 480;
    var ticking = false;

    function updateVisibility() {
      btn.hidden = window.scrollY <= threshold;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    }

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     09. SMOOTH ANCHOR SCROLLING (header offset)
     ═══════════════════════════════════════════════════════════════ */
  function initAnchorScrollOffset() {
    var header = document.getElementById('site-header');

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var hash = link.getAttribute('href');
        if (!hash || hash === '#') return;

        var target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        var headerHeight = header ? header.getBoundingClientRect().height : 0;
        var targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        /* Move focus for accessibility once scrolling settles */
        window.setTimeout(function () {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }, 500);
      });
    });
  }
})();
