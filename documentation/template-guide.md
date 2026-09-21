# Aurelia Clinical Aesthetics & Med Spa — Template Documentation & Architecture Guide

**Category Classification:** Service-Based (Medical / Clinical) + Client Portal (Dashboard Gated) Hybrid Template.

---

## 1. Executive Summary & Brand Identity

**Aurelia Clinical Aesthetics** is a multi-page, clinical-chic website and client portal designed for high-end medical spas, plastic surgery practices, and non-surgical aesthetic clinics. 

### Visual Identity
- **Aesthetic Tone**: Luxurious, clinical-chic, serene, editorial, medical gravity without hospital sterility.
- **Color Palette**:
  - Warm Clinical Alabaster: `#FAF8F5`
  - Soft Cashmere Stone: `#F3EFEA`
  - Polished Champagne Gold: `#C5A880` (`#D4AF37`, `#A68960`)
  - Subdued Restorative Sage: `#758A75` (`#3E5140`)
  - Obsidian Dark Mode: `#0F1211` / `#1B211E`
- **Typography**:
  - Display / Headlines: Google Font `'Cormorant Garamond'` (luxury serif)
  - UI / Navigation / Body: Google Font `'Plus Jakarta Sans'` (clean geometric sans-serif)

---

## 2. Page & Section Architecture (Strict Compliance)

| Page | File | Section Count | Core Narrative & Features |
| :--- | :--- | :--- | :--- |
| **Home 1** | [`index.html`](../index.html) | **6 Sections** | Results-Led, Signature Treatments, 3D Tilt Cards, Before/After Slider, Testimonials, Privilege Club CTA |
| **Home 2** | [`home-2.html`](../home-2.html) | **6 Sections** | Longevity & Lifestyle-Led, 4-Step Patient Journey, Laser & Device Suite, Faculty Showcase, Skin Banking, Concierge Inquiries |
| **Treatments** | [`treatments.html`](../treatments.html) | **4 Sections** | Category Hero, Botox & Neuromodulators, Dermal Sculpting & Biostimulators, Laser & RF Matrix |
| **Providers** | [`providers.html`](../providers.html) | **4 Sections** | Medical Leadership Hero, 4 Specialist Profiles, Clinical Safety Suite, Specialist Booking Card |
| **Membership Plans** | [`memberships.html`](../memberships.html) | **4 Sections** | The Privilege Club Hero, 3 Prestige Tier Cards, Full Privilege Matrix Table, Application Form & FAQ |
| **Contact** | [`contact.html`](../contact.html) | **4 Sections** | Concierge Hero, Validated Consultation Form, Beverly Hills & Manhattan Map Cards, Pre-Procedure FAQ |
| **About Us** | [`about.html`](../about.html) | **4 Sections** | Heritage Story, 3 Architectural Pillars, Sanctuary Acoustic Tour, Quad A Accreditation Banner |
| **404 Page** | [`404.html`](../404.html) | **4 Sections** | Serenity Not Found Hero, Curated Quick Nav Cards, Featured Treatment Spotlight, Concierge Help |
| **Coming Soon** | [`coming-soon.html`](../coming-soon.html) | **4 Sections** | Live Countdown Timer Hero, VIP Founding Waitlist, Suite Sneak Peeks, Media Office Banner |
| **Client Login** | [`login.html`](../login.html) | **4 Sections** | Welcome Hero, Encrypted Auth Card with 1-Click Demo Login, Portal Privileges, Concierge Help |
| **Client Dashboard** | [`dashboard.html`](../dashboard.html) | **4 Sections** | Book & Manage Visits, Interactive Package Usage Rings, Private Photo Progress Vault, Skincare Refills & Invoices |

---

## 3. Strict Navbar Architecture

The top navigation strictly features only 4–5 core pages plus Login and Dashboard:
1. **Home** (includes smooth dropdown selector between **Home 1: Clinical Artistry** and **Home 2: Longevity Suite**)
2. **Treatments**
3. **Providers**
4. **Membership Plans**
5. **Contact**
- **Client Login** button (navigates to `login.html`, or changes to "Account Profile" when logged in)
- **Dashboard** button (features glowing green live status dot and navigates directly to `dashboard.html`)

---

## 4. Signature 3D & Interactive Elements

### 1. 3D Tilt Cards (`assets/js/tilt.js`)
- Applied to all card components (treatments, specialists, membership tiers, testimonials).
- Subtle mouse-tracking perspective tilt (`perspective: 1000px; rotateX; rotateY`) with soft skincare luminous sheen.
- **Center-aligned text and icons across ALL breakpoints** per specification.
- Gracefully disabled on mobile touch devices and low-motion preferences.

### 2. Ambient 3D Particle Canvas (`assets/js/particles.js`)
- Floating luminous serum droplets and ambient champagne light orbs.
- Non-distracting, hardware-accelerated canvas animation with subtle cursor proximity repulsion.

### 3. Interactive Before & After Comparison Slider
- Full mouse drag and touch swipe support.
- Dual label indicators ("Baseline (Day 0)" vs "60 Days Post-Protocol").

### 4. Interactive Client Portal Modules (`assets/js/dashboard.js`)
- **Appointment Actions**: Live reschedule modal and appointment cancellation with feedback toasts.
- **Package Usage Tracker**: Interactive session incrementer that dynamically updates both the radial SVG progress ring and horizontal progress bar.
- **Photo Progress Vault**: Draggable comparison slider with a "Mask Photos (Privacy Mode)" toggle button.
- **Skincare Regimen Refills**: 1-click refill request triggers with instant toast confirmations.

---

## 5. Responsive QA & Breakpoint Specifications

### Mobile (<640px)
- Hamburger toggle opens full-screen slide-in mobile drawer.
- Single-column card stacking with preserved center-alignment.
- Touch targets ≥44px for accessibility.
- Touch-enabled before/after photo slider.

### Mobile, Tablet & 1024px Viewports (up to 1024px)
- Unified mobile drawer navigation with hamburger toggle for all mobile, tablet, and 1024px screens.
- Theme (Dark/Light) and RTL toggles cleanly housed inside the mobile drawer footer.
- Dedicated 2-column card layouts preventing element squeezing.

### Desktop & Web Views (>1024px)
- Full desktop horizontal navigation bar with all links, Login, Dashboard, Theme toggle, and RTL switch visible.
- Hamburger menu is strictly hidden (`display: none !important;`).

---

## 6. Accessibility & Internationalization

- **Dark / Light Mode Toggle**: Instant switching with system preference detection (`prefers-color-scheme`) and persistent `localStorage`.
- **RTL (Right-to-Left) Support**: Native bidirectional toggle switching `dir="rtl"` on `<html>` with full CSS layout mirroring (`assets/css/rtl.css`).
- **WCAG 2.1 AA**: High-contrast ratios, `:focus-visible` gold outline rings, descriptive `aria-label` tags on all icon buttons, semantic HTML5 structure.

---

## 7. Integration Endpoints

- **Contact & Inquiry Forms**: Configured with standard POST attributes ready for Formspree (`https://formspree.io/f/YOUR_ID`) or Netlify Forms (`data-netlify="true"`).
- **Newsletter**: Ready for Mailchimp / Klaviyo action URLs.
- **Maps**: Placeholder for Google Maps API / Mapbox embed.
- **Payment History**: Configured with downloadable PDF hooks ready for Stripe Invoicing or PayPal integration.
