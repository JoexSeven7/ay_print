/**
 * Hero script for AY PRINT — subtle scroll parallax on the hero media.
 * Applied to the hero section background image for a depth effect.
 * Uses a passive scroll listener for performance (no preventDefault).
 * Parallax effect is capped to the viewport height to avoid
 * excessive offset when scrolling past the hero.
 */

(function() {
    'use strict';

    const heroMedia = document.getElementById('heroMedia');
    if (!heroMedia) return;

    window.addEventListener('scroll', function() {
        const y = window.pageYOffset;
        // Only apply parallax while hero is visible (y < viewport height)
        if (y < window.innerHeight) {
            heroMedia.style.transform = 'translateY(' + (y * 0.25) + 'px)';
        }
    }, { passive: true });
})();
