/**
 * Gallery page JavaScript for AY PRINT.
 * Renders gallery items in a responsive grid with category filtering.
 * Gallery data is fetched from data/gallery.json.
 * Category filter buttons (with .gallery-filter-btn class) filter
 * items by their category field. Uses a global window.__GALLERY_ITEMS
 * cache to avoid re-fetching on filter changes.
 */

(function() {
    'use strict';

    /**
     * Minimal HTML escaping for gallery item titles and categories.
     * Defined locally for page self-containment.
     */
    function escapeHtml(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    /**
     * Minimal attribute escaping for gallery item images.
     */
    function escapeAttr(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    const grid = document.getElementById('galleryGrid');

    /**
     * Renders an array of gallery items into the grid as cards.
     * Each card shows an image (with hover scale effect), category badge,
     * and title. Images include SVG fallback on error.
     * @param {Array} list - Gallery items to render
     */
    function render(list) {
        if (!grid) return;
        grid.innerHTML = list.map(it => `
            <div class="rounded-xl overflow-hidden shadow-lg bg-white group">
                <div class="overflow-hidden">
                    <img src="${escapeAttr(it.image)}" alt="${escapeHtml(it.title)}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                </div>
                <div class="p-4">
                    <span class="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full mb-2">${escapeHtml(it.category)}</span>
                    <h3 class="font-semibold text-gray-900">${escapeHtml(it.title)}</h3>
                </div>
            </div>`).join('');
    }

    /**
     * Filters and renders gallery items by category.
     * 'all' shows every item; any other value filters by exact
     * category match. Uses the window.__GALLERY_ITEMS cache.
     * @param {string} cat - Category filter value ('all' or specific category)
     */
    function applyFilter(cat) {
        if (cat === 'all') {
            render(window.__GALLERY_ITEMS || []);
        } else {
            render((window.__GALLERY_ITEMS || []).filter(i => i.category === cat));
        }
    }

    /**
     * Main initialization for the gallery page.
     * 1. Fetches gallery data and caches items in window.__GALLERY_ITEMS
     * 2. Attaches click handlers to category filter buttons
     *    (toggle active button styling, apply filter)
     * 3. Renders all items initially
     */
    async function init() {
        try {
            const res = await fetch(window.APP_CONFIG.paths.galleryData);
            if (res.ok) {
                const data = await res.json();
                window.__GALLERY_ITEMS = data.items || [];
            } else {
                window.__GALLERY_ITEMS = [];
            }
        } catch (e) {
            console.error('Gallery load failed:', e);
            window.__GALLERY_ITEMS = [];
        }

        document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.gallery-filter-btn').forEach(b => {
                    const active = b === btn;
                    b.classList.toggle('bg-primary', active);
                    b.classList.toggle('text-white', active);
                    b.classList.toggle('bg-gray-200', !active);
                    b.classList.toggle('text-gray-700', !active);
                });
                applyFilter(btn.dataset.cat);
            });
        });

        applyFilter('all');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
