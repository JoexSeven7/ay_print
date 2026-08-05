// Gallery page JavaScript for AY PRINT

(function() {
    'use strict';

    function escapeHtml(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    function escapeAttr(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    // Placeholder portfolio. Replace `src` with real photos in images/portfolio/
    // and update captions as your real jobs come in.
    const items = [
        { title: "Luxury Business Cards", category: "cards", src: "images/portfolio/cards-1.jpg" },
        { title: "Event Flyers", category: "flyers", src: "images/portfolio/flyers-1.jpg" },
        { title: "Branded Tote Bags", category: "bags", src: "images/portfolio/bags-1.jpg" },
        { title: "Roll-Up Banner", category: "banners", src: "images/portfolio/banner-1.jpg" },
        { title: "Product Stickers", category: "stickers", src: "images/portfolio/stickers-1.jpg" },
        { title: "Premium Brochure", category: "flyers", src: "images/portfolio/brochure-1.jpg" },
        { title: "Gift Paper Bags", category: "bags", src: "images/portfolio/bags-2.jpg" },
        { title: "Storefront Signage", category: "banners", src: "images/portfolio/banner-2.jpg" },
        { title: "Foil Business Cards", category: "cards", src: "images/portfolio/cards-2.jpg" },
        { title: "Die-Cut Stickers", category: "stickers", src: "images/portfolio/stickers-2.jpg" },
        { title: "A5 Leaflets", category: "flyers", src: "images/portfolio/flyers-2.jpg" },
        { title: "Cotton Totes", category: "bags", src: "images/portfolio/bags-3.jpg" }
    ];

    const grid = document.getElementById('galleryGrid');

    function render(list) {
        if (!grid) return;
        grid.innerHTML = list.map(it => `
            <div class="rounded-xl overflow-hidden shadow-lg bg-white group">
                <div class="overflow-hidden">
                    <img src="${escapeAttr(it.src)}" alt="${escapeHtml(it.title)}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='images/placeholder.svg'">
                </div>
                <div class="p-4">
                    <span class="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full mb-2">${escapeHtml(it.category)}</span>
                    <h3 class="font-semibold text-gray-900">${escapeHtml(it.title)}</h3>
                </div>
            </div>`).join('');
    }

    function applyFilter(cat) {
        render(cat === 'all' ? items : items.filter(i => i.category === cat));
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

    document.addEventListener('DOMContentLoaded', () => applyFilter('all'));
})();
