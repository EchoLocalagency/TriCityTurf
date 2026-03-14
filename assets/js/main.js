/* ============================================
   TRI-CITY SYNTHETIC TURF - Main JS
   ============================================ */

(function() {
  'use strict';

  /* --- Top Bar Hide on Scroll --- */
  const topBar = document.querySelector('.top-bar');
  let lastScrollY = 0;

  if (topBar) {
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        topBar.classList.add('hidden');
      } else {
        topBar.classList.remove('hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /* --- Navbar Shadow on Scroll --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* --- Mobile Menu --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  function openMobileNav() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  /* Mobile close button */
  var mobileNavClose = document.querySelector('.mobile-nav-close');
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  /* Mobile submenu expand */
  document.querySelectorAll('.submenu-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.classList.toggle('open');
      var submenu = this.nextElementSibling;
      if (submenu) submenu.classList.toggle('open');
    });
  });

  /* Close mobile nav on link click */
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* --- Scroll Reveal (IntersectionObserver) --- */
  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show all */
    revealElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.parentElement;
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      /* Close all others in same list */
      var parent = item.parentElement;
      parent.querySelectorAll('.faq-item.open').forEach(function(openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* --- Gallery Lightbox --- */
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  var galleryItems = document.querySelectorAll('.gallery-item');
  var currentIndex = 0;
  var galleryImages = [];

  galleryItems.forEach(function(item, index) {
    var img = item.querySelector('img');
    if (img) {
      galleryImages.push(img.src);
      item.addEventListener('click', function() {
        currentIndex = index;
        openLightbox(img.src);
      });
    }
  });

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nextImage() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex];
  }

  function prevImage() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex];
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* Keyboard nav for lightbox */
  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  /* --- Gallery Filter Buttons --- */
  document.querySelectorAll('.gallery-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.gallery-filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');

      var filter = this.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(function(item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* --- Contact Form Handler --- */
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      /* Hide form, show success */
      contactForm.style.display = 'none';
      var success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
    });
  }

})();
