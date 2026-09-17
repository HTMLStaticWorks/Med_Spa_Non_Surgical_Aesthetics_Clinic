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

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aurelia_theme', theme);
    themeToggleBtns.forEach(btn => {
      const span = btn.querySelector('.theme-text');
      if (span) span.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
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

    function updateSliderWidth() {
      if (afterImgElement) {
        afterImgElement.style.width = `${slider.offsetWidth}px`;
      }
    }
    window.addEventListener('resize', updateSliderWidth);
    updateSliderWidth();

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      let pos = (x - rect.left) / rect.width;
      if (pos < 0.05) pos = 0.05;
      if (pos > 0.95) pos = 0.95;

      const pct = (pos * 100).toFixed(2);
      if (isRtl) {
        handle.style.left = `${pct}%`;
        afterImage.style.width = `${100 - pct}%`;
      } else {
        handle.style.left = `${pct}%`;
        afterImage.style.width = `${pct}%`;
      }
    }

    function onStart(e) {
      isDragging = true;
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onMove(e) {
      if (!isDragging) return;
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onEnd() {
      isDragging = false;
    }

    slider.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    slider.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
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
});
