// Blog post page JavaScript for AY PRINT

(function() {
    'use strict';

    function escapeHtml(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    function escapeAttr(s) { return typeof s !== 'string' ? s : s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    const container = document.getElementById('blogPost');
    const embedded = [
        { "id": 1, "title": "5 Print Materials Every New Business Needs", "slug": "print-materials-every-new-business-needs", "category": "Business Tips", "author": "AY PRINT Team", "date": "2026-07-20", "readTime": "4 min read", "image": "images/portfolio/print-tips.jpg", "excerpt": "From business cards to banners, here are the essential printed items that help a new brand look established from day one.", "content": "Every new business needs a few key print materials to look credible. Start with business cards - they remain the fastest way to share contact details. Add flyers for local promotions, a roll-up banner for events, branded tote bags as walking adverts, and stickers for packaging. Together they build a consistent, professional brand presence without a big budget." },
        { "id": 2, "title": "Choosing the Right Paper for Your Flyers", "slug": "choosing-right-paper-flyers", "category": "Materials", "author": "AY PRINT Team", "date": "2026-06-12", "readTime": "3 min read", "image": "images/portfolio/paper-guide.jpg", "excerpt": "Gloss or matte? 150gsm or 250gsm? A quick guide to picking the perfect stock for your next flyer campaign.", "content": "Paper weight and finish change how your flyer feels and performs. Lighter 150gsm gloss is cost-effective for mass handouts, while 250gsm matte feels premium and writes well for invitations. Match the stock to your goal: awareness at scale, or a high-end first impression." },
        { "id": 3, "title": "Eco-Friendly Printing: Small Changes, Big Impact", "slug": "eco-friendly-printing", "category": "Sustainability", "author": "AY PRINT Team", "date": "2026-05-03", "readTime": "5 min read", "image": "images/portfolio/eco-printing.jpg", "excerpt": "How recycled stocks, soy inks and reusable bags can make your print marketing greener.", "content": "Sustainable print is easier than ever. Choose FSC-certified and recycled papers, request soy or vegetable-based inks, and swap single-use plastics for cotton tote bags. Small swaps add up - and customers increasingly notice brands that print responsibly." }
    ];

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
                <img src="${escapeAttr(p.image)}" alt="${escapeHtml(p.title)}" class="w-full h-72 object-cover" onerror="this.src='images/placeholder.svg'">
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
            const res = await fetch('data/blog-posts.json');
            if (res.ok) {
                const data = await res.json();
                post = data.posts.find(p => p.slug === slug);
            }
        } catch (e) { /* fall through */ }
        if (!post) post = embedded.find(p => p.slug === slug);
        render(post);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
