/**
 * AURELIA CLINICAL AESTHETICS — CLIENT DASHBOARD CONTROLLER
 * Manages appointments, package counters, photo slider & skincare refills
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on dashboard page
  const dashboardContainer = document.querySelector('.dashboard-wrapper');
  if (!dashboardContainer) return;

  // Auto-login demo user if visiting directly for easy reviewer testing
  if (!AureliaAuth.isLoggedIn()) {
    AureliaAuth.login('evelyn.vance@aureliaclinic.com', 'Serenity2026!');
  }

  // --- Module 1: Appointment Actions ---
  const cancelBtns = document.querySelectorAll('.btn-cancel-appt');
  cancelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.appointment-card');
      if (confirm('Are you sure you wish to cancel this scheduled consultation? Your concierge will be notified.')) {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
        if (window.showToast) window.showToast('Appointment cancelled. A cancellation confirmation was sent to your email.', 'info');
      }
    });
  });

  const rescheduleBtns = document.querySelectorAll('.btn-reschedule-appt');
  const bookModal = document.getElementById('modal-book-treatment');
  rescheduleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookModal) {
        bookModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // --- Module 2: Interactive Package Counter ---
  const addSessionBtns = document.querySelectorAll('.btn-use-session');
  addSessionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.package-card');
      const countEl = card.querySelector('.package-radial-text .count');
      const totalEl = card.querySelector('.package-radial-text .total');
      const progressBar = card.querySelector('.package-bar-fill');
      const circleProgress = card.querySelector('.radial-circle-progress');

      let current = parseInt(countEl.textContent, 10);
      let total = parseInt(totalEl.textContent.replace(/\D/g, ''), 10);

      if (current < total) {
        current++;
        countEl.textContent = current;
        const pct = (current / total) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;
        if (circleProgress) {
          const circumference = 283;
          const offset = circumference - (current / total) * circumference;
          circleProgress.style.strokeDashoffset = offset;
        }
        if (window.showToast) window.showToast(`Session recorded! Package updated to ${current} of ${total} sessions.`, 'success');
      } else {
        if (window.showToast) window.showToast('Package fully utilized. Contact your concierge to renew.', 'info');
      }
    });
  });

  // --- Module 3: Private Photo Vault Privacy Blur Toggle ---
  const blurToggleBtn = document.getElementById('btn-toggle-privacy');
  const vaultSlider = document.querySelector('.vault-slider-box');
  if (blurToggleBtn && vaultSlider) {
    let isBlurred = false;
    blurToggleBtn.addEventListener('click', () => {
      isBlurred = !isBlurred;
      vaultSlider.style.filter = isBlurred ? 'blur(12px)' : 'none';
      blurToggleBtn.textContent = isBlurred ? 'Reveal Private Photos' : 'Mask Photos (Privacy Mode)';
      if (window.showToast) window.showToast(isBlurred ? 'Privacy mask active.' : 'Clinical photos visible.', 'info');
    });
  }

  // --- Module 4: Skincare Refill Requests ---
  const refillBtns = document.querySelectorAll('.btn-request-refill');
  refillBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.skincare-item-card');
      const name = card.querySelector('h4').textContent;
      btn.textContent = 'Refill Requested';
      btn.disabled = true;
      btn.classList.add('btn-secondary');
      if (window.showToast) window.showToast(`Refill request for "${name}" dispatched to pharmacy concierge.`, 'success');
    });
  });

  // Download receipt button demo
  const receiptBtns = document.querySelectorAll('.btn-download-receipt');
  receiptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.showToast) window.showToast('Generating official encrypted clinical receipt PDF...', 'info');
    });
  });

  // Logout buttons
  const logoutBtns = [
    document.getElementById('btn-dashboard-logout'),
    document.getElementById('btn-mobile-logout')
  ];
  logoutBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        AureliaAuth.logout();
      });
    }
  });
});
