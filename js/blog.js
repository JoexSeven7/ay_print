// Blog listing page JavaScript for AY PRINT

(function() {
    'use strict';

    function escapeHtml(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    function escapeAttr(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    const grid = document.getElementById('blogGrid');
    const embedded = [
        { "id": 1, "title": "5 Print Materials Every New Business Needs", "slug": "print-materials-every-new-business-needs", "category": "Business Tips", "author": "AY PRINT Team", "date": "2026-07-20", "readTime": "4 min read", "image": "images/portfolio/print-tips.jpg", "excerpt": "From business cards to banners, here are the essential printed items that help a new brand look established from day one." },
        { "id": 2, "title": "Choosing the Right Paper for Your Flyers", "slug": "choosing-right-paper-flyers", "category": "Materials", "author": "AY PRINT Team", "date": "2026-06-12", "readTime": "3 min read", "image": "images/portfolio/paper-guide.jpg", "excerpt": "Gloss or matte? 150gsm or 250gsm? A quick guide to picking the perfect stock for your next flyer campaign." },
        { "id": 3, "title": "Eco-Friendly Printing: Small Changes, Big Impact", "slug": "eco-friendly-printing", "category": "Sustainability", "author": "AY PRINT Team", "date": "2026-05-03", "readTime": "5 min read", "image": "images/portfolio/eco-printing.jpg", "excerpt": "How recycled stocks, soy inks and reusable bags can make your print marketing greener." }
    ];

    function renderCard(p) {
        return `
            <a href="blog-post.html?slug=${escapeAttr(p.slug)}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow block">
                <img src="${escapeAttr(p.image)}" alt="${escapeHtml(p.title)}" class="w-full h-48 object-cover" onerror="this.src='images/placeholder.svg'">
                <div class="p-5">
                    <span class="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">${escapeHtml(p.category)}</span>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">${escapeHtml(p.title)}</h3>
                    <p class="text-gray-600 mb-4">${escapeHtml(p.excerpt)}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span><i class="far fa-calendar mr-1"></i>${escapeHtml(p.date)}</span>
                        <span>${escapeHtml(p.readTime)}</span>
                    </div>
                </div>
            </a>`;
    }

    async function init() {
        let posts = embedded;
        try {
            const res = await fetch('data/blog-posts.json');
            if (res.ok) {
                const data = await res.json();
                posts = data.posts;
            }
        } catch (e) { /* use embedded */ }
        if (grid) {
            if (posts.length === 0) {
                grid.innerHTML = '<p class="text-gray-600">No posts yet. Check back soon!</p>';
            } else {
                grid.innerHTML = posts.map(renderCard).join('');
            }
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
