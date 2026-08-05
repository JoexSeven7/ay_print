// Main JavaScript for AY PRINT website

// Global products data for homepage
let productsData = [];

// ============================================
// SECURITY UTILITIES
// ============================================

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
// LOADING OVERLAY — brand-consistent (blue + gold)
// ============================================

const _BRAND = { primary: '#2E90E6', secondary: '#C9A227' };

function createLoadingOverlay() {
    if (document.getElementById('loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-atomic', 'true');
    overlay.innerHTML = `
        <div class="fixed inset-0 z-[9999] hidden flex items-center justify-center"
             style="background:rgba(27,58,91,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">
            <div class="flex flex-col items-center gap-8 loader-enter">
                <div class="relative w-20 h-20">
                    <div class="absolute inset-0 rounded-full"
                         style="background:linear-gradient(135deg,#2E90E6,#C9A227);
                                 animation:loader-breathe 2s ease-in-out infinite;"></div>
                    <div class="absolute inset-[4px] rounded-full bg-[#1b3a5b]/80"></div>
                    <div class="absolute inset-[4px] rounded-full"
                         style="border:3px solid transparent;
                                 border-top-color:#C9A227;
                                 border-right-color:#C9A227;
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

document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="."], a[href^="/"], a[href^="index.html"], a[href^="products.html"], a[href^="product-detail.html"], a[href^="services.html"], a[href^="gallery.html"], a[href^="about.html"], a[href^="blog.html"], a[href^="blog-post.html"], a[href^="contact.html"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.target === '_blank' || this.hasAttribute('download')) return;
            if (this.classList.contains('no-loader')) return;
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) return;

            e.preventDefault();
            showLoader();
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 800);
        });
    });
});

window.addEventListener('load', function() {
    setTimeout(hideLoader, 500);
});

// ============================================
// QUOTE SHORTLIST (localStorage, replaces real-estate "favorites")
// ============================================

function getQuote() {
    return JSON.parse(localStorage.getItem('ayprintQuote') || '[]');
}

function updateQuoteCount() {
    const count = getQuote().length;
    const badges = document.querySelectorAll('#quoteCount');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    });
}

function toggleQuote(id) {
    let quote = getQuote();
    const strId = String(id);
    if (quote.includes(strId)) {
        quote = quote.filter(x => x !== strId);
    } else {
        quote.push(strId);
    }
    localStorage.setItem('ayprintQuote', JSON.stringify(quote));
    updateQuoteCount();
    syncQuoteButtons();
}

function syncQuoteButtons() {
    const quote = getQuote();
    document.querySelectorAll('.quote-btn').forEach(btn => {
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

// Delegated handler for all "Add to Quote" buttons
let quoteDelegated = false;
function attachQuoteListeners() {
    if (!quoteDelegated) {
        quoteDelegated = true;
        document.addEventListener('click', function(e) {
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

const embeddedProductsData = [
    {
        "id": 1, "title": "Business Cards", "slug": "business-cards", "category": "cards",
        "subcategory": "Standard / Premium / Spot-UV", "material": "300gsm Art Card",
        "sizes": ["85x55mm", "90x50mm"], "finish": ["Matte", "Gloss", "Soft-touch"],
        "minOrder": 100, "price": 0, "priceDisplay": "From ₦15,000 / 100 pcs",
        "turnaround": "2-3 business days", "features": ["Full colour both sides", "Free design", "Fast turnaround"],
        "image": "images/products/business-cards.jpg",
        "images": ["images/products/business-cards.jpg", "images/products/business-cards-2.jpg"],
        "description": "Make a lasting first impression with premium business cards printed on 300gsm art card.",
        "options": ["Paper type", "Size", "Finish", "Quantity"], "featured": true, "createdAt": "2026-08-05"
    },
    {
        "id": 2, "title": "Flyers & Leaflets", "slug": "flyers-leaflets", "category": "flyers",
        "subcategory": "A5 / A6 / DL", "material": "150gsm Gloss Art",
        "sizes": ["A6", "A5", "DL", "A4"], "finish": ["Gloss", "Matte"],
        "minOrder": 500, "price": 0, "priceDisplay": "From ₦25,000 / 500 pcs",
        "turnaround": "2-4 business days", "features": ["Vivid full-colour print", "Bulk discounts", "Folded options"],
        "image": "images/products/flyers.jpg",
        "images": ["images/products/flyers.jpg", "images/products/flyers-2.jpg"],
        "description": "Promote events, sales and menus with high-impact flyers and leaflets.",
        "options": ["Size", "Paper weight", "Finish", "Quantity"], "featured": true, "createdAt": "2026-08-05"
    },
    {
        "id": 3, "title": "Branded Tote & Paper Bags", "slug": "branded-bags", "category": "bags",
        "subcategory": "Tote / Gift / Paper", "material": "100% Cotton / Kraft Paper",
        "sizes": ["Small", "Medium", "Large"], "finish": ["Screen print", "Full-colour"],
        "minOrder": 50, "price": 0, "priceDisplay": "From ₦450 / pc",
        "turnaround": "5-7 business days", "features": ["Eco-friendly options", "Reusable", "Custom artwork"],
        "image": "images/products/bags.jpg",
        "images": ["images/products/bags.jpg", "images/products/bags-2.jpg"],
        "description": "Carry your brand everywhere with custom tote bags and premium paper gift bags.",
        "options": ["Bag type", "Size", "Print method", "Quantity"], "featured": true, "createdAt": "2026-08-05"
    }
];

async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        productsData = data.products;
        return productsData;
    } catch (error) {
        console.error('Error loading products:', error);
        if (window.location.protocol === 'file:') {
            productsData = embeddedProductsData;
            return productsData;
        }
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
                <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.title)}" class="w-full h-48 object-cover" onerror="this.src='images/placeholder.svg'">
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

    const featured = products.filter(p => p.featured).slice(0, 4);
    const display = featured.length > 0 ? featured : products.slice(0, 4);

    if (display.length === 0) {
        track.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-gray-600">No products available at the moment.</p></div>`;
        return;
    }

    track.innerHTML = display.map(generateProductCard).join('');
    attachQuoteListeners();
    syncQuoteButtons();
}

document.addEventListener('DOMContentLoaded', async function() {
    await fetchProducts();
    renderFeaturedProducts(productsData);

    updateQuoteCount();
    attachQuoteListeners();
    syncQuoteButtons();

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.classList.remove('bg-white/60');
                navbar.classList.add('bg-gray-100/95');
            } else {
                navbar.classList.remove('bg-gray-100/95');
                navbar.classList.add('bg-white/60');
            }
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
            } else {
                backToTop.classList.add('opacity-0', 'invisible');
                backToTop.classList.remove('opacity-100', 'visible');
            }
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Animated Counter for Stats
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
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
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counter);
    });

    // Newsletter Form (Formspree)
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    if (newsletterEmail) {
        newsletterEmail.addEventListener('blur', () => validateEmailInput(newsletterEmail));
    }
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = newsletterEmail.value;
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                newsletterEmail.classList.add('border-red-500');
                newsletterEmail.focus();
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
                    headers: { 'Accept': 'application/json' }
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
                if (typeof hideLoader === 'function') setTimeout(hideLoader, 1200);
            }
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

console.log('AY PRINT website loaded successfully!');
