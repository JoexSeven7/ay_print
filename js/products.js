/**
 * Products/catalogue page JavaScript for AY PRINT.
 * Handles product listing, search, category filtering,
 * sorting, grid/list view toggle, and quote button integration.
 * All product data is fetched from data/products.json.
 * Uses IIFE pattern to avoid global scope pollution.
 */

(function() {
    'use strict';

    /**
     * Escapes HTML special characters for safe DOM insertion.
     * Local copy used here since this script runs independently
     * on pages where main.js functions may not be available yet.
     */
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    /**
     * Escapes attribute-special characters for safe attribute insertion.
     */
    function escapeAttr(value) {
        if (typeof value !== 'string') return value;
        return value
            .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            .replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // DOM element references for the product page
    const gridContainer = document.getElementById('productsGrid');
    const listContainer = document.getElementById('listContainer');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    // Filter/sort controls
    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortProducts');

    // Cache for all fetched products
    let allProducts = [];

    /**
     * Generates HTML for a product card in grid view.
     * Same structure as main.js generateProductCard but
     * defined locally for page self-containment.
     */
    function generateProductCard(p) {
        const categoryBadge = `<span class="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">${escapeHtml(p.category)}</span>`;
        const featuredBadge = p.featured ? '<span class="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</span>' : '';
        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow product-card">
                <div class="relative">
                    <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full h-48 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                    ${featuredBadge}
                    ${categoryBadge}
                    <button class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors quote-btn" data-id="${escapeAttr(p.id)}" title="Add to quote" aria-label="Add to quote">
                        <i class="far fa-bookmark text-gray-600"></i>
                    </button>
                </div>
                <div class="p-5">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">${escapeHtml(p.title)}</h3>
                    <p class="text-sm text-gray-500 mb-3"><i class="fas fa-layer-group text-primary mr-2"></i>${escapeHtml(p.subcategory)}</p>
                    <p class="text-sm text-gray-600 mb-4">${escapeHtml(p.summary || p.description)}</p>
                    <p class="text-lg font-bold text-primary mb-1">${escapeHtml(p.priceDisplay)}</p>
                    <p class="text-sm text-gray-600 mb-4"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(p.turnaround)}</p>
                    <a href="product-detail.html?id=${escapeAttr(p.id)}" class="block text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
                </div>
            </div>`;
    }

    /**
     * Generates HTML for a product row in list view.
     * Horizontal layout with image on the left and details on the right.
     */
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
                    <p class="text-gray-600 my-3">${escapeHtml(p.summary || p.description)}</p>
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

    /**
     * Applies search, category filter, and sort to allProducts
     * and triggers re-render. Filter logic:
     * - Category: exact match on category field
     * - Search: case-insensitive substring match on title,
     *   summary, description, category, and subcategory
     * - Sort: by featured priority, name (A-Z), minOrder (price-asc),
     *   or turnaround string
     */
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
                (p.summary || p.description).toLowerCase().includes(query) ||
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

    /**
     * Renders the filtered product list to both grid and list containers.
     * Updates the results count display. Shows/hides the no-results
     * message. Syncs quote button states if available.
     * @param {Array} list - Filtered and sorted product array
     */
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

    /**
     * Toggles between grid and list view layouts.
     * Updates button styling to indicate active view,
     * and toggles visibility of grid/list container elements.
     * @param {string} view - 'grid' or 'list'
     */
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

    /**
     * Main initialization for the products page.
     * 1. Fetches all products from JSON data endpoint
     * 2. Attaches event listeners for search, filter, sort, and view toggle
     * 3. Applies initial filters and sets default view to grid
     * 4. Syncs quote buttons if available
     */
    async function init() {
        try {
            const res = await fetch(window.APP_CONFIG.paths.productsData);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            allProducts = data.products;
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
