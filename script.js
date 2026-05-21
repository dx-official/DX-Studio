/* ===================================
   DX STUDIO — script.js
   =================================== */

(function () {
  'use strict';

  /* ===== UTILITY ===== */
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }
  function qsa(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  /* ===== 1. NAVBAR SCROLL SHADOW ===== */
  var navbar = qs('#navbar');
  if (navbar) {
    function handleNavScroll() {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run on load
  }

  /* ===== 2. ACTIVE NAV LINK ON SCROLL ===== */
  var sections = qsa('section[id]');
  var navLinks = qsa('.nav-link');

  function setActiveLink() {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ===== 3. HAMBURGER MENU ===== */
  var hamburger = qs('#hamburger');
  var navMenu = qs('#navLinks');

  function openMenu() {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when a nav link is clicked
    qsa('.nav-link', navMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* ===== 4. FAQ ACCORDION ===== */
  var faqItems = qsa('.faq-item');

  faqItems.forEach(function (item) {
    var btn = qs('.faq-question', item);
    var answer = qs('.faq-answer', item);
    if (!btn || !answer) return;

    // Remove hidden attr initially so CSS max-height transition works
    answer.removeAttribute('hidden');

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          var otherBtn = qs('.faq-question', other);
          var otherAnswer = qs('.faq-answer', other);
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = '';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ===== 5. SCROLL TO TOP BUTTON ===== */
  var scrollTopBtn = qs('#scrollTop');
  if (scrollTopBtn) {
    function handleScrollTopVisibility() {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
    handleScrollTopVisibility();

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== 6. SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  qsa('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = qs(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navbar ? navbar.offsetHeight : 0;
        var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  /* ===== 7. ENTRY ANIMATIONS (IntersectionObserver) ===== */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Cards to animate on scroll
    var animTargets = qsa(
      '.service-card, .why-card, .portfolio-item, .testi-card, .contact-card, .highlight-item'
    );

    animTargets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .55s ease ' + (i % 4 * 0.08) + 's, transform .55s ease ' + (i % 4 * 0.08) + 's';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animTargets.forEach(function (el) {
      observer.observe(el);
    });

    // Section headers
    var headerTargets = qsa('.section-header, .about-text, .about-visual, .hero-text, .hero-visual');
    headerTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });

    var headerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          headerObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    headerTargets.forEach(function (el) {
      headerObs.observe(el);
    });
  }

})();
