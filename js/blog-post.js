// Blog post page JavaScript for AY PRINT

(function() {
    'use strict';

    function escapeHtml(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    function escapeAttr(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    const container = document.getElementById('blogPost');

    function getSlug() {
        return new URLSearchParams(window.location.search).get('slug');
    }

    function render(p) {
        if (!p) {
            container.innerHTML = '<div class="text-center py-20"><p class="text-xl text-gray-600">Post not found.</p><a href="blog.html" class="btn-primary inline-block mt-4">Back to Blog</a></div>';
            return;
        }
        container.innerHTML = `
            <a href="blog.html" class="text-primary hover:underline mb-6 inline-block"><i class="fas fa-arrow-left mr-2"></i>Back to Blog</a>
            <article class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img src="${escapeAttr(p.image)}" alt="${escapeHtml(p.title)}" class="w-full h-72 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                <div class="p-8">
                    <span class="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">${escapeHtml(p.category)}</span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${escapeHtml(p.title)}</h1>
                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <span><i class="far fa-user mr-1"></i>${escapeHtml(p.author)}</span>
                        <span><i class="far fa-calendar mr-1"></i>${escapeHtml(p.date)}</span>
                        <span><i class="far fa-clock mr-1"></i>${escapeHtml(p.readTime)}</span>
                    </div>
                    <p class="text-lg text-gray-700 leading-relaxed">${escapeHtml(p.content)}</p>
                </div>
            </article>`;
    }

    async function init() {
        const slug = getSlug();
        let post = null;
        try {
            const res = await fetch(window.APP_CONFIG.paths.blogPostsData);
            if (res.ok) {
                const data = await res.json();
                post = data.posts.find(p => p.slug === slug);
            }
        } catch (e) {
            console.error('Blog post load failed:', e);
        }
        render(post);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
