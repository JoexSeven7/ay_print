// Main JavaScript for AY PRINT website

let productsData = [];

// ============================================
// SECURITY UTILITIES
// ============================================

function escapeHtml(unsafe) {
	if (typeof unsafe !== 'string') return unsafe;
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function escapeAttr(value) {
	if (typeof value !== 'string') return value;
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

// ============================================
// INPUT VALIDATION
// ============================================

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validatePhone(phone) {
	const phoneRegex = /^(\+234|0)[0-9]{10}$/;
	return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function validateEmailInput(inputElement) {
	const email = inputElement.value.trim();
	const isValid = validateEmail(email);
	if (!isValid && email) {
		inputElement.classList.add('border-red-500');
		inputElement.classList.remove('border-gray-300');
		return false;
	}
	inputElement.classList.remove('border-red-500');
	inputElement.classList.add('border-gray-300');
	return true;
}

function validatePhoneInput(inputElement) {
	const phone = inputElement.value.trim();
	const isValid = validatePhone(phone);
	if (!isValid && phone) {
		inputElement.classList.add('border-red-500');
		inputElement.classList.remove('border-gray-300');
		return false;
	}
	inputElement.classList.remove('border-red-500');
	inputElement.classList.add('border-gray-300');
	return true;
}

// ============================================
// NAME / PRODUCT / TEXT VALIDATION HELPERS
// ============================================

const ALLOWED_PRODUCTS = [
	'business-cards', 'flyers-leaflets', 'branded-bags', 'roll-up-banners',
	'sticks-labels', 'brochures-catalogues', 'posters', 'large-format', 'other'
];

const NAME_REGEX = /^[\p{L}][\p{L} .\x27-]{0,49}$/u;

function validateName(name) {
	const v = (name || '').trim();
	if (!v) return false;
	if (/^[\d\s\-+().]+$/.test(v)) return false;
	return NAME_REGEX.test(v);
}

function validateProduct(value) {
	return ALLOWED_PRODUCTS.includes((value || '').trim());
}

function sanitizeText(raw, max) {
	max = max || window.APP_CONFIG.limits.sanitizeTextMax;
	return (raw || '').replace(/[^\p{L}\p{N} ,.!?;:\x22\x27\-()\n]/gu, '').slice(0, max);
}

function normalizePhoneDigits(phone) {
	return (phone || '').replace(/\D/g, '');
}

function validateNameInput(inputElement) {
	const name = inputElement.value.trim();
	const isValid = validateName(name);
	if (!isValid && name) {
		inputElement.classList.add('border-red-500');
		inputElement.classList.remove('border-gray-300');
		return false;
	}
	inputElement.classList.remove('border-red-500');
	inputElement.classList.add('border-gray-300');
	return true;
}

// ============================================
// CONFIG LOADING & DYNAMIC CONTENT POPULATION
// ============================================

async function loadSiteConfig() {
	const config = await fetchSiteConfig?.();
	if (!config) return;

	if (typeof populateConfigElements === 'function') {
		populateConfigElements();
	}

	setFormActions(config);
}

function setFormActions(config) {
	const formspreeEndpoint = config?.formspree?.endpoint;
	if (formspreeEndpoint) {
		document.querySelectorAll('form[action^="https://formspree.io/f/FORMSPREE_ID"]').forEach(form => {
			form.action = formspreeEndpoint;
		});
	}
}

function renderStarRating(rating) {
	const full = Math.floor(rating);
	const hasHalf = rating % 1 >= 0.5;
	const empty = 5 - full - (hasHalf ? 1 : 0);
	let html = '<i class="fas fa-star"></i>'.repeat(full);
	if (hasHalf) html += '<i class="fas fa-star-half-alt"></i>';
	html += '<i class="far fa-star"></i>'.repeat(empty);
	return html;
}

function getInitials(name) {
	return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
}

async function loadTestimonials() {
	try {
		const res = await fetch(window.APP_CONFIG.paths.testimonialsData);
		if (!res.ok) return;
		const data = await res.json();
		renderTestimonials(data.testimonials);
	} catch (e) {
		console.error('Testimonials load failed:', e);
	}
}

function renderTestimonials(testimonials) {
	const container = document.getElementById('testimonialsContainer');
	if (!container) return;
	if (!testimonials || testimonials.length === 0) return;

	container.innerHTML = testimonials.map(t => `
		<div class="bg-gray-50 p-8 rounded-xl">
			<div class="flex text-secondary mb-4">
				${renderStarRating(t.rating)}
			</div>
			<p class="text-gray-600 mb-6">${escapeHtml(t.quote)}</p>
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
					${escapeHtml(getInitials(t.name))}
				</div>
				<div>
					<h4 class="font-semibold text-gray-900">${escapeHtml(t.name)}</h4>
					<p class="text-sm text-gray-600">${escapeHtml(t.title)}</p>
				</div>
			</div>
		</div>
	`).join('');
}

async function loadServices() {
	try {
		const res = await fetch(window.APP_CONFIG.paths.servicesData);
		if (!res.ok) return;
		const data = await res.json();
		renderServices(data.services);
	} catch (e) {
		console.error('Services load failed:', e);
	}
}

function renderServices(services) {
	const containers = document.querySelectorAll('[data-services-container]');
	if (containers.length === 0) return;

	const html = services.map(s => `
		<div class="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
			<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
				<i class="fas ${escapeAttr(s.icon)} text-3xl text-primary"></i>
			</div>
			<h3 class="text-xl font-semibold text-gray-900 mb-3">${escapeHtml(s.title)}</h3>
			<p class="text-gray-600 mb-4">${escapeHtml(s.description)}</p>
			<a href="products.html" class="text-primary font-semibold hover:text-blueLight transition-colors">Learn More <i class="fas fa-arrow-right ml-2"></i></a>
		</div>
	`).join('');

	containers.forEach(container => {
		container.innerHTML = html;
	});
}

function loadWhatsAppLink() {
	const config = window.SITE_CONFIG;
	if (!config) return;
	const waLink = config.contact?.whatsappLink;
	if (waLink) {
		document.querySelectorAll('[data-whatsapp-link]').forEach(el => {
			el.setAttribute('href', waLink);
		});
	}
}

// ============================================
// LOADING OVERLAY
// ============================================

const _BRAND = window.APP_CONFIG.branding || {
	primary: '#2E90E6',
	secondary: '#C9A227'
};

function createLoadingOverlay() {
	if (document.getElementById('loading-overlay')) return;

	const overlay = document.createElement('div');
	overlay.id = 'loading-overlay';
	overlay.setAttribute('aria-live', 'polite');
	overlay.setAttribute('aria-atomic', 'true');
	overlay.innerHTML = `
		<div class="fixed inset-0 z-[9999] hidden flex items-center justify-center"
			style="background:var(--color-loader-overlay,rgba(27,58,91,0.92));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">
			<div class="flex flex-col items-center gap-8 loader-enter">
				<div class="relative w-20 h-20">
					<div class="absolute inset-0 rounded-full"
						style="background:linear-gradient(135deg,var(--color-primary,#2E90E6),var(--color-secondary,#C9A227));
							animation:loader-breathe 2s ease-in-out infinite;"></div>
					<div class="absolute inset-[4px] rounded-full bg-[#1b3a5b]/80"></div>
					<div class="absolute inset-[4px] rounded-full"
						style="border:3px solid transparent;
							border-top-color:var(--color-secondary,#C9A227);
							border-right-color:var(--color-secondary,#C9A227);
							animation:loader-spin 0.9s cubic-bezier(0.5,0,0.5,1) infinite;"></div>
				</div>
				<p class="text-white text-lg font-medium tracking-[0.25em] uppercase"
					style="font-family:inherit;">
					AY PRINT<span class="loading-dots"></span>
				</p>
			</div>
		</div>
	`;
	document.body.appendChild(overlay);

	if (!document.getElementById('loading-dots-style')) {
		const style = document.createElement('style');
		style.id = 'loading-dots-style';
		style.textContent = `
			.loading-dots::after {
				content: '';
				animation: loading-dots 1.6s steps(4,end) infinite;
			}
			@keyframes loading-dots {
				0%,20%  { content:''; }
				40%     { content:'.'; }
				60%     { content:'..'; }
				80%,100%{ content:'...'; }
			}
			.loader-enter {
				animation: loader-enter 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
			}
			@keyframes loader-enter {
				from { opacity:0; transform:scale(0.85) translateY(12px); }
				to   { opacity:1; transform:scale(1)   translateY(0);   }
			}
			@keyframes loader-spin {
				0%   { transform:rotate(0deg);   }
				100% { transform:rotate(360deg); }
			}
			@keyframes loader-breathe {
				0%,100% { opacity:0.6; transform:scale(1);   }
				50%     { opacity:1;   transform:scale(1.04); }
			}
		`;
		document.head.appendChild(style);
	}
}

function showLoader() {
	const el = document.getElementById('loading-overlay');
	if (el) {
		const inner = el.querySelector('div');
		inner.classList.remove('hidden');
		inner.classList.add('flex');
		document.body.style.overflow = 'hidden';
	}
}

function hideLoader() {
	const el = document.getElementById('loading-overlay');
	if (el) {
		el.querySelector('div').classList.add('hidden');
		document.body.style.overflow = '';
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', createLoadingOverlay);
} else {
	createLoadingOverlay();
}

// ============================================
// INTERNAL LINK NAVIGATION WITH LOADER
// ============================================

document.addEventListener('DOMContentLoaded', function () {
	const internalLinks = document.querySelectorAll(
		'a[href^="."], a[href^="/"], a[href^="index.html"], a[href^="products.html"], a[href^="product-detail.html"], a[href^="services.html"], a[href^="gallery.html"], a[href^="about.html"], a[href^="blog.html"], a[href^="blog-post.html"], a[href^="contact.html"]',
	);

	internalLinks.forEach((link) => {
		link.addEventListener('click', function (e) {
			if (this.target === '_blank' || this.hasAttribute('download')) return;
			if (this.classList.contains('no-loader')) return;
			if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) return;

			e.preventDefault();
			showLoader();
			setTimeout(() => {
				window.location.href = this.getAttribute('href');
			}, window.APP_CONFIG.thresholds.loaderNavigateDelay);
		});
	});
});

window.addEventListener('load', function () {
	setTimeout(hideLoader, window.APP_CONFIG.thresholds.initialHideDelay);
});

// ============================================
// QUOTE SHORTLIST (localStorage, replaces real-estate "favorites")
// ============================================

function getQuote() {
	return JSON.parse(localStorage.getItem(window.APP_CONFIG.limits.quoteStorageKey) || '[]');
}

function updateQuoteCount() {
	const count = getQuote().length;
	const badges = document.querySelectorAll('#quoteCount');
	badges.forEach((badge) => {
		badge.textContent = count;
		badge.classList.toggle('hidden', count === 0);
	});
}

function toggleQuote(id) {
	let quote = getQuote();
	const strId = String(id);
	if (quote.includes(strId)) {
		quote = quote.filter((x) => x !== strId);
	} else {
		quote.push(strId);
	}
	localStorage.setItem(window.APP_CONFIG.limits.quoteStorageKey, JSON.stringify(quote));
	updateQuoteCount();
	syncQuoteButtons();
}

function syncQuoteButtons() {
	const quote = getQuote();
	document.querySelectorAll('.quote-btn').forEach((btn) => {
		const id = btn.dataset.id;
		const icon = btn.querySelector('i');
		if (!icon) return;
		if (quote.includes(id)) {
			icon.classList.remove('far');
			icon.classList.add('fas', 'text-gold');
			btn.title = 'Remove from quote';
		} else {
			icon.classList.remove('fas', 'text-gold');
			icon.classList.add('far');
			btn.title = 'Add to quote';
		}
	});
}

let quoteDelegated = false;
function attachQuoteListeners() {
	if (!quoteDelegated) {
		quoteDelegated = true;
		document.addEventListener('click', function (e) {
			const btn = e.target.closest('.quote-btn');
			if (!btn) return;
			e.preventDefault();
			toggleQuote(btn.dataset.id);
		});
	}
}

// ============================================
// HOMEPAGE: fetch products + render featured
// ============================================

async function fetchProducts() {
	try {
		const response = await fetch(window.APP_CONFIG.paths.productsData);
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
		const data = await response.json();
		productsData = data.products;
		return productsData;
	} catch (error) {
		console.error('Error loading products:', error);
		return [];
	}
}

function generateProductCard(product) {
	const categoryBadge = `<span class="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">${escapeHtml(product.category)}</span>`;
	const featuredBadge = product.featured
		? '<span class="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</span>'
		: '';

	return `
		<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow product-card">
			<div class="relative">
				<img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.title)}" class="w-full h-48 object-cover" onerror="this.src='${window.APP_CONFIG.paths.placeholderImage}'">
				${featuredBadge}
				${categoryBadge}
				<button class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors quote-btn" data-id="${escapeAttr(product.id)}" title="Add to quote" aria-label="Add to quote">
					<i class="far fa-bookmark text-gray-600"></i>
				</button>
			</div>
			<div class="p-5">
				<h3 class="text-lg font-semibold text-gray-900 mb-1">${escapeHtml(product.title)}</h3>
				<p class="text-sm text-gray-500 mb-3"><i class="fas fa-layer-group text-primary mr-2"></i>${escapeHtml(product.subcategory)}</p>
				<p class="text-lg font-bold text-primary mb-1">${escapeHtml(product.priceDisplay)}</p>
				<p class="text-sm text-gray-600 mb-4"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(product.turnaround)}</p>
				<a href="product-detail.html?id=${escapeAttr(product.id)}" class="block text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
			</div>
		</div>
	`;
}

function renderFeaturedProducts(products) {
	const track = document.getElementById('carouselTrack');
	if (!track) return;

	const limit = window.APP_CONFIG.limits.featuredProducts;
	const featured = products.filter((p) => p.featured).slice(0, limit);
	const display = featured.length > 0 ? featured : products.slice(0, limit);

	if (display.length === 0) {
		track.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-gray-600">No products available at the moment.</p></div>`;
		return;
	}

	track.innerHTML = display.map(generateProductCard).join('');
	attachQuoteListeners();
	syncQuoteButtons();
}

// ============================================
// NAVBAR INTERACTIONS
// ============================================

function initNavbar() {
	const navToggle = document.getElementById('navToggle');
	const mobileMenu = document.getElementById('mobileMenu');
	if (navToggle && mobileMenu) {
		navToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
	}

	const navbar = document.getElementById('navbar');
	if (navbar) {
		window.addEventListener('scroll', function () {
			if (window.pageYOffset > window.APP_CONFIG.thresholds.navbarScroll) {
				navbar.classList.remove('bg-white/60');
				navbar.classList.add('bg-gray-100/95');
			} else {
				navbar.classList.remove('bg-gray-100/95');
				navbar.classList.add('bg-white/60');
			}
		});
	}

	const backToTop = document.getElementById('backToTop');
	if (backToTop) {
		window.addEventListener('scroll', function () {
			if (window.pageYOffset > window.APP_CONFIG.thresholds.backToTopScroll) {
				backToTop.classList.remove('opacity-0', 'invisible');
				backToTop.classList.add('opacity-100', 'visible');
			} else {
				backToTop.classList.add('opacity-0', 'invisible');
				backToTop.classList.remove('opacity-100', 'visible');
			}
		});
		backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.APP_CONFIG.animations.scrollBehavior }));
	}
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initCounters() {
	const counters = document.querySelectorAll('[data-count]');
	counters.forEach((counter) => {
		const target = parseInt(counter.getAttribute('data-count'));
		const duration = window.APP_CONFIG.thresholds.counterDuration;
		const step = target / (duration / window.APP_CONFIG.thresholds.counterTick);
		let current = 0;
		const updateCounter = () => {
			current += step;
			if (current < target) {
				counter.textContent = Math.floor(current);
				requestAnimationFrame(updateCounter);
			} else {
				counter.textContent = target;
			}
		};
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						updateCounter();
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: window.APP_CONFIG.thresholds.intersectionThreshold },
		);
		observer.observe(counter);
	});
}

// ============================================
// NEWSLETTER FORM (Formspree)
// ============================================

function initNewsletterForm() {
	const newsletterForm = document.getElementById('newsletterForm');
	const newsletterEmail = document.getElementById('newsletterEmail');
	if (newsletterEmail) {
		newsletterEmail.addEventListener('blur', () => validateEmailInput(newsletterEmail));
	}
	if (newsletterForm) {
		newsletterForm.addEventListener('submit', async function (e) {
			e.preventDefault();
			const email = newsletterEmail ? newsletterEmail.value : '';
			if (!validateEmail(email)) {
				alert('Please enter a valid email address.');
				if (newsletterEmail) newsletterEmail.classList.add('border-red-500');
				if (newsletterEmail) newsletterEmail.focus();
				return;
			}
			const submitBtn = newsletterForm.querySelector('button[type="submit"]');
			const originalBtnText = submitBtn.textContent;
			submitBtn.textContent = 'Subscribing...';
			submitBtn.disabled = true;
			if (typeof showLoader === 'function') showLoader();
			try {
				const response = await fetch(newsletterForm.action, {
					method: 'POST',
					body: new FormData(newsletterForm),
					headers: { Accept: 'application/json' },
				});
				if (response.ok) {
					alert('Thank you for subscribing! We will keep you updated at: ' + escapeHtml(email));
					newsletterForm.reset();
				} else {
					alert('There was a problem subscribing. Please try again.');
				}
			} catch (error) {
				alert('There was a problem subscribing. Please try again.');
			} finally {
				submitBtn.textContent = originalBtnText;
				submitBtn.disabled = false;
				if (typeof hideLoader === 'function') setTimeout(hideLoader, window.APP_CONFIG.thresholds.hideLoaderDelay);
			}
		});
	}
}

// ============================================
// FAQ ACCORDION
// ============================================

function initFaqAccordion() {
	document.querySelectorAll('.faq-question').forEach((question) => {
		question.addEventListener('click', function () {
			const answer = this.nextElementSibling;
			const icon = this.querySelector('i');
			answer.classList.toggle('hidden');
			icon.classList.toggle('rotate-180');
		});
	});
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				e.preventDefault();
				target.scrollIntoView({ behavior: window.APP_CONFIG.animations.scrollBehavior, block: 'start' });
			}
		});
	});
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async function () {
	await loadSiteConfig();
	await loadTestimonials();
	await loadServices();
	loadWhatsAppLink();

	await fetchProducts();
	renderFeaturedProducts(productsData);

	updateQuoteCount();
	attachQuoteListeners();
	syncQuoteButtons();

	initNavbar();
	initCounters();
	initNewsletterForm();
	initFaqAccordion();
	initSmoothScroll();
});

console.log('AY PRINT website loaded successfully!');
