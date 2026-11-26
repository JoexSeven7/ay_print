// Products / catalogue page JavaScript for AY PRINT

(function() {
    'use strict';

    function escapeHtml(unsafe) {
        if (typeof window.escapeHtml === 'function') return window.escapeHtml(unsafe);
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function escapeAttr(value) {
        if (typeof window.escapeAttr === 'function') return window.escapeAttr(value);
        if (typeof value !== 'string') return value;
        return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    const gridContainer = document.getElementById('productsGrid');
    const listContainer = document.getElementById('listContainer');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortProducts');

    let allProducts = [];

    function generateProductCard(p) {
        const categoryNames = { cards: 'Business Cards', bags: 'Branded Bags', stickers: 'Stickers & Labels' };
        const categoryBadge = `<span class="catalog-card__category">${escapeHtml(categoryNames[p.category] || p.category)}</span>`;
        const featuredBadge = p.featured ? '<span class="catalog-card__featured">Featured</span>' : '';
        return `
            <article class="catalog-card bg-white rounded-2xl overflow-hidden product-card">
                <div class="catalog-card__media relative">
                    <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full h-full object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                    ${featuredBadge}
                    ${categoryBadge}
                    <button class="catalog-card__bookmark quote-btn" data-id="${escapeAttr(p.id)}" title="Add to quote" aria-label="Add to quote">
                        <i class="far fa-bookmark text-gray-600"></i>
                    </button>
                </div>
                <div class="catalog-card__body p-6 flex flex-col">
                    <p class="catalog-card__eyebrow">${escapeHtml(p.subcategory)}</p>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(p.title)}</h3>
                    <p class="catalog-card__description text-gray-600">${escapeHtml(p.description || p.summary)}</p>
                    <div class="catalog-card__footer mt-auto pt-6">
                        <div>
                            <p class="catalog-card__price">${escapeHtml(p.priceDisplay)}</p>
                            <p class="catalog-card__turnaround"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(p.turnaround)}</p>
                        </div>
                        <a href="product-detail.html?id=${escapeAttr(p.id)}" class="catalog-card__cta">View Details</a>
                    </div>
                </div>
            </article>`;
    }

    function generateProductListRow(p) {
        return `
            <div class="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full sm:w-56 h-48 sm:h-auto object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                <div class="p-5 flex-1 flex flex-col">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${escapeHtml(p.title)}</h3>
                            <p class="text-sm text-gray-500"><i class="fas fa-layer-group text-primary mr-2"></i>${escapeHtml(p.subcategory)}</p>
                        </div>
                        <span class="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">${escapeHtml(p.category)}</span>
                    </div>
                    <p class="text-gray-600 my-3">${escapeHtml(p.description)}</p>
                    <div class="mt-auto flex items-center justify-between">
                        <div>
                            <p class="text-lg font-bold text-primary">${escapeHtml(p.priceDisplay)}</p>
                            <p class="text-sm text-gray-600"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(p.turnaround)}</p>
                        </div>
                        <a href="product-detail.html?id=${escapeAttr(p.id)}" class="border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
                    </div>
                </div>
            </div>`;
    }

    function applyFilters() {
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const category = categoryFilter ? categoryFilter.value : '';
        const sort = sortSelect ? sortSelect.value : 'featured';

        let list = allProducts.slice();

        if (category) {
            list = list.filter(p => p.category === category);
        }
        if (query) {
            list = list.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.subcategory || '').toLowerCase().includes(query)
            );
        }
        if (sort === 'price-asc') list.sort((a, b) => (a.minOrder || 0) - (b.minOrder || 0));
        else if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
        else if (sort === 'turnaround') list.sort((a, b) => (a.turnaround || '').localeCompare(b.turnaround || ''));
        else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        render(list);
    }

    function render(list) {
        if (resultsCount) resultsCount.textContent = list.length;

        if (list.length === 0) {
            if (gridContainer) gridContainer.innerHTML = '';
            if (listContainer) listContainer.innerHTML = '';
            if (noResults) noResults.classList.remove('hidden');
            return;
        }
        if (noResults) noResults.classList.add('hidden');

        if (gridContainer) gridContainer.innerHTML = list.map(generateProductCard).join('');
        if (listContainer) listContainer.innerHTML = list.map(generateProductListRow).join('');

        if (typeof syncQuoteButtons === 'function') syncQuoteButtons();
    }

    const viewBtns = document.querySelectorAll('.view-btn');
    function setView(view) {
        viewBtns.forEach(b => {
            const active = b.getAttribute('data-view') === view;
            b.classList.toggle('bg-primary', active);
            b.classList.toggle('text-white', active);
            b.classList.toggle('bg-gray-200', !active);
            b.classList.toggle('text-gray-600', !active);
        });
        if (gridContainer) gridContainer.classList.toggle('hidden', view === 'list');
        if (listContainer) listContainer.classList.toggle('hidden', view !== 'list');
    }

    async function init() {
        try {
            const res = await fetch(window.APP_CONFIG.paths.productsData);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            allProducts = window.expandProductVariants(data.products);
        } catch (e) {
            console.error('Products load failed:', e);
            allProducts = [];
        }

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (sortSelect) sortSelect.addEventListener('change', applyFilters);
        viewBtns.forEach(btn => btn.addEventListener('click', () => setView(btn.getAttribute('data-view'))));

        applyFilters();
        setView('grid');
        if (typeof attachQuoteListeners === 'function') attachQuoteListeners();
        if (typeof syncQuoteButtons === 'function') syncQuoteButtons();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
