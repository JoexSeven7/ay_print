/**
 * Blog listing page JavaScript for AY PRINT.
 * Fetches blog posts from data/blog-posts.json and renders
 * them as clickable cards linking to individual blog post pages.
 * Each card shows image, category badge, title, excerpt, date,
 * and read time.
 */

(function() {
    'use strict';

    /**
     * HTML escaping for blog post fields.
     * Defined locally for page self-containment.
     */
    function escapeHtml(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    /**
     * Attribute escaping for blog post images.
     */
    function escapeAttr(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    const grid = document.getElementById('blogGrid');

    /**
     * Generates HTML for a single blog post card.
     * Card links to blog-post.html?slug=... and includes
     * image, category, title, excerpt, date, and read time.
     * @param {Object} p - Blog post data object
     * @returns {string} HTML string for the blog card
     */
    function renderCard(p) {
        return `
            <a href="blog-post.html?slug=${escapeAttr(p.slug)}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow block">
                <img src="${escapeAttr(p.image)}" alt="${escapeHtml(p.title)}" class="w-full h-48 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
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

    /**
     * Fetches blog posts from the configured JSON endpoint
     * and renders them into the grid. Shows "No posts" message
     * if the data is empty or unavailable.
     */
    async function init() {
        let posts = [];
        try {
            const res = await fetch(window.APP_CONFIG.paths.blogPostsData);
            if (res.ok) {
                const data = await res.json();
                posts = data.posts;
            }
        } catch (e) {
            console.error('Blog posts load failed:', e);
        }

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
