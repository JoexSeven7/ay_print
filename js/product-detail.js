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
    const embeddedProductsData = [
        { "id": 1, "title": "Business Cards", "slug": "business-cards", "category": "cards", "subcategory": "Standard / Premium / Spot-UV", "material": "300gsm Art Card", "sizes": ["85x55mm", "90x50mm"], "finish": ["Matte", "Gloss", "Soft-touch"], "minOrder": 100, "price": 0, "priceDisplay": "From ₦15,000 / 100 pcs", "turnaround": "2-3 business days", "features": ["Full colour both sides", "Free design", "Fast turnaround"], "image": "images/products/business-cards.jpg", "images": ["images/products/business-cards.jpg", "images/products/business-cards-2.jpg"], "description": "Make a lasting first impression with premium business cards printed on 300gsm art card. Choose from matte, gloss or soft-touch finishes, with optional spot-UV highlights for that extra lift.", "options": ["Paper type", "Size", "Finish", "Quantity"], "featured": true, "createdAt": "2026-08-05" },
        { "id": 2, "title": "Flyers & Leaflets", "slug": "flyers-leaflets", "category": "flyers", "subcategory": "A5 / A6 / DL", "material": "150gsm Gloss Art", "sizes": ["A6", "A5", "DL", "A4"], "finish": ["Gloss", "Matte"], "minOrder": 500, "price": 0, "priceDisplay": "From ₦25,000 / 500 pcs", "turnaround": "2-4 business days", "features": ["Vivid full-colour print", "Bulk discounts", "Folded options"], "image": "images/products/flyers.jpg", "images": ["images/products/flyers.jpg", "images/products/flyers-2.jpg"], "description": "Promote events, sales and menus with high-impact flyers and leaflets.", "options": ["Size", "Paper weight", "Finish", "Quantity"], "featured": true, "createdAt": "2026-08-05" },
        { "id": 3, "title": "Branded Tote & Paper Bags", "slug": "branded-bags", "category": "bags", "subcategory": "Tote / Gift / Paper", "material": "100% Cotton / Kraft Paper", "sizes": ["Small", "Medium", "Large"], "finish": ["Screen print", "Full-colour"], "minOrder": 50, "price": 0, "priceDisplay": "From ₦450 / pc", "turnaround": "5-7 business days", "features": ["Eco-friendly options", "Reusable", "Custom artwork"], "image": "images/products/bags.jpg", "images": ["images/products/bags.jpg", "images/products/bags-2.jpg"], "description": "Carry your brand everywhere with custom tote bags and premium paper gift bags.", "options": ["Bag type", "Size", "Print method", "Quantity"], "featured": true, "createdAt": "2026-08-05" },
        { "id": 4, "title": "Roll-Up Banners", "slug": "roll-up-banners", "category": "banners", "subcategory": "Standard / Premium", "material": "440gsm PVC / Pop-up", "sizes": ["85cm x 200cm", "100cm x 200cm"], "finish": ["Matte", "Gloss"], "minOrder": 1, "price": 0, "priceDisplay": "From ₦18,000 / pc", "turnaround": "1-2 business days", "features": ["Portable stand included", "Tool-free setup", "Indoor/outdoor"], "image": "images/products/banners.jpg", "images": ["images/products/banners.jpg"], "description": "Crisp roll-up banners.", "options": ["Size", "Material", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 5, "title": "Stickers & Labels", "slug": "stickers-labels", "category": "stickers", "subcategory": "Die-cut / Roll", "material": "Vinyl / Paper", "sizes": ["Custom"], "finish": ["Gloss", "Matte", "Transparent"], "minOrder": 100, "price": 0, "priceDisplay": "From ₦12,000 / 100 pcs", "turnaround": "3-4 business days", "features": ["Weatherproof vinyl", "Any shape", "Strong adhesive"], "image": "images/products/stickers.jpg", "images": ["images/products/stickers.jpg"], "description": "Custom stickers and labels.", "options": ["Shape", "Material", "Finish", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 6, "title": "Brochures & Catalogues", "slug": "brochures-catalogues", "category": "brochures", "subcategory": "Tri-fold / Saddle-stitch", "material": "170gsm Silk", "sizes": ["A4", "A5"], "finish": ["Gloss", "Matte", "Soft-touch"], "minOrder": 100, "price": 0, "priceDisplay": "From ₦40,000 / 100 pcs", "turnaround": "4-5 business days", "features": ["Multiple folds", "Perfect binding", "Premium feel"], "image": "images/products/brochures.jpg", "images": ["images/products/brochures.jpg"], "description": "Professional brochures and catalogues.", "options": ["Fold type", "Size", "Finish", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 7, "title": "Posters", "slug": "posters", "category": "posters", "subcategory": "A2 / A1 / A0", "material": "200gsm Photo Paper", "sizes": ["A2", "A1", "A0"], "finish": ["Gloss", "Matte"], "minOrder": 1, "price": 0, "priceDisplay": "From ₦3,500 / pc", "turnaround": "1-2 business days", "features": ["Photo-quality", "Large format", "Vivid colour"], "image": "images/products/posters.jpg", "images": ["images/products/posters.jpg"], "description": "Bold photo-quality posters.", "options": ["Size", "Paper", "Finish", "Quantity"], "featured": false, "createdAt": "2026-08-05" },
        { "id": 8, "title": "Large Format Printing", "slug": "large-format", "category": "banners", "subcategory": "Flex / Vinyl / Mesh", "material": "PVC Flex", "sizes": ["Custom"], "finish": ["Gloss", "Matte"], "minOrder": 1, "price": 0, "priceDisplay": "From ₦2,500 / sqm", "turnaround": "2-3 business days", "features": ["Weatherproof", "Any size", "Eyelets available"], "image": "images/products/large-format.jpg", "images": ["images/products/large-format.jpg"], "description": "Big, bold large-format printing.", "options": ["Material", "Size", "Finishing", "Quantity"], "featured": false, "createdAt": "2026-08-05" }
    ];

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
                <img src="${escapeAttr(src)}" alt="${escapeHtml(p.title)} thumbnail" class="w-20 h-20 object-cover" onerror="this.src='images/placeholder.svg'">
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
                        <img id="mainImage" src="${escapeAttr(images[0])}" alt="${escapeHtml(p.title)}" class="w-full h-80 object-cover" onerror="this.src='images/placeholder.svg'">
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

        // Gallery thumbnail switching
        const mainImage = document.getElementById('mainImage');
        container.querySelectorAll('.thumb-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                mainImage.src = btn.dataset.src;
                container.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('border-primary'), b.classList.add('border-transparent'));
                btn.classList.add('border-primary');
                btn.classList.remove('border-transparent');
            });
        });

        // Add to Quote
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

        // Related products (same category, exclude current)
        const related = embeddedProductsData.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3);
        const relatedEl = document.getElementById('relatedProducts');
        if (relatedEl) {
            if (related.length === 0) {
                relatedEl.innerHTML = '<p class="text-gray-500">No related products.</p>';
            } else {
                relatedEl.innerHTML = related.map(r => `
                    <a href="product-detail.html?id=${escapeAttr(r.id)}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        <img src="${escapeAttr(r.image)}" alt="${escapeHtml(r.title)}" class="w-full h-40 object-cover" onerror="this.src='images/placeholder.svg'">
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
        try {
            const res = await fetch('data/products.json');
            if (res.ok) {
                const data = await res.json();
                product = data.products.find(p => p.id === id);
            }
        } catch (e) { /* fall through to embedded */ }
        if (!product) product = embeddedProductsData.find(p => p.id === id);
        render(product);
        if (typeof attachQuoteListeners === 'function') attachQuoteListeners();
        if (typeof syncQuoteButtons === 'function') syncQuoteButtons();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
