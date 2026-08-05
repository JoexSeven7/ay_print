// Hero script for AY PRINT — subtle scroll parallax on the hero media.
// Kept lightweight; the hero uses a static gradient + image background.

(function() {
    'use strict';

    const heroMedia = document.getElementById('heroMedia');
    if (!heroMedia) return;

    window.addEventListener('scroll', function() {
        const y = window.pageYOffset;
        if (y < window.innerHeight) {
            heroMedia.style.transform = 'translateY(' + (y * 0.25) + 'px)';
        }
    }, { passive: true });
})();
