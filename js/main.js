/**
 * Main JavaScript for AY PRINT website.
 * Handles security utilities, form validation, dynamic content loading,
 * UI interactions, product rendering, and site-wide initialization.
 */

// Global array to cache fetched product data across page loads
let productsData = [];

// ============================================
// SECURITY UTILITIES
// Provides HTML/attribute escaping to prevent XSS attacks
// when rendering user-controllable or externally-fetched data into the DOM.
// ============================================

/**
 * Escapes a string for safe insertion into HTML body content.
 * I used this because any data fetched from JSON files or
 * entered by users could contain HTML/JS that would execute
 * if injected directly into the DOM (XSS attack).
 * Replaces characters that could break out of an HTML context
 * (&, <, >, ", ') into their corresponding HTML entities.
 * Non-string values are returned unchanged to avoid side effects.
 * @param {*} unsafe - The value to escape
 * @returns {*} The escaped string, or the original value if not a string
 */
function escapeHtml(unsafe) {
	if (typeof unsafe !== 'string') return unsafe;
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

/**
 * Escapes a string for safe insertion into an HTML attribute context.
 * I used a separate function from escapeHtml because attribute
 * contexts need fewer characters escaped (no need to escape < and >
 * in most attribute values), and keeping them separate makes the
 * intent clear when reading the code.
 * @param {*} value - The value to escape
 * @returns {*} The escaped string, or the original value if not a string
 */
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

/**
 * Validates an email address format using a standard regex pattern.
 * I chose this regex because it covers the vast majority of valid
 * email formats while rejecting clearly invalid ones.
 * For a production system, a more RFC-compliant regex would be used,
 * but this balances accuracy with simplicity.
 * Used for both inline form validation and submit-time gate checks.
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email format is valid
 */
function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validates a Nigerian phone number format.
 * I restricted this to +234 or 0 prefix + 10 digits because
 * AY PRINT operates in Nigeria where phone numbers follow
 * this pattern. Spaces are stripped before validation to
 * allow formatted input like "0801 234 5678" which users
 * naturally type.
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if the phone format is valid
 */
function validatePhone(phone) {
	const phoneRegex = /^(\+234|0)[0-9]{10}$/;
	return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Validates an email input element in real-time on blur.
 * I used Tailwind border color classes (red/gray) for feedback
 * because they're already part of the design system — no extra
 * CSS needed. Only flags invalid when the field is non-empty
 * so optional fields can remain blank without showing errors.
 * @param {HTMLInputElement} inputElement - The email input element to validate
 * @returns {boolean} True if valid or empty
 */
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

/**
 * Validates a phone input element in real-time on blur.
 * Mirrors validateEmailInput's UX pattern: toggles border color classes
 * for visual feedback and only flags invalid for non-empty values.
 * @param {HTMLInputElement} inputElement - The phone input element to validate
 * @returns {boolean} True if valid or empty
 */
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

/**
 * Whitelist of product category slugs permitted in the system.
 * I used an array whitelist instead of regex because the product
 * categories are a fixed, known set — a whitelist is clearer and
 * more maintainable than trying to match a pattern. This prevents
 * injection of arbitrary values through the contact form.
 */
const ALLOWED_PRODUCTS = [
	'business-cards', 'flyers-leaflets', 'branded-bags', 'roll-up-banners',
	'sticks-labels', 'brochures-catalogues', 'posters', 'large-format', 'other'
];

/**
 * Regex for validating personal names.
 * I used Unicode property escapes (\p{L}) to support international
 * names ( Yoruba, Igbo, Hausa names with diacritics). The pattern
 * requires at least one letter at the start and caps at 50 chars.
 * Maximum length: 50 characters.
 */
const NAME_REGEX = /^[\p{L}][\p{L} .\x27-]{0,49}$/u;

/**
 * Validates a person's name.
 * I reject purely numeric/d symbolic strings with the digit test
 * to prevent someone submitting "12345" or "---" as a name.
 * Trims whitespace before validation.
 * @param {string} name - The name to validate
 * @returns {boolean} True if the name passes validation rules
 */
function validateName(name) {
	const v = (name || '').trim();
	if (!v) return false;
	if (/^[\d\s\-+().]+$/.test(v)) return false;
	return NAME_REGEX.test(v);
}

/**
 * Validates that a product value is in the ALLOWED_PRODUCTS whitelist.
 * Used on the contact/quote form to ensure the selected product interest
 * matches a known product category slug.
 * @param {string} value - The product category value to validate
 * @returns {boolean} True if the value is a recognized product category
 */
function validateProduct(value) {
	return ALLOWED_PRODUCTS.includes((value || '').trim());
}

/**
 * Sanitizes free-text input by stripping all characters except letters,
 * numbers, common punctuation (, . ! ? ; : ' " - and whitespace/newlines),
 * then truncating to a maximum length. I used this on the contact form
 * message field and other text inputs that might eventually be stored
 * or displayed, to strip any potential malicious characters.
 * @param {string} raw - The raw input string to sanitize
 * @param {number} [max] - Maximum character length (defaults to APP_CONFIG limit)
 * @returns {string} The sanitized and truncated string
 */
function sanitizeText(raw, max) {
	max = max || window.APP_CONFIG.limits.sanitizeTextMax;
	return (raw || '').replace(/[^\p{L}\p{N} ,.!?;:\x22\x27\-()\n]/gu, '').slice(0, max);
}

/**
 * Extracts only digit characters from a phone number string.
 * Used to normalize phone input for comparison, validation, or storage
 * while discarding formatting characters like spaces, dashes, and parens.
 * @param {string} phone - The phone number string to normalize
 * @returns {string} The digits-only string
 */
function normalizePhoneDigits(phone) {
	return (phone || '').replace(/\D/g, '');
}

/**
 * Validates a name input element in real-time on blur.
 * Uses validateName() for the validation logic and toggles Tailwind border
 * color classes for visual feedback. Same pattern as validateEmailInput.
 * @param {HTMLInputElement} inputElement - The name input element to validate
 * @returns {boolean} True if valid or empty
 */
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

/**
 * Loads the site configuration from the server via fetchSiteConfig.
 * I used async/await here because fetchSiteConfig returns a Promise,
 * and subsequent steps (populateConfigElements, setFormActions) need
 * the config to be ready first. The optional chaining on fetchSiteConfig
 * handles the case where config.js hasn't loaded yet.
 */
async function loadSiteConfig() {
	const config = await fetchSiteConfig?.();
	if (!config) return;

	if (typeof populateConfigElements === 'function') {
		populateConfigElements();
	}

	setFormActions(config);
}

/**
 * Replaces placeholder Formspree form endpoints with the real
 * endpoint from the server-side config. I used this approach
 * because it allows the Formspree ID to be configured centrally
 * in data/config.json without editing HTML files — critical
 * for deploying across staging/production with different endpoints.
 * @param {Object} config - The loaded site configuration object
 */
function setFormActions(config) {
	const formspreeEndpoint = config?.formspree?.endpoint;
	if (formspreeEndpoint) {
		document.querySelectorAll('form[action^="https://formspree.io/f/FORMSPREE_ID"]').forEach(form => {
			form.action = formspreeEndpoint;
		});
	}
}

/**
 * Generates HTML for a star rating display using Font Awesome icons.
 * I used Font Awesome stars (fas/far) because they're already
 * loaded by the site's fontawesome.css and don't require additional
 * icon libraries. The half-star (fa-star-half-alt) provides
 * granular ratings (e.g., 4.5 stars).
 * @param {number} rating - Numeric rating (e.g., 4.5)
 * @returns {string} HTML string of star icons
 */
function renderStarRating(rating) {
	const full = Math.floor(rating);
	const hasHalf = rating % 1 >= 0.5;
	const empty = 5 - full - (hasHalf ? 1 : 0);
	let html = '<i class="fas fa-star"></i>'.repeat(full);
	if (hasHalf) html += '<i class="fas fa-star-half-alt"></i>';
	html += '<i class="far fa-star"></i>'.repeat(empty);
	return html;
}

/**
 * Extracts the first two initials from a person's full name.
 * Splits on spaces, takes the first character of each word,
 * concatenates, and uppercases. Capped at 2 characters.
 * Used for avatar placeholders in testimonials.
 * @param {string} name - The full name
 * @returns {string} Up to 2 uppercase initials
 */
function getInitials(name) {
	return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
}

/**
 * Fetches testimonials data from the configured JSON endpoint
 * and delegates rendering to renderTestimonials().
 * I used try/catch here because network requests can fail
 * (offline, server down) — we don't want a single failed
 * fetch to crash the entire page initialization.
 */
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

/**
 * Renders an array of testimonial objects into the DOM container
 * (#testimonialsContainer). I used escapeHtml on all user data
 * (name, quote, title) because testimonials come from external
 * sources and could contain malicious HTML/JS.
 * The avatar uses getInitials() to avoid requiring profile images.
 * @param {Array} testimonials - Array of testimonial data objects
 */
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

/**
 * Fetches services data from the configured JSON endpoint
 * and delegates rendering to renderServices(). Each service card
 * is rendered to all elements with [data-services-container],
 * allowing the same data to populate multiple page sections.
 */
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

/**
 * Renders an array of service objects into all [data-services-container] elements.
 * I used querySelectorAll to find ALL matching containers (not just one)
 * because the same service data appears on both the homepage and
 * services.html. Injecting the same HTML into each container
 * avoids duplicate fetch calls and keeps content consistent.
 * @param {Array} services - Array of service data objects
 */
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

/**
 * Applies the WhatsApp link from SITE_CONFIG to all elements
 * marked with [data-whatsapp-link]. This allows the WhatsApp URL
 * to be configured centrally in data/config.json rather than
 * hardcoded in HTML, simplifying updates.
 */
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

/**
 * Reads the brand color configuration from APP_CONFIG.
 * Falls back to default primary (#2E90E6) and secondary (#C9A227)
 * if branding config is missing. Used to style the loading overlay.
 */
const _BRAND = window.APP_CONFIG.branding || {
	primary: '#2E90E6',
	secondary: '#C9A227'
};

/**
 * Creates the full-page loading overlay element on first call.
 * I used a semi-transparent dark background with blur (backdrop-filter)
 * to focus user attention on the loading state while preventing
 * interaction with content underneath. CSS animations are injected
 * as a <style> element only once (gated by ID check) to avoid
 * duplicate style elements on rapid page transitions.
 */
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

/**
 * Displays the loading overlay by removing the 'hidden' class
 * from its inner container and adding 'flex', and setting
 * body overflow to 'hidden' to prevent scrolling during page transitions.
 */
function showLoader() {
	const el = document.getElementById('loading-overlay');
	if (el) {
		const inner = el.querySelector('div');
		inner.classList.remove('hidden');
		inner.classList.add('flex');
		document.body.style.overflow = 'hidden';
	}
}

/**
 * Hides the loading overlay by adding the 'hidden' class
 * and restoring body scroll. Called after initial page load
 * or before navigation to a new page.
 */
function hideLoader() {
	const el = document.getElementById('loading-overlay');
	if (el) {
		el.querySelector('div').classList.add('hidden');
		document.body.style.overflow = '';
	}
}

/**
 * Initializes the loading overlay immediately when DOM is ready.
 * Uses a guard (document.readyState check) to handle both
 * early and late script execution scenarios.
 */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', createLoadingOverlay);
} else {
	createLoadingOverlay();
}

// ============================================
// INTERNAL LINK NAVIGATION WITH LOADER
// Intercepts internal link clicks to show a loading
// spinner before navigating, creating a smoother
// page transition experience.
// ============================================

/**
 * Attaches click handlers to all internal links (relative,
 * absolute root, and specific page links). Excludes:
 * - Links opening in new tabs (target="_blank")
 * - Download links
 * - Links with 'no-loader' class (e.g., external or special links)
 * - Anchor links (href starts with '#')
 * When triggered: prevents default navigation, shows loader,
 * then redirects after a configurable delay (loaderNavigateDelay).
 */
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

/**
 * Retrieves the current quote shortlist from localStorage.
 * Uses the quoteStorageKey from APP_CONFIG.limits as the
 * localStorage key. Returns an empty array if nothing is stored.
 * @returns {Array<string>} Array of product IDs in the quote list
 */
function getQuote() {
	return JSON.parse(localStorage.getItem(window.APP_CONFIG.limits.quoteStorageKey) || '[]');
}

/**
 * Updates the quote count badge across all matching DOM elements.
 * Reads the quote list length, updates text content, and toggles
 * the 'hidden' class so the badge is invisible when count is 0.
 */
function updateQuoteCount() {
	const count = getQuote().length;
	const badges = document.querySelectorAll('#quoteCount');
	badges.forEach((badge) => {
		badge.textContent = count;
		badge.classList.toggle('hidden', count === 0);
	});
}

/**
 * Toggles a product ID in the quote shortlist stored in localStorage.
 * If the ID exists, it is removed; otherwise it is added.
 * After mutation, updates the badge count and syncs all quote
 * button icons across the page to reflect the new state.
 * @param {string|number} id - The product ID to toggle
 */
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

/**
 * Syncs the visual state of all quote buttons (.quote-btn)
 * with the current quote list from localStorage. For each button:
 * - If product is in quote: switches icon from far (outline) to fas (solid) + gold color, updates tooltip
 * - If not in quote: switches icon back to far (outline), removes gold color, updates tooltip
 * Uses event delegation for efficiency (attached once via attachQuoteListeners).
 */
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

// Flag to prevent attaching the delegated quote listener multiple times
let quoteDelegated = false;

/**
 * Attaches a single delegated click listener to document for
 * quote button interactions. Uses closest('.quote-btn') to handle
 * clicks on the icon or any child element within the button.
 * The flag quoteDelegated ensures the listener is attached only once,
 * even if the function is called from multiple initialization paths.
 */
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

/**
 * Fetches product data from the configured JSON endpoint
 * and stores it in the module-level productsData array.
 * I used a module-level variable (productsData) as a cache
 * so that renderFeaturedProducts and other consumers
 * can access the data without re-fetching.
 * @returns {Promise<Array>} Array of product objects
 */
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

/**
 * Generates HTML for a single product card used on the homepage
 * and products page. Includes: category badge, featured badge,
 * product image (with SVG fallback on error), quote button,
 * title, subcategory, summary, price display, and turnaround time.
 * All dynamic content passes through escapeHtml/escapeAttr for XSS safety.
 * @param {Object} product - The product data object
 * @returns {string} HTML string for the product card
 */
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
				<p class="text-sm text-gray-600 mb-4">${escapeHtml(product.summary || product.description)}</p>
				<p class="text-lg font-bold text-primary mb-1">${escapeHtml(product.priceDisplay)}</p>
				<p class="text-sm text-gray-600 mb-4"><i class="fas fa-clock text-secondary mr-2"></i>${escapeHtml(product.turnaround)}</p>
				<a href="product-detail.html?id=${escapeAttr(product.id)}" class="block text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
			</div>
		</div>
	`;
}

/**
 * Renders featured products into the homepage carousel track (#carouselTrack).
 * I prefer filtering for featured first, then falling back to all products
 * because featured items are editorially curated — showing them first
 * gives visitors the best products. The limit comes from APP_CONFIG
 * to avoid hardcoding display counts.
 * @param {Array} products - Array of all product objects
 */
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

/**
 * Initializes navbar interactions:
 * 1. Mobile menu toggle (#navToggle) - toggles #mobileMenu visibility
 * 2. Navbar background transition on scroll - switches from
 *    translucent white to solid gray when past threshold
 * 3. Back-to-top button visibility and click handler - fades in
 *    after scrolling past threshold and scrolls to top smoothly
 */
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

/**
 * Initializes animated counter elements ([data-count]).
 * I chose IntersectionObserver instead of a scroll event listener
 * because it's more performant (no scroll event firing on every frame)
 * and semantically correct (triggers when element enters view).
 * requestAnimationFrame provides smooth 60fps animation instead
 * of setInterval which can stutter.
 */
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

/**
 * Initializes the newsletter subscription form.
 * Validates email on blur and on submit. On submit:
 * 1. Validates email format (alerts if invalid)
 * 2. Disables submit button and shows "Subscribing..." text
 * 3. POSTs form data to Formspree endpoint
 * 4. Shows success/failure alert
 * 5. Restores button state and hides loader
 * Uses showLoader/hideLoader from main.js for visual feedback.
 */
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

/**
 * Initializes FAQ accordion behavior.
 * I used nextElementSibling to find the answer because
 * the HTML structure guarantees the answer immediately
 * follows the question element. The rotate-180 class
 * animates the chevron icon to indicate open/closed state
 * via CSS transition (no JS animation needed).
 */
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

/**
 * Initializes smooth scrolling for all anchor links (href starting with '#').
 * I used scrollIntoView with behavior:'smooth' from APP_CONFIG
 * because it's a native browser API that handles edge cases
 * (fixed headers, etc.) better than custom scroll implementations.
 * The behavior value can be 'smooth' or 'auto' via config.
 */
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

/**
 * Main initialization entry point. Runs on DOMContentLoaded.
 * I sequenced the awaits in this specific order because:
 * 1. Site config must load first (everything depends on it)
 * 2. Testimonials/services need config paths to fetch
 * 3. WhatsApp links need config to set URLs
 * 4. Products are fetched for the featured section
 * 5. Quote system initializes after products (so quote buttons render)
 * 6. UI components (navbar, counters, forms) are independent and last
 * This ordering prevents race conditions while keeping
 * independent operations grouped for efficiency.
 */
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
