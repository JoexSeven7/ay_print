// Product detail page JavaScript for AY PRINT

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

    const container = document.getElementById('productDetail');

    function getId() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'));
    }

    function render(p) {
        if (!p) {
            container.innerHTML = `<div class="text-center py-20"><p class="text-xl text-gray-600">Sorry, we couldn't find that product.</p><a href="products.html" class="btn-primary inline-block mt-4">Back to Products</a></div>`;
            return;
        }

        const images = (p.images && p.images.length) ? p.images : [p.image];
        const galleryThumbs = images.map((src, i) => `
            <button class="thumb-btn rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-transparent'}" data-src="${escapeAttr(src)}">
                <img src="${escapeAttr(src)}" alt="${escapeHtml(p.title)} thumbnail" class="w-20 h-20 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
            </button>`).join('');

        const specRows = [
            ['Category', p.category],
            ['Type', p.subcategory],
            ['Material', p.material],
            ['Available sizes', (p.sizes || []).join(', ')],
            ['Finishes', (p.finish || []).join(', ')],
            ['Minimum order', p.minOrder + ' pcs'],
            ['Turnaround', p.turnaround]
        ].map(([k, v]) => `
            <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-500">${escapeHtml(k)}</span>
                <span class="font-medium text-gray-900 text-right">${escapeHtml(v || '-')}</span>
            </div>`).join('');

        const featureList = (p.features || []).map(f => `
            <li class="flex items-center gap-2 text-gray-700"><i class="fas fa-check-circle text-secondary"></i>${escapeHtml(f)}</li>`).join('');

        container.innerHTML = `
            <nav class="text-sm text-gray-500 mb-6">
                <a href="index.html" class="hover:text-primary">Home</a> /
                <a href="products.html" class="hover:text-primary">Products</a> /
                <span class="text-gray-700">${escapeHtml(p.title)}</span>
            </nav>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <div class="rounded-2xl overflow-hidden shadow-lg bg-white">
                        <img id="mainImage" src="${escapeAttr(images[0])}" alt="${escapeHtml(p.title)}" class="w-full h-80 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                    </div>
                    <div class="flex gap-3 mt-4">${galleryThumbs}</div>
                </div>
                <div>
                    <span class="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">${escapeHtml(p.category)}</span>
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${escapeHtml(p.title)}</h1>
                    <p class="text-gray-500 mb-4"><i class="fas fa-layer-group text-primary mr-2"></i>${escapeHtml(p.subcategory)}</p>
                    <p class="text-2xl font-bold text-primary mb-2">${escapeHtml(p.priceDisplay)}</p>
                    <p class="text-gray-600 mb-6"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(p.turnaround)}</p>
                    <p class="text-gray-700 mb-6">${escapeHtml(p.description)}</p>
                    <div class="bg-gray-50 rounded-xl p-5 mb-6">
                        ${specRows}
                    </div>
                    <ul class="space-y-2 mb-6">${featureList}</ul>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="addToQuote" data-id="${escapeAttr(p.id)}" class="btn-secondary flex items-center justify-center gap-2">
                            <i class="far fa-bookmark"></i> Add to Quote
                        </button>
                        <a href="contact.html?product=${escapeAttr(p.slug)}" class="btn-primary flex items-center justify-center gap-2">
                            <i class="fas fa-paper-plane"></i> Request a Quote
                        </a>
                    </div>
                </div>
            </div>

            <div class="mt-16">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                <div id="relatedProducts" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
            </div>
        `;

        const mainImage = document.getElementById('mainImage');
        container.querySelectorAll('.thumb-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                mainImage.src = btn.dataset.src;
                container.querySelectorAll('.thumb-btn').forEach(b => {
                    b.classList.remove('border-primary');
                    b.classList.add('border-transparent');
                });
                btn.classList.add('border-primary');
                btn.classList.remove('border-transparent');
            });
        });

        const addBtn = document.getElementById('addToQuote');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                if (typeof toggleQuote === 'function') {
                    toggleQuote(addBtn.dataset.id);
                    const inQuote = (typeof getQuote === 'function') && getQuote().includes(String(addBtn.dataset.id));
                    addBtn.innerHTML = inQuote
                        ? '<i class="fas fa-bookmark"></i> Added to Quote'
                        : '<i class="far fa-bookmark"></i> Add to Quote';
                }
            });
        }
    }

    async function loadProducts() {
        try {
            const res = await fetch(window.APP_CONFIG.paths.productsData);
            if (res.ok) {
                const data = await res.json();
                return data.products;
            }
        } catch (e) {
            console.error('Products load failed:', e);
        }
        return [];
    }

    async function renderRelated(currentProduct, allProducts) {
        const related = allProducts
            .filter(x => x.category === currentProduct.category && x.id !== currentProduct.id)
            .slice(0, window.APP_CONFIG.limits.relatedProducts);
        const relatedEl = document.getElementById('relatedProducts');
        if (relatedEl) {
            if (related.length === 0) {
                relatedEl.innerHTML = '<p class="text-gray-500">No related products.</p>';
            } else {
                relatedEl.innerHTML = related.map(r => `
                    <a href="product-detail.html?id=${escapeAttr(r.id)}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <img src="${escapeAttr(r.image)}" alt="${escapeHtml(r.title)}" class="w-full h-40 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900">${escapeHtml(r.title)}</h3>
                            <p class="text-primary font-bold mt-1">${escapeHtml(r.priceDisplay)}</p>
                        </div>
                    </a>`).join('');
            }
        }
    }

    async function init() {
        const id = getId();
        let product = null;
        let allProducts = [];

        allProducts = await loadProducts();
        product = allProducts.find(p => p.id === id);

        if (product) {
            render(product);
            await renderRelated(product, allProducts);
        } else {
            container.innerHTML = `<div class="text-center py-20"><p class="text-xl text-gray-600">Sorry, we couldn't find that product.</p><a href="products.html" class="btn-primary inline-block mt-4">Back to Products</a></div>`;
        }

        if (typeof attachQuoteListeners === 'function') attachQuoteListeners();
        if (typeof syncQuoteButtons === 'function') syncQuoteButtons();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
