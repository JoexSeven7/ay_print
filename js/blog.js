// Blog JavaScript for ATHARRYS PROPERTIES website

// ========== SECURITY UTILITIES ==========
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
    if (typeof value !== 'string') return value;
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ========== BLOG LISTING (Static HTML) ==========

function initStaticBlog() {
    const grid = document.getElementById('blogGrid');
    const paginationDiv = document.getElementById('paginationContainer');
    if (!grid || !paginationDiv) return;

    const cards = Array.from(grid.querySelectorAll('.blog-card'));
    const buttons = Array.from(paginationDiv.querySelectorAll('button'));
    const postsPerPage = 4;
    let currentPage = 1;
    const totalPages = Math.ceil(cards.length / postsPerPage);

    function showPage(page) {
        const start = (page - 1) * postsPerPage;
        cards.forEach((card, i) => {
            card.style.display = (i >= start && i < start + postsPerPage) ? '' : 'none';
        });

        // prev button (index 0)
        const prevBtn = buttons[0];
        if (prevBtn) {
            prevBtn.disabled = page === 1;
            prevBtn.classList.toggle('text-gray-400', page === 1);
            prevBtn.classList.toggle('cursor-not-allowed', page === 1);
            prevBtn.classList.toggle('text-gray-700', page !== 1);
        }

        // page 1 button (index 1)
        const page1Btn = buttons[1];
        if (page1Btn) {
            page1Btn.className = `px-4 py-2 rounded-lg ${page === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
        }

        // page 2 button (index 2)
        const page2Btn = buttons[2];
        if (page2Btn) {
            page2Btn.className = `px-4 py-2 rounded-lg ${page === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
        }

        // next button (index 3)
        const nextBtn = buttons[3];
        if (nextBtn) {
            nextBtn.disabled = page === totalPages;
            nextBtn.classList.toggle('text-gray-400', page === totalPages);
            nextBtn.classList.toggle('cursor-not-allowed', page === totalPages);
            nextBtn.classList.toggle('text-gray-700', page !== totalPages);
        }

        currentPage = page;
        window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
    }

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            if (index === 0) {
                if (currentPage > 1) showPage(currentPage - 1);
            } else if (index === 3) {
                if (currentPage < totalPages) showPage(currentPage + 1);
            } else if (index === 1) {
                showPage(1);
            } else if (index === 2) {
                showPage(2);
            }
        });
    });

    showPage(1);
}

function initStaticBlogSearch() {
    const searchInput = document.getElementById('blogSearchInput');
    const searchForm = document.getElementById('blogSearchForm');
    if (!searchInput || !searchForm) return;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const term = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.blog-card');
        let hasResults = false;
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const excerpt = card.querySelector('p').textContent.toLowerCase();
            if (title.includes(term) || excerpt.includes(term)) {
                card.style.display = '';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        if (!hasResults && term) {
            const noResults = document.getElementById('noResults');
            if (noResults) {
                noResults.classList.remove('hidden');
                noResults.textContent = 'No blog posts found matching "' + term + '"';
            }
        } else if (noResults) {
            noResults.classList.add('hidden');
        }
    });
}

// ========== BLOG POST DETAIL ==========

let allPosts = [];

async function fetchBlogPosts() {
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) throw new Error('Failed to load blog posts');
        const data = await response.json();
        allPosts = data.posts;
        return allPosts;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        if (window.location.protocol === 'file:') {
            return getFallbackPosts();
        }
        return [];
    }
}

function getFallbackPosts() {
    return [
        {
            "id": 1,
            "title": "2024 Real Estate Market Outlook: What to Expect in Nigeria",
            "category": "Market Insights",
            "date": "February 8, 2024",
            "author": "Emeka Atharrys",
            "readTime": "8 min read",
            "image": "images/estatee.jpg",
            "excerpt": "As we move into 2024, the Nigerian real estate market shows promising signs of growth and opportunity.",
            "content": "<p>As we move into 2024, the Nigerian real estate market shows promising signs of growth and opportunity.</p><h3>Key Trends</h3><p>From affordable housing initiatives to commercial developments in major cities, the sector is experiencing significant transformation.</p><h3>Investment Opportunities</h3><p>Smart investors are looking beyond residential properties. Mixed-use developments and industrial real estate are gaining traction.</p>"
        },
        {
            "id": 2,
            "title": "5 Essential Tips for First-Time Property Investors",
            "category": "Investment Tips",
            "date": "February 5, 2024",
            "author": "Emeka Atharrys",
            "readTime": "5 min read",
            "image": "images/taskss.webp",
            "excerpt": "Investing in real estate can be overwhelming for beginners. Here are five essential tips to help you make smart investment decisions.",
            "content": "<p>Investing in real estate can be overwhelming for beginners. Here are five essential tips to help you make smart investment decisions.</p><h3>1. Start with Research</h3><p>Understand the local market dynamics, price trends, and future development plans in your target area.</p><h3>2. Set a Realistic Budget</h3><p>Factor in all costs including down payment, legal fees, taxes, and maintenance.</p><h3>3. Inspect Before You Invest</h3><p>Always conduct a thorough property inspection or hire a professional to avoid costly surprises.</p>"
        },
        {
            "id": 3,
            "title": "The Complete Guide to Buying Your First Home in Nigeria",
            "category": "Buying Guide",
            "date": "February 1, 2024",
            "author": "Emeka Atharrys",
            "readTime": "7 min read",
            "image": "images/invest.jpg",
            "excerpt": "From saving for a down payment to closing the deal, this guide covers everything you need to know about buying your first home.",
            "content": "<p>From saving for a down payment to closing the deal, this guide covers everything you need to know about buying your first home.</p><h3>Saving for a Down Payment</h3><p>Aim for at least 20% of the property value to secure favorable mortgage terms.</p><h3>Getting Pre-Approved</h3><p>Mortgage pre-approval strengthens your negotiating position and signals seriousness to sellers.</p><h3>The Closing Process</h3><p>Work with a qualified lawyer to review all documents and ensure a smooth transfer of ownership.</p>"
        },
        {
            "id": 4,
            "title": "Lagos Property Prices: Q4 2023 Analysis",
            "category": "Market Updates",
            "date": "January 28, 2024",
            "author": "Emeka Atharrys",
            "readTime": "4 min read",
            "image": "images/nigblog.jpg",
            "excerpt": "A detailed analysis of property price trends in Lagos during the fourth quarter of 2023.",
            "content": "<p>A detailed analysis of property price trends in Lagos during the fourth quarter of 2023.</p><h3>Price Movements</h3><p>Average property prices in prime areas saw a modest 5% increase, while emerging neighborhoods recorded up to 12% growth.</p>"
        },
        {
            "id": 5,
            "title": "Maximizing Rental Income: Strategies for Landlords",
            "category": "Property Management",
            "date": "January 25, 2024",
            "author": "Emeka Atharrys",
            "readTime": "6 min read",
            "image": "images/taxinc.jpg",
            "excerpt": "Learn proven strategies to increase your rental income while maintaining high tenant satisfaction.",
            "content": "<p>Learn proven strategies to increase your rental income while maintaining high tenant satisfaction and property value.</p><h3>Regular Maintenance</h3><p>Proactive maintenance reduces long-term costs and keeps tenants happy.</p><h3>Smart Pricing</h3><p>Use market data to set competitive yet profitable rental rates.</p>"
        },
        {
            "id": 6,
            "title": "Why Abuja is Becoming a Commercial Real Estate Hub",
            "category": "Commercial Real Estate",
            "date": "January 20, 2024",
            "author": "Emeka Atharrys",
            "readTime": "5 min read",
            "image": "images/realestatess.jpg",
            "excerpt": "Explore the factors driving commercial real estate growth in Abuja and what this means for investors and businesses.",
            "content": "<p>Explore the factors driving commercial real estate growth in Abuja and what this means for investors and businesses.</p><h3>Government Investments</h3><p>Federal government initiatives are spurring development of office spaces and commercial districts.</p>"
        },
        {
            "id": 7,
            "title": "Understanding Property Documentation in Nigeria",
            "category": "Legal",
            "date": "January 15, 2024",
            "author": "Emeka Atharrys",
            "readTime": "8 min read",
            "image": "images/legal.jpg",
            "excerpt": "A comprehensive guide to property documents you need to know when buying or selling real estate in Nigeria.",
            "content": "<p>A comprehensive guide to property documents you need to know when buying or selling real estate in Nigeria.</p><h3>Certificate of Occupancy</h3><p>The most important document proving land ownership in Nigeria.</p>"
        },
        {
            "id": 8,
            "title": "Real Estate vs. Stocks: Which Investment is Right for You?",
            "category": "Investment Tips",
            "date": "January 10, 2024",
            "author": "Emeka Atharrys",
            "readTime": "6 min read",
            "image": "images/blog-7.jpg",
            "excerpt": "Compare real estate and stock investments to determine which option aligns better with your financial goals.",
            "content": "<p>Compare real estate and stock investments to determine which option aligns better with your financial goals and risk tolerance.</p><h3>Real Estate Advantages</h3><p>Tangible assets, steady rental income, and inflation protection make real estate appealing for long-term investors.</p>"
        },
        {
            "id": 9,
            "title": "Emerging Neighborhoods to Watch in 2024",
            "category": "Market Updates",
            "date": "January 5, 2024",
            "author": "Emeka Atharrys",
            "readTime": "5 min read",
            "image": "images/blog-8.jpg",
            "excerpt": "Discover up-and-coming neighborhoods in major Nigerian cities that offer excellent investment potential.",
            "content": "<p>Discover up-and-coming neighborhoods in major Nigerian cities that offer excellent investment potential.</p><h3>Lagos</h3><p>Areas like Ajah and Sangotedo are seeing rapid infrastructure development.</p>"
        }
    ];
}

function renderBlogPost(post) {
    // Reveal the article only after JS has populated it (no hardcoded HTML flash)
    const postArticle = document.getElementById('postArticle');
    if (postArticle) postArticle.classList.remove('hidden');

    if (!post) {
        const postBody = document.getElementById('postBody');
        if (postBody) postBody.innerHTML = '<p>Post not found.</p>';
        return;
    }
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postMeta').innerHTML = `<span><i class="far fa-calendar mr-1"></i> ${escapeHtml(post.date)}</span><span><i class="far fa-user mr-1"></i> ${escapeHtml(post.author)}</span><span><i class="far fa-clock mr-1"></i> ${escapeHtml(post.readTime)}</span>`;
    const image = document.getElementById('postImage');
    if (image) {
        image.src = post.image;
        image.alt = post.title;
        image.onerror = function() { this.src = 'images/build1.jpeg'; };
    }
    document.getElementById('postBody').innerHTML = post.content;

    // Populate category badge on the article image
    const postCategoryBadge = document.getElementById('postCategoryBadge');
    if (postCategoryBadge) {
        postCategoryBadge.textContent = post.category;
        postCategoryBadge.classList.remove('hidden');
    }

    const currentIndex = allPosts.findIndex(p => p.id === post.id);
    const prevBtn = document.getElementById('prevPostBtn');
    const nextBtn = document.getElementById('nextPostBtn');

    if (prevBtn) {
        prevBtn.style.display = currentIndex > 0 ? '' : 'none';
        if (currentIndex > 0) {
            prevBtn.setAttribute('data-id', allPosts[currentIndex - 1].id);
            prevBtn.onclick = function() {
                loadBlogPost(allPosts[currentIndex - 1].id);
                window.scrollTo(0, 0);
            };
        }
    }

    if (nextBtn) {
        nextBtn.style.display = currentIndex < allPosts.length - 1 ? '' : 'none';
        if (currentIndex < allPosts.length - 1) {
            nextBtn.setAttribute('data-id', allPosts[currentIndex + 1].id);
            nextBtn.onclick = function() {
                loadBlogPost(allPosts[currentIndex + 1].id);
                window.scrollTo(0, 0);
            };
        }
    }
}

function loadBlogPost(id) {
    const post = allPosts.find(p => p.id === parseInt(id));
    renderBlogPost(post);
}

function initBlogPostPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    if (!id) return;
    loadBlogPost(id);
}

// ========== RECENT POSTS ==========

function getRecentPosts(excludeId = null, limit = 4) {
    if (allPosts.length === 0) return [];

    // Sort by date descending (newest first)
    const sorted = [...allPosts].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    // Exclude current post if viewing a single post
    const filtered = excludeId
        ? sorted.filter(p => p.id !== excludeId)
        : sorted;

    return filtered.slice(0, limit);
}

function renderRecentPosts() {
    const container = document.getElementById('recentPostsList');
    if (!container) return;

    // Get current post ID from URL if on blog-post page
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get('id') ? parseInt(params.get('id')) : null;

    const recentPosts = getRecentPosts(currentId);

    if (recentPosts.length === 0) {
        container.innerHTML = '<li class="text-gray-500 text-sm">No recent posts found.</li>';
        return;
    }

    container.innerHTML = recentPosts.map(post => `
        <li>
            <a href="blog-post.html?id=${post.id}" class="flex gap-4 group">
                <img src="${escapeAttr(post.image)}" alt="${escapeHtml(post.title)}" class="w-16 h-16 object-cover rounded-lg" onerror="this.src='images/build1.jpeg'">
                <div>
                    <h4 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">${escapeHtml(post.title)}</h4>
                    <span class="text-sm text-gray-500">${escapeHtml(post.date)}</span>
                </div>
            </a>
        </li>
    `).join('');
}

// ========== INITIALIZATION ==========

// Blog listing page (static HTML enhancement)
if (document.getElementById('blogGrid') && document.getElementById('paginationContainer')) {
    document.addEventListener('DOMContentLoaded', async function() {
        await fetchBlogPosts();
        initStaticBlog();
        initStaticBlogSearch();
        renderRecentPosts();
    });
}

// Blog post detail page
if (document.getElementById('postBody')) {
    document.addEventListener('DOMContentLoaded', async function() {
        await fetchBlogPosts();
        initBlogPostPage();
        renderRecentPosts();
    });
}
