/**
 * AURELIA CLINICAL AESTHETICS — AUTHENTICATION & PORTAL STATE
 */

const AureliaAuth = {
  get currentUser() {
    const data = localStorage.getItem('aurelia_user');
    return data ? JSON.parse(data) : null;
  },

  set currentUser(user) {
    if (user) {
      localStorage.setItem('aurelia_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aurelia_user');
    }
    this.updateNavState();
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  login(email, password) {
    // Demo verification
    if (!email || !password) return { success: false, message: 'Please provide both email and password.' };

    const user = {
      name: 'Evelyn Vance',
      email: email,
      membershipTier: 'Haute Prestige VIP',
      memberSince: 'October 2024',
      avatar: 'assets/images/provider_director.jpg'
    };

    this.currentUser = user;
    return { success: true, user };
  },

  logout() {
    this.currentUser = null;
    window.location.href = 'login.html';
  },

  updateNavState() {
    const user = this.currentUser;
    const loginBtns = document.querySelectorAll('.btn-nav-login');
    const dashboardBtns = document.querySelectorAll('.btn-nav-dashboard');

    if (user) {
      loginBtns.forEach(btn => {
        btn.textContent = 'Account Profile';
        btn.href = 'dashboard.html';
      });
      dashboardBtns.forEach(btn => {
        btn.style.display = 'inline-flex';
      });
    } else {
      loginBtns.forEach(btn => {
        btn.textContent = 'Client Login';
        btn.href = 'login.html';
      });
    }
  },

  init() {
    this.updateNavState();
    this.bindLoginForm();
  },

  bindLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
          if (window.showToast) window.showToast('Please enter your email and password.', 'info');
          return;
        }

        const res = this.login(email, password);
        if (res.success) {
          if (window.showToast) window.showToast('Welcome back, Evelyn. Redirecting to your sanctuary portal...', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 800);
        }
      });

      // Quick Demo Fill
      const demoBtn = document.getElementById('btn-demo-autofill');
      if (demoBtn) {
        demoBtn.addEventListener('click', () => {
          document.getElementById('login-email').value = 'evelyn.vance@aureliaclinic.com';
          document.getElementById('login-password').value = 'Serenity2026!';
          if (window.showToast) window.showToast('Demo VIP credentials loaded. Click "Enter Sanctuary".', 'info');
        });
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AureliaAuth.init();
});
