/**
 * AURELIA CLINICAL AESTHETICS & MED SPA — MAIN CONTROLLER
 * Theme toggle, RTL support, mobile nav, modal manager, form validation, toasts
 */

// --- Global Toast Notification Helper ---
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle (Dark / Light) with Auto-Detection & Persistence ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('aurelia_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aurelia_theme', theme);
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  if (storedTheme) {
    setTheme(storedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // --- RTL Layout Toggle ---
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedRTL = localStorage.getItem('aurelia_rtl');

  function setRTL(isRtl) {
    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem('aurelia_rtl', 'true');
    } else {
      document.documentElement.removeAttribute('dir');
      localStorage.removeItem('aurelia_rtl');
    }
    rtlToggleBtns.forEach(btn => {
      const span = btn.querySelector('.rtl-text');
      if (span) span.textContent = isRtl ? 'LTR' : 'RTL';
    });
  }

  if (storedRTL === 'true') {
    setRTL(true);
  }

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyRtl = document.documentElement.getAttribute('dir') === 'rtl';
      setRTL(!isCurrentlyRtl);
      window.showToast(isCurrentlyRtl ? 'Switched to LTR view' : 'تم تفعيل الاتجاه من اليمين لليسار (RTL)', 'info');
    });
  });

  // --- Mobile Drawer Navigation ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  // --- Interactive Before & After Slider ---
  const baSliders = document.querySelectorAll('.ba-slider-container');
  baSliders.forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const afterImage = slider.querySelector('.ba-image-after');
    const afterImgElement = afterImage ? afterImage.querySelector('img') : null;
    let isDragging = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalGesture = false;

    function setPosition(x) {
      if (typeof x !== 'number' || isNaN(x)) return;
      const rect = slider.getBoundingClientRect();
      if (!rect.width) return;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      let pos = (x - rect.left) / rect.width;
      if (pos < 0.02) pos = 0.02;
      if (pos > 0.98) pos = 0.98;

      const pct = (pos * 100).toFixed(2);
      slider.style.setProperty('--slider-pos', `${pct}%`);
      if (handle) {
        handle.style.left = `${pct}%`;
        handle.setAttribute('aria-valuenow', Math.round(pos * 100));
      }
      if (afterImage) {
        if (isRtl) {
          afterImage.style.clipPath = `inset(0 0 0 ${pct}%)`;
          afterImage.style.webkitClipPath = `inset(0 0 0 ${pct}%)`;
        } else {
          afterImage.style.clipPath = `inset(0 calc(100% - ${pct}%) 0 0)`;
          afterImage.style.webkitClipPath = `inset(0 calc(100% - ${pct}%) 0 0)`;
        }
      }
      if (afterImgElement) {
        afterImgElement.style.width = '100%';
        afterImgElement.style.height = '100%';
      }
    }

    // Set initial 50% position
    requestAnimationFrame(() => {
      const rect = slider.getBoundingClientRect();
      if (rect.width) {
        setPosition(rect.left + (rect.width * 0.5));
      }
    });

    // Mouse Events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Events - intelligent scrolling detection
    slider.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isHorizontalGesture = false;

      // Only grab immediately if user touches directly on or near the handle
      if (handle) {
        const handleRect = handle.getBoundingClientRect();
        const dist = Math.abs(touchStartX - (handleRect.left + handleRect.width / 2));
        if (dist < 44) {
          isDragging = true;
          isHorizontalGesture = true;
        }
      }
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches[0]) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = Math.abs(currentX - touchStartX);
      const dy = Math.abs(currentY - touchStartY);

      if (!isDragging && !isHorizontalGesture) {
        if (dx > 8 && dx > dy) {
          isDragging = true;
          isHorizontalGesture = true;
        } else if (dy > 8) {
          // Vertical page scroll detected; ignore slider
          return;
        }
      }

      if (isDragging || isHorizontalGesture) {
        setPosition(currentX);
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    slider.addEventListener('touchend', () => {
      isDragging = false;
      isHorizontalGesture = false;
    });

    window.addEventListener('resize', () => {
      const currentPos = parseFloat(getComputedStyle(slider).getPropertyValue('--slider-pos')) || 50;
      const rect = slider.getBoundingClientRect();
      if (rect.width) {
        setPosition(rect.left + (rect.width * (currentPos / 100)));
      }
    });
  });

  // --- Modal Manager ---
  const modals = document.querySelectorAll('.modal');
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      modals.forEach(modal => modal.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  // --- Form Validation (Booking, Contact & Inquiries) ---
  const forms = document.querySelectorAll('form[data-validate="true"]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        const val = input.value.trim();
        if (!val) {
          input.classList.add('error');
          isValid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }

        input.addEventListener('input', () => input.classList.remove('error'), { once: true });
      });

      if (isValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          const origText = submitBtn.innerHTML;
          submitBtn.innerHTML = 'Processing...';

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            form.reset();
            modals.forEach(m => m.classList.remove('active'));
            document.body.style.overflow = '';
            window.showToast('Your inquiry has been encrypted and submitted to our medical concierge. We will reach out shortly.', 'success');
          }, 800);
        }
      } else {
        window.showToast('Please correct the highlighted fields before submitting.', 'info');
      }
    });
  });

  // Newsletter forms
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(nf => {
    nf.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = nf.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        window.showToast('Thank you for subscribing to Aurelia Journal.', 'success');
        emailInput.value = '';
      }
    });
  });

  // --- Scroll Up (Back To Top) Floating Button ---
  let scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to Top');
    scrollTopBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    document.body.appendChild(scrollTopBtn);
  }

  function handleScrollTopVisibility() {
    if (window.scrollY > 280) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
  handleScrollTopVisibility();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- FAQ Accordion / Dropdown Controller ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      item.classList.toggle('active');
      trigger.setAttribute('aria-expanded', !isOpen);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
});

