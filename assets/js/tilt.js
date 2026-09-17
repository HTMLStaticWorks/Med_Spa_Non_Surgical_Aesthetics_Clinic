/**
 * AURELIA CLINICAL AESTHETICS — 3D TILT ENGINE
 * Mouse-tracking perspective tilt with luminous sheen & centered layout
 */

(function() {
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    // Skip on touch/mobile devices or reduced motion for performance & ergonomics
    if (window.matchMedia('(hover: none) or (prefers-reduced-motion: reduce)').matches) {
      return;
    }

    cards.forEach(card => {
      let bounds;
      const maxTilt = 8; // Subtle luxury tilt, non-gaming

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease';
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = (mouseX / bounds.width) - 0.5;
        const yPct = (mouseY / bounds.height) - 0.5;

        const rotX = -yPct * maxTilt;
        const rotY = xPct * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
      }

      function onMouseLeave() {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTiltCards);
  } else {
    initTiltCards();
  }
})();
