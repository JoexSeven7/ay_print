// Products / catalogue page JavaScript for AY PRINT

(function() {
    'use strict';

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function escapeAttr(value) {
        if (typeof value !== 'string') return value;
        return value
            .replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            .replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    const gridContainer = document.getElementById('productsGrid');
    const listContainer = document.getElementById('listContainer');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    const searchInput = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortProducts');

    let allProducts = [];

    const embeddedProductsData = [
        { "id": 1, "title": "Business Cards", "slug": "business-cards", "category": "cards", "subcategory": "Standard / Premium / Spot-UV", "material": "300gsm Art Card", "sizes": ["85x55mm", "90x50mm"], "finish": ["Matte", "Gloss", "Soft-touch"], "minOrder": 100, "price": 0, "priceDisplay": "From ₦15,000 / 100 pcs", "turnaround": "2-3 business days", "features": ["Full colour both sides", "Free design", "Fast turnaround"], "image": "images/products/business-cards.jpg", "images": ["images/products/business-cards.jpg"], "description": "Premium business cards on 300gsm art card.", "options": ["Paper type", "Size", "Finish", "Quantity"], "featured": true, "createdAt": "2026-08-05" },
        { "id": 2, "title": "Flyers & Leaflets", "slug": "flyers-leaflets", "category": "flyers", "subcategory": "A5 / A6 / DL", "material": "150gsm Gloss Art", "sizes": ["A6", "A5", "DL", "A4"], "finish": ["Gloss", "Matte"], "minOrder": 500, "price": 0, "priceDisplay": "From ₦25,000 / 500 pcs", "turnaround": "2-4 business days", "features": ["Vivid full-colour print", "Bulk discounts", "Folded options"], "image": "images/products/flyers.jpg", "images": ["images/products/flyers.jpg"], "description": "High-impact flyers and leaflets.", "options": ["Size", "Paper weight", "Finish", "Quantity"], "featured": true, "createdAt": "2026-08-05" },
        { "id": 3, "title": "Branded Tote & Paper Bags", "slug": "branded-bags", "category": "bags", "subcategory": "Tote / Gift / Paper", "material": "100% Cotton / Kraft Paper", "sizes": ["Small", "Medium", "Large"], "finish": ["Screen print", "Full-colour"], "minOrder": 50, "price": 0, "priceDisplay": "From ₦450 / pc", "turnaround": "5-7 business days", "features": ["Eco-friendly options", "Reusable", "Custom artwork"], "image": "images/products/bags.jpg", "images": ["images/products/bags.jpg"], "description": "Custom tote and paper gift bags.", "options": ["Bag type", "Size", "Print method", "Quantity"], "featured": true, "createdAt": "2026-08-05" },
        { "id": 4, "title": "Roll-Up Banners", "slug": "roll-up-banners", "category": "banners", "subcategory": "Standard / Premium", "material": "440gsm PVC / Pop-up", "sizes": ["85cm x 200cm", "100cm x 200cm"], "finish": ["Matte", "Gloss"], "minOrder": 1, "price": 0, "priceDisplay": "From ₦18,000 / pc", "turnaround": "1-2 business days", "features": ["Portable stand included", "Tool-free setup", "Indoor/outdoor"], "image": "images/products/banners.jpg", "images": ["images/products/banners.jpg"], "description": "Crisp roll-up banners.", "options": ["Size", "Material", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 5, "title": "Stickers & Labels", "slug": "stickers-labels", "category": "stickers", "subcategory": "Die-cut / Roll", "material": "Vinyl / Paper", "sizes": ["Custom"], "finish": ["Gloss", "Matte", "Transparent"], "minOrder": 100, "price": 0, "priceDisplay": "From ₦12,000 / 100 pcs", "turnaround": "3-4 business days", "features": ["Weatherproof vinyl", "Any shape", "Strong adhesive"], "image": "images/products/stickers.jpg", "images": ["images/products/stickers.jpg"], "description": "Custom stickers and labels.", "options": ["Shape", "Material", "Finish", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 6, "title": "Brochures & Catalogues", "slug": "brochures-catalogues", "category": "brochures", "subcategory": "Tri-fold / Saddle-stitch", "material": "170gsm Silk", "sizes": ["A4", "A5"], "finish": ["Gloss", "Matte", "Soft-touch"], "minOrder": 100, "price": 0, "priceDisplay": "From ₦40,000 / 100 pcs", "turnaround": "4-5 business days", "features": ["Multiple folds", "Perfect binding", "Premium feel"], "image": "images/products/brochures.jpg", "images": ["images/products/brochures.jpg"], "description": "Professional brochures and catalogues.", "options": ["Fold type", "Size", "Finish", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 7, "title": "Posters", "slug": "posters", "category": "posters", "subcategory": "A2 / A1 / A0", "material": "200gsm Photo Paper", "sizes": ["A2", "A1", "A0"], "finish": ["Gloss", "Matte"], "minOrder": 1, "price": 0, "priceDisplay": "From ₦3,500 / pc", "turnaround": "1-2 business days", "features": ["Photo-quality", "Large format", "Vivid colour"], "image": "images/products/posters.jpg", "images": ["images/products/posters.jpg"], "description": "Bold photo-quality posters.", "options": ["Size", "Paper", "Finish", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 8, "title": "Large Format Printing", "slug": "large-format", "category": "banners", "subcategory": "Flex / Vinyl / Mesh", "material": "PVC Flex", "sizes": ["Custom"], "finish": ["Gloss", "Matte"], "minOrder": 1, "price": 0, "priceDisplay": "From ₦2,500 / sqm", "turnaround": "2-3 business days", "features": ["Weatherproof", "Any size", "Eyelets available"], "image": "images/products/large-format.jpg", "images": ["images/products/large-format.jpg"], "description": "Big, bold large-format printing.", "options": ["Material", "Size", "Finishing", "Quantity"], "featured": false, "createdAt": "2026-08-05" }
    ];

    function generateProductCard(p) {
        const categoryBadge = `<span class="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">${escapeHtml(p.category)}</span>`;
        const featuredBadge = p.featured ? '<span class="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</span>' : '';
        return `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow product-card">
                <div class="relative">
                    <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full h-48 object-cover" onerror="this.src='images/placeholder.svg'">
                    ${featuredBadge}
                    ${categoryBadge}
                    <button class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors quote-btn" data-id="${escapeAttr(p.id)}" title="Add to quote" aria-label="Add to quote">
                        <i class="far fa-bookmark text-gray-600"></i>
                    </button>
                </div>
                <div class="p-5">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">${escapeHtml(p.title)}</h3>
                    <p class="text-sm text-gray-500 mb-3"><i class="fas fa-layer-group text-primary mr-2"></i>${escapeHtml(p.subcategory)}</p>
                    <p class="text-lg font-bold text-primary mb-1">${escapeHtml(p.priceDisplay)}</p>
                    <p class="text-sm text-gray-600 mb-4"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(p.turnaround)}</p>
                    <a href="product-detail.html?id=${escapeAttr(p.id)}" class="block text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
                </div>
            </div>`;
    }

    function generateProductListRow(p) {
        return `
            <div class="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full sm:w-56 h-48 sm:h-auto object-cover" onerror="this.src='images/placeholder.svg'">
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

    // View toggle
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
            const res = await fetch('data/products.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            allProducts = data.products;
        } catch (e) {
            console.error('Products load failed, using embedded fallback', e);
            allProducts = embeddedProductsData;
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
