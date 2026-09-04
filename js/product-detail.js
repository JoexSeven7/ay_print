// Product detail page JavaScript for AY PRINT

(function () {
	'use strict';

	function escapeHtml(unsafe) {
		if (typeof unsafe !== 'string') return unsafe;
		return unsafe
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
	}
	function escapeAttr(value) {
		if (typeof value !== 'string') return value;
		return value
			.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
			.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	const container = document.getElementById('productDetail');
	const placeholder = window.APP_CONFIG.paths.placeholderImage;

	function getId() {
		const params = new URLSearchParams(window.location.search);
		return parseInt(params.get('id'));
	}

	function buildVariants(p) {
		if (Array.isArray(p.variants) && p.variants.length > 0) {
			return p.variants.map((v, i) => ({
				index: i,
				name: v.name || ('Variant ' + (i + 1)),
				image: v.image || p.image,
				material: v.material != null ? v.material : p.material,
				sizes: v.sizes || p.sizes || [],
				finish: v.finish || p.finish || [],
				minOrder: v.minOrder != null ? v.minOrder : p.minOrder,
				priceDisplay: v.priceDisplay || p.priceDisplay,
				turnaround: v.turnaround || p.turnaround,
				features: v.features || p.features || []
			}));
		}
		const fallbackImages = (p.images && p.images.length) ? p.images : [p.image];
		return fallbackImages.map((src, i) => ({
			index: i,
			name: p.subcategory ? p.subcategory.split('/')[i % p.subcategory.split('/').length].trim() : ('Variant ' + (i + 1)),
			image: src,
			material: p.material,
			sizes: p.sizes || [],
			finish: p.finish || [],
			minOrder: p.minOrder,
			priceDisplay: p.priceDisplay,
			turnaround: p.turnaround,
			features: p.features || []
		}));
	}

	function renderSpecRows(v) {
		const rows = [
			['Material', v.material],
			['Available sizes', (v.sizes || []).join(', ')],
			['Finishes', (v.finish || []).join(', ')],
			['Minimum order', (v.minOrder != null ? v.minOrder + ' pcs' : '-')],
			['Turnaround', v.turnaround]
		];
		return rows.map(([k, val]) => `
			<div class="flex justify-between py-2 border-b border-gray-100">
				<span class="text-gray-500">${escapeHtml(k)}</span>
				<span class="font-medium text-gray-900 text-right" data-spec="${escapeAttr(k)}">${escapeHtml(val || '-')}</span>
			</div>`).join('');
	}

	function renderFeatureList(v) {
		return (v.features || []).map(f => `
			<li class="flex items-center gap-2 text-gray-700" data-feature>
				<i class="fas fa-check-circle text-secondary"></i>${escapeHtml(f)}
			</li>`).join('');
	}

	function renderThumbs(variants, activeIndex) {
		return variants.map((v, i) => `
			<button type="button" class="variant-thumb rounded-lg overflow-hidden border-2 ${i === activeIndex ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-gray-300'} transition-all" data-index="${i}" aria-label="Show ${escapeAttr(v.name)}">
				<img src="${escapeAttr(v.image)}" alt="${escapeHtml(v.name)}" class="w-20 h-20 object-cover" onerror="this.src='${placeholder}'">
			</button>`).join('');
	}

	function renderTabs(variants, activeIndex) {
		return variants.map((v, i) => `
			<button type="button" class="variant-tab px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${i === activeIndex ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}" data-index="${i}" aria-pressed="${i === activeIndex}">
				${escapeHtml(v.name)}
			</button>`).join('');
	}

	function render(product, variants, activeIndex) {
		if (!product) {
			container.innerHTML = `<div class="text-center py-20"><p class="text-xl text-gray-600">Sorry, we couldn't find that product.</p><a href="products.html" class="btn-primary inline-block mt-4">Back to Products</a></div>`;
			return;
		}

		const v = variants[activeIndex];
		const showTabs = variants.length > 1;

		container.innerHTML = `
			<nav class="text-sm text-gray-500 mb-6">
				<a href="index.html" class="hover:text-primary">Home</a> /
				<a href="products.html" class="hover:text-primary">Products</a> /
				<span class="text-gray-700">${escapeHtml(product.title)}</span>
			</nav>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
				<div>
					<div class="rounded-2xl overflow-hidden shadow-lg bg-white">
						<img id="mainImage" src="${escapeAttr(v.image)}" alt="${escapeHtml(product.title)} - ${escapeHtml(v.name)}" class="w-full h-80 object-cover transition-opacity duration-300" onerror="this.src='${placeholder}'">
					</div>
					${showTabs ? `
						<div class="mt-5">
							<p class="text-xs uppercase tracking-wider text-gray-500 mb-2">Variants</p>
							<div class="flex flex-wrap gap-2" id="variantTabs">${renderTabs(variants, activeIndex)}</div>
						</div>
					` : ''}
					<div class="flex gap-3 mt-4 overflow-x-auto pb-2" id="variantThumbs">${renderThumbs(variants, activeIndex)}</div>
				</div>
				<div id="variantDetails" class="variant-panel transition-opacity duration-300">
					<div class="flex items-center gap-3 mb-3">
						<span class="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">${escapeHtml(product.category)}</span>
						<span class="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold" data-variant-name>
							<i class="fas fa-layer-group"></i>${escapeHtml(v.name)}
						</span>
					</div>
					<h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${escapeHtml(product.title)}</h1>
					<p class="text-2xl font-bold text-primary mb-2" data-variant-price>${escapeHtml(v.priceDisplay || '-')}</p>
					<p class="text-gray-600 mb-6"><i class="fas fa-clock text-secondary mr-2"></i><span data-variant-turnaround>${escapeHtml(v.turnaround || '-')}</span></p>
					<p class="text-gray-700 mb-6">${escapeHtml(product.description)}</p>
					<div class="bg-gray-50 rounded-xl p-5 mb-6" id="variantSpecs">${renderSpecRows(v)}</div>
					<ul class="space-y-2 mb-6" id="variantFeatures">${renderFeatureList(v)}</ul>
					<div class="flex flex-col sm:flex-row gap-3">
						<button id="addToQuote" data-id="${escapeAttr(product.id)}" data-variant="${escapeAttr(v.name)}" class="btn-secondary flex items-center justify-center gap-2">
							<i class="far fa-bookmark"></i> Add to Quote
						</button>
						<a href="contact.html?product=${escapeAttr(product.slug)}" class="btn-primary flex items-center justify-center gap-2">
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

		bindVariantSwitcher(variants);
		bindQuoteButton();
	}

	function bindVariantSwitcher(variants) {
		const mainImage = document.getElementById('mainImage');
		const details = document.getElementById('variantDetails');
		const tabs = container.querySelectorAll('.variant-tab');
		const thumbs = container.querySelectorAll('.variant-thumb');

		function activate(index) {
			const v = variants[index];
			if (!v) return;

			details.style.opacity = '0';
			mainImage.style.opacity = '0';

			setTimeout(() => {
				mainImage.src = v.image;
				mainImage.alt = container.querySelector('h1').textContent + ' - ' + v.name;

				const nameEl = details.querySelector('[data-variant-name]');
				if (nameEl) nameEl.innerHTML = '<i class="fas fa-layer-group"></i>' + escapeHtml(v.name);
				const priceEl = details.querySelector('[data-variant-price]');
				if (priceEl) priceEl.textContent = v.priceDisplay || '-';
				const turnaroundEl = details.querySelector('[data-variant-turnaround]');
				if (turnaroundEl) turnaroundEl.textContent = v.turnaround || '-';

				const specs = document.getElementById('variantSpecs');
				if (specs) specs.innerHTML = renderSpecRows(v);
				const features = document.getElementById('variantFeatures');
				if (features) features.innerHTML = renderFeatureList(v);

				const quoteBtn = document.getElementById('addToQuote');
				if (quoteBtn) quoteBtn.dataset.variant = v.name;

				tabs.forEach((t, i) => {
					const active = i === index;
					t.classList.toggle('bg-primary', active);
					t.classList.toggle('text-white', active);
					t.classList.toggle('border-primary', active);
					t.classList.toggle('bg-white', !active);
					t.classList.toggle('text-gray-700', !active);
					t.classList.toggle('border-gray-300', !active);
					t.setAttribute('aria-pressed', active ? 'true' : 'false');
				});

				thumbs.forEach((b, i) => {
					const active = i === index;
					b.classList.toggle('border-primary', active);
					b.classList.toggle('border-transparent', !active);
					b.classList.toggle('ring-2', active);
					b.classList.toggle('ring-primary/30', active);
				});

				details.style.opacity = '1';
				mainImage.style.opacity = '1';
			}, 150);
		}

		tabs.forEach(tab => {
			tab.addEventListener('click', () => activate(parseInt(tab.dataset.index)));
		});
		thumbs.forEach(thumb => {
			thumb.addEventListener('click', () => activate(parseInt(thumb.dataset.index)));
		});
	}

	function bindQuoteButton() {
		const addBtn = document.getElementById('addToQuote');
		if (!addBtn) return;
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
		if (!relatedEl) return;
		if (related.length === 0) {
			relatedEl.innerHTML = '<p class="text-gray-500">No related products.</p>';
			return;
		}
		relatedEl.innerHTML = related.map(r => `
			<a href="product-detail.html?id=${escapeAttr(r.id)}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
				<img src="${escapeAttr(r.image)}" alt="${escapeHtml(r.title)}" class="w-full h-40 object-cover" onerror="this.src='${placeholder}'">
				<div class="p-4">
					<h3 class="font-semibold text-gray-900">${escapeHtml(r.title)}</h3>
					<p class="text-primary font-bold mt-1">${escapeHtml(r.priceDisplay)}</p>
				</div>
			</a>`).join('');
	}

	async function init() {
		const id = getId();
		const allProducts = await loadProducts();
		const product = allProducts.find(p => p.id === id);

		if (!product) {
			container.innerHTML = `<div class="text-center py-20"><p class="text-xl text-gray-600">Sorry, we couldn't find that product.</p><a href="products.html" class="btn-primary inline-block mt-4">Back to Products</a></div>`;
			return;
		}

		const variants = buildVariants(product);
		render(product, variants, 0);
		await renderRelated(product, allProducts);

		if (typeof attachQuoteListeners === 'function') attachQuoteListeners();
		if (typeof syncQuoteButtons === 'function') syncQuoteButtons();
	}

	document.addEventListener('DOMContentLoaded', init);
})();
