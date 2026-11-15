/**
 * Balasubramanian PG - Portfolio Website
 * Ultra-Lean Modern Vanilla JavaScript (Zero Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Sticky Navigation & Scroll Spy
  // =========================================================================
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  
  // Throttle scroll check with requestAnimationFrame
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ScrollSpy via IntersectionObserver
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // =========================================================================
  // 2. Mobile Navigation Toggle
  // =========================================================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navList.classList.contains('is-open');
      navList.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // =========================================================================
  // 3. High-Performance Native CSS Scroll-Snap Carousel
  // =========================================================================
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('[data-direction="previous"]');
    const nextBtn = carousel.querySelector('[data-direction="next"]');
    const markersNav = carousel.querySelector('.carousel-markers');
    const statusRegion = carousel.querySelector('[role="status"]');

    if (track && slides.length > 0) {
      let currentIndex = 0;
      const totalSlides = slides.length;
      const markerButtons = [];

      // Generate marker buttons
      if (markersNav) {
        markersNav.innerHTML = '';
        slides.forEach((slide, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'carousel-marker-btn';
          btn.setAttribute('aria-label', `Go to slide ${idx + 1} of ${totalSlides}`);
          if (idx === 0) btn.setAttribute('aria-current', 'true');
          btn.addEventListener('click', () => {
            scrollToSlide(idx);
          });
          markersNav.appendChild(btn);
          markerButtons.push(btn);
        });
      }

      // Smooth scroll to slide
      const scrollToSlide = (index) => {
        if (index < 0 || index >= totalSlides) return;
        const targetSlide = slides[index];
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        track.scrollTo({
          left: targetSlide.offsetLeft - track.offsetLeft,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        updateActiveMarker(index);
      };

      // Update active marker & arrow disabled state
      const updateActiveMarker = (index) => {
        currentIndex = index;
        markerButtons.forEach((btn, idx) => {
          if (idx === index) {
            btn.setAttribute('aria-current', 'true');
          } else {
            btn.removeAttribute('aria-current');
          }
        });

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === totalSlides - 1;

        if (statusRegion) {
          statusRegion.textContent = `Slide ${index + 1} of ${totalSlides}`;
        }
      };

      // Wire arrow buttons
      prevBtn?.addEventListener('click', () => {
        if (currentIndex > 0) scrollToSlide(currentIndex - 1);
      });

      nextBtn?.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) scrollToSlide(currentIndex + 1);
      });

      // Track current slide during scroll
      let scrollTimeout;
      const onTrackScroll = () => {
        const scrollLeft = track.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const nearestIndex = Math.round(scrollLeft / (slideWidth + 24)); // 24px gap

        if (nearestIndex >= 0 && nearestIndex < totalSlides && nearestIndex !== currentIndex) {
          updateActiveMarker(nearestIndex);
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const finalIndex = Math.round(track.scrollLeft / (slides[0].offsetWidth + 24));
          if (finalIndex >= 0 && finalIndex < totalSlides) {
            updateActiveMarker(finalIndex);
          }
        }, 60);
      };

      track.addEventListener('scroll', onTrackScroll, { passive: true });
      updateActiveMarker(0);
    }
  }

  // =========================================================================
  // 4. Contact Form Handling
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value || 'there';
      alert(`Thank you, ${name}! Your message has been received. I will get back to you shortly.`);
      contactForm.reset();
    });
  }
});
