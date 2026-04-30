/* ═══════════════════════════════════════════════════════════
   OM GOHIL Portfolio — script.js
   Scroll Reveal · Custom Cursor · Nav · Filters · Form
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────── UTILITY ─────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId  = null;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring lerps behind
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale ring on interactive elements
  const interactives = 'a, button, .filter-btn, .chip, .social-btn, input, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      ring.style.width        = '48px';
      ring.style.height       = '48px';
      ring.style.borderColor  = 'var(--accent-cyan)';
      ring.style.mixBlendMode = 'normal';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      ring.style.width        = '32px';
      ring.style.height       = '32px';
      ring.style.borderColor  = 'rgba(0, 212, 255, 0.5)';
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ═══════════════════════════════════════
   2. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════ */
(function initScrollReveal() {
  const revealEls = qsa('.reveal-up, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el); // fire once
    });
  }, {
    threshold:   0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════
   3. NAVBAR — scroll state + mobile menu
══════════════════════════════════════ */
(function initNav() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  if (!navbar) return;

  // Scrolled class for stronger bg
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    qsa('.nav-link', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  // Active nav link highlight on scroll
  const sections   = qsa('section[id]');
  const navLinkEls = qsa('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle(
            'active-link',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
})();


/* ═══════════════════════════════════════
   4. PROJECT FILTER
══════════════════════════════════════ */
(function initFilter() {
  const filterBtns = qsa('.filter-btn');
  const cards      = qsa('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Stagger re-reveal
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ═══════════════════════════════════════
   5. SMOOTH SCROLL (anchor links)
══════════════════════════════════════ */
(function initSmoothScroll() {
  const NAV_H = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
    10
  );

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id     = anchor.getAttribute('href');
    const target = qs(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ═══════════════════════════════════════
   6. CONTACT FORM (demo handler)
══════════════════════════════════════ */
(function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const name = form.name.value.trim();
    const email= form.email.value.trim();
    const msg  = form.message.value.trim();

    // Basic validation
    if (!name || !email || !msg) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      shakeForm(form.email);
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.8s linear infinite">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Sending...
    `;

    // Simulate async send (replace with fetch to your endpoint / EmailJS / Formspree)
    await fakeDelay(1400);

    // ─── TO WIRE UP A REAL FORM BACKEND: ───
    // Option A — Formspree:
    //   Change <form> action="https://formspree.io/f/YOUR_ID" method="POST"
    //   and remove this JS handler, OR use their fetch API:
    //
    // const res = await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, message: msg }),
    // });
    //
    // Option B — EmailJS:
    //   emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form)
    // ────────────────────────────────────────

    // Success UI
    form.reset();
    btn.disabled = false;
    btn.innerHTML = `<span>Send Message</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

    if (success) {
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 5000);
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 500);
  }

  function fakeDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();


/* ═══════════════════════════════════════
   7. NUMBER COUNT-UP ANIMATION
══════════════════════════════════════ */
(function initCountUp() {
  // Usage: give any element data-countup="12500" data-suffix="K"
  // The yt-stat elements with real numbers will animate when visible.
  // Example: <span class="yt-stat-num" data-countup="12500" data-suffix="">—</span>
  // For now this watches for the attribute and fires when scrolled into view.

  const countEls = qsa('[data-countup]');
  if (!countEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.countup, 10);
      const suffix = el.dataset.suffix || '';
      countUp(el, target, suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => observer.observe(el));

  function countUp(el, target, suffix) {
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const value    = Math.floor(eased * target);
      el.textContent = formatNum(value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function formatNum(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  }
})();


/* ═══════════════════════════════════════
   8. PARALLAX — subtle orb shift on mouse
══════════════════════════════════════ */
(function initParallax() {
  const orbs = qsa('.orb');
  if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  document.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;

      orbs.forEach((orb, i) => {
        const depth  = (i + 1) * 6; // different layers
        const dx     = cx * depth;
        const dy     = cy * depth;
        orb.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      ticking = false;
    });
  });
})();


/* ═══════════════════════════════════════
   9. INJECT SPIN KEYFRAME & SHAKE KEYFRAME
══════════════════════════════════════ */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
    .nav-link.active-link {
      color: var(--text-primary) !important;
    }
    .nav-link.active-link::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);
})();


/* ═══════════════════════════════════════
   10. PAGE LOAD ENTRANCE
══════════════════════════════════════ */
(function initPageLoad() {
  // Stagger hero elements that are already in viewport on load
  const heroReveals = qsa('.hero .reveal-up, .hero .reveal-right');
  heroReveals.forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10) + 200; // base 200ms after load
    setTimeout(() => el.classList.add('visible'), delay);
  });
})();


/* ═══════════════════════════════════════
   11. ACTIVE SECTION INDICATOR (title bar)
══════════════════════════════════════ */
(function initTitleSync() {
  const baseTitle = document.title;
  const sections  = qsa('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id    = entry.target.id;
        const label = {
          hero:     'ANIRECOM',
          about:    'About — ANIRECOM',
          projects: 'Work — ANIRECOM',
          youtube:  'Channel — ANIRECOM',
          contact:  'Contact — ANIRECOM',
        }[id] || baseTitle;
        document.title = label;
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
})();
