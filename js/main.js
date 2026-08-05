// Main JavaScript for ATHARRYS PROPERTIES website

// Global properties data for homepage
let propertiesData = [];

// ============================================
// SECURITY UTILITIES
// ============================================

// HTML escape function to prevent XSS attacks
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Escape attribute values to prevent XSS
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

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Nigeria format)
function validatePhone(phone) {
    const phoneRegex = /^(\+234|0)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Validate email input with visual feedback
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

// Validate phone input with visual feedback
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
// LOADING OVERLAY — brand-consistent design
// ============================================

// Brand colours (kept in sync with tailwind.config.js)
const _BRAND = { primary: '#1a2744', secondary: '#8b2635' };

function createLoadingOverlay() {
    if (document.getElementById('loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.setAttribute('aria-live', 'polite');
    overlay.setAttribute('aria-atomic', 'true');
    overlay.innerHTML = `
        <div class="fixed inset-0 z-[9999] hidden flex items-center justify-center"
             style="background:rgba(26,39,68,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);">
            <div class="flex flex-col items-center gap-8 loader-enter">
                <!-- Brand ring -->
                <div class="relative w-20 h-20">
                    <!-- outer glow ring -->
                    <div class="absolute inset-0 rounded-full"
                         style="background:linear-gradient(135deg,#1a2744,#8b2635);
                                animation:loader-breathe 2s ease-in-out infinite;"></div>
                    <!-- inner spinning track -->
                    <div class="absolute inset-[4px] rounded-full bg-[#1a2744]/80"></div>
                    <!-- animated arc -->
                    <div class="absolute inset-[4px] rounded-full"
                         style="border:3px solid transparent;
                                border-top-color:#8b2635;
                                border-right-color:#8b2635;
                                animation:loader-spin 0.9s cubic-bezier(0.5,0,0.5,1) infinite;"></div>
                </div>
                <!-- Brand label -->
                <p class="text-white text-lg font-medium tracking-[0.25em] uppercase"
                   style="font-family:inherit;">
                    ATHARRYS<span class="loading-dots"></span>
                </p>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // ── animated dots ──
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
            /* entrance: fade + scale-up */
            .loader-enter {
                animation: loader-enter 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
            }
            @keyframes loader-enter {
                from { opacity:0; transform:scale(0.85) translateY(12px); }
                to   { opacity:1; transform:scale(1)   translateY(0);   }
            }
            /* ring spin */
            @keyframes loader-spin {
                0%   { transform:rotate(0deg);   }
                100% { transform:rotate(360deg); }
            }
            /* outer glow pulse */
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

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLoadingOverlay);
} else {
    createLoadingOverlay();
}

// ============================================
// INTERNAL LINK NAVIGATION WITH LOADER
// ============================================

// Add click handlers to all internal links and buttons that navigate
document.addEventListener('DOMContentLoaded', function() {
    // Find all internal navigation links (excludes external links, form buttons, etc.)
    const internalLinks = document.querySelectorAll('a[href^="."], a[href^="/"], a[href^="index.html"], a[href^="properties.html"], a[href^="about.html"], a[href^="services.html"], a[href^="blog.html"], a[href^="contact.html"], a[href^="property-detail.html"], a[href^="blog-post.html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip if link has target="_blank" or download attribute
            if (this.target === '_blank' || this.hasAttribute('download')) {
                return;
            }
            // Skip if link has class that indicates it shouldn't trigger loader
            if (this.classList.contains('no-loader')) {
                return;
            }
            // Skip if it's a hash-only link (same page anchor)
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                return;
            }
            
            e.preventDefault();
            showLoader();
            
            // Longer delay to showcase the loader (800ms)
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 800);
        });
    });

    // Also handle buttons that navigate (like Contact Us buttons that go to contact.html)
    const navButtons = document.querySelectorAll('button[onclick*="location.href"], button[data-navigate]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('onclick')?.match(/location\.href\s*=\s*['"](.+?)['"]/)?.[1] 
                        || this.getAttribute('data-navigate');
            if (target && !target.startsWith('http')) {
                showLoader();
                setTimeout(() => {
                    window.location.href = target;
                }, 800);
            }
        });
    });
});

// Hide loader when page is fully loaded (useful for page refreshes/back navigation)
window.addEventListener('load', function() {
    setTimeout(hideLoader, 500);
});

 // Embedded fallback data - kept in sync with data/properties.json
 const embeddedPropertiesData = [
     {
         "id": 1, "title": "Luxury Shortlet Apartment", "slug": "luxury-shortlet-apartment", "type": "residential", "status": "shortlet", "location": "Lekki Ikate", "address": "Lekki Ikate, Lagos", "bedrooms": 5, "bathrooms": 6, "size": 120, "price": 150000, "priceDisplay": "₦150,000/night", "features": ["parking", "pool", "gym", "security", "wifi", "kitchen"], "image": "images/house7.jpeg", "images": ["images/house7.jpeg","images/housevideo1.jpeg","images/house9.jpeg","images/house1.jpeg","images/house3.jpeg","images/house4.jpeg"], "description": "Experience luxury short-term living in this stunning 2-bedroom apartment with breathtaking city views. This modern residence offers premium finishes and state-of-the-art amenities perfect for business travelers and tourists seeking comfort and convenience.", "featured": true, "createdAt": "2024-03-01"
     },
     {
         "id": 2, "title": "Royal pine estate, Lekki", "slug": "modern-apartment-vi", "type": "residential", "status": "rent", "location": "lagos", "address": "Lekki", "bedrooms": 3, "bathrooms": 2, "size": 180, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "security", "gym"], "image": "images/house24.jpeg", "images": ["images/house17.jpeg","images/house18.jpeg","images/house10.jpeg"], "description": "Contemporary 3-bedroom apartment in the heart of Lekki. This modern residence offers stunning city views, premium finishes, and convenient access to Lagos's business district. The open-concept living space is flooded with natural light, featuring a sleek kitchen and spacious bedrooms. Building amenities include a fully equipped gym, elevator access, and reliable backup power.", "featured": true, "createdAt": "2024-02-01"
     },
     {
         "id": 3, "title": "Executive Office Space in Abuja", "slug": "executive-office-abuja", "type": "commercial", "status": "rent", "location": "abuja", "address": "Central Business District, Abuja", "bedrooms": 0, "bathrooms": 4, "size": 350, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "security", "elevator", "gym"], "image": "images/build6.jpeg", "images": ["images/build6.jpeg","images/build4.jpeg","images/build1.jpeg"], "description": "Premium office space in the heart of Abuja's business district. This contemporary workspace offers modern amenities, reliable power supply, and 24-hour security. Perfect for businesses seeking a prestigious address with all conveniences.", "featured": true, "createdAt": "2024-02-10"
     },
     {
         "id": 4, "title": "Beachfront Plot in Port Harcourt", "slug": "beachfront-plot-ph", "type": "land", "status": "sale", "location": "portharcourt", "address": "Oil Mill Field, Port Harcourt", "bedrooms": 0, "bathrooms": 0, "size": 1200, "price": 0, "priceDisplay": "Contact for price", "features": ["security"], "image": "images/house2.jpeg", "images": ["images/house2.jpeg"], "description": "Prime beachfront plot perfect for development. This extensive land parcel offers great investment potential with beach access and secure perimeter.", "featured": true, "createdAt": "2024-02-15"
     },
     {
         "id": 5, "title": "Penthouse Suite in Ikoyi", "slug": "penthouse-ikoyi", "type": "residential", "status": "sale", "location": "lagos", "address": "Ikoyi, Lagos", "bedrooms": 4, "bathrooms": 4, "size": 320, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "pool", "security", "elevator"], "image": "images/house27.jpeg", "images": ["images/house27.jpeg","images/house26.jpeg"], "description": "Luxurious penthouse with panoramic views of Ikoyi. This exclusive residence offers the ultimate in luxury living with private amenities and premium finishes.", "featured": true, "createdAt": "2024-02-20"
     },
     {
         "id": 6, "title": "Commercial Plaza in Ibadan", "slug": "commercial-plaza-ibadan", "type": "commercial", "status": "sale", "location": "ibadan", "address": "Ring Road, Ibadan", "bedrooms": 0, "bathrooms": 8, "size": 2500, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "security", "elevator"], "image": "images/build2.jpeg", "images": ["images/build2.jpeg"], "description": "Multi-story commercial plaza in prime location. This income-generating property offers excellent rental potential with multiple units and prime positioning.", "featured": false, "createdAt": "2024-02-25"
     }
 ];

// Fetch properties from JSON file
async function fetchProperties() {
    try {
        const response = await fetch('data/properties.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        propertiesData = data.properties;
        return propertiesData;
    } catch (error) {
        console.error('Error loading properties:', error);
        
        // Check if running from file:// protocol
        const isFileProtocol = window.location.protocol === 'file:';
        if (isFileProtocol) {
            console.warn('Running from file:// protocol - using embedded fallback data');
            propertiesData = embeddedPropertiesData;
            return propertiesData;
        }
        return [];
    }
}

// Generate property card HTML for homepage
function generatePropertyCard(property) {
    const statusBadge = property.status === 'sale' 
        ? '<span class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">For Sale</span>'
        : property.status === 'rent'
        ? '<span class="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">For Rent</span>'
        : '<span class="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Shortlet</span>';
    
    const featuredBadge = property.featured 
        ? '<span class="absolute top-4 left-4 bg-accent text-green-500 px-3 py-1 rounded-full text-sm font-semibold">Featured</span>'
        : '';
    
    // Handle different property types for display
    let specsDisplay = '';
    if (property.type === 'commercial') {
        specsDisplay = `
<span><i class="fas fa-building mr-1"></i> ${property.floors || 'Multi'} Floors</span>
<span><i class="fas fa-swimming-pool mr-1"></i> 1</span>
        `;
    } else if (property.type === 'land') {
        specsDisplay = `
            <span><i class="fas fa-swimming-pool mr-1"></i> 1</span>
        `;
    } else {
        specsDisplay = `
            <span><i class="fas fa-bed mr-1"></i> ${property.bedrooms} Beds</span>
            <span><i class="fas fa-bath mr-1"></i> ${property.bathrooms} Baths</span>
            <span><i class="fas fa-swimming-pool mr-1"></i>${property.pool} Pool</span>
        `;
    }
    
    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="relative">
                <img src="${escapeAttr(property.image)}" alt="${escapeAttr(property.title)}" class="w-full h-48 object-cover" onerror="this.src='images/build1.jpeg'">
                ${featuredBadge}
                ${statusBadge}
                <button class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors favorite-btn" data-id="${escapeAttr(property.id)}">
                    <i class="far fa-heart text-gray-600"></i>
                </button>
            </div>
            <div class="p-5">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${escapeHtml(property.title)}</h3>
                <p class="text-gray-600 mb-3"><i class="fas fa-map-marker-alt text-primary mr-2"></i> ${escapeHtml(property.address)}</p>
                ${property.price > 0 ? `<p class="text-lg font-bold text-primary mb-3">${escapeHtml(property.priceDisplay)}</p>` : ''}
                <div class="flex justify-between text-sm text-gray-600 mb-4">
                    ${specsDisplay}
                </div>
                <a href="property-detail.html?id=${escapeAttr(property.id)}" class="block text-center border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">View Details</a>
            </div>
        </div>
    `;
}

// Render featured properties on homepage
function renderFeaturedProperties(properties) {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;
    
    // Get featured properties or first 4 properties
    const featuredProperties = properties.filter(p => p.featured).slice(0, 4);
    const displayProperties = featuredProperties.length > 0 ? featuredProperties : properties.slice(0, 4);
    
    if (displayProperties.length === 0) {
        carouselTrack.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-600">No properties available at the moment.</p>
            </div>
        `;
        return;
    }
    
    const propertiesHTML = displayProperties.map(generatePropertyCard).join('');
    carouselTrack.innerHTML = propertiesHTML;
    
    // Attach favorite button listeners
    attachFavoriteListeners();
}

// Attach favorite button listeners
// Attach favorite button listeners via event delegation.
// A single delegated listener (bound only once) prevents the bug where calling
// this after every render added duplicate click handlers, causing a single
// click to toggle a favorite on AND off again (so nothing was saved).
let favoriteDelegated = false;
function attachFavoriteListeners() {
    if (!favoriteDelegated) {
        favoriteDelegated = true;
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.favorite-btn');
            if (!btn) return;
            e.preventDefault();
            const icon = btn.querySelector('i');
            const propertyId = btn.dataset.id;
            const isCurrentlyFavorited = getFavorites().includes(String(propertyId));

            if (isCurrentlyFavorited) {
                icon.classList.remove('fas', 'text-red-500');
                icon.classList.add('far');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-red-500');
            }

            let favorites = getFavorites();
            if (isCurrentlyFavorited) {
                favorites = favorites.filter(id => id !== String(propertyId));
            } else {
                favorites.push(String(propertyId));
            }
            localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
            updateFavoritesCount();
        });
    }

    // Sync visual states for all current favorite buttons (runs on every render)
    const favorites = getFavorites();
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const icon = btn.querySelector('i');
        if (!icon) return;
        if (favorites.includes(btn.dataset.id)) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-red-500');
        } else {
            icon.classList.remove('fas', 'text-red-500');
            icon.classList.add('far');
        }
    });
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
}

function updateFavoritesCount() {
    const count = getFavorites().length;
    const badges = document.querySelectorAll('#favoritesCount');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    // Load properties for homepage
    await fetchProperties();
    renderFeaturedProperties(propertiesData);
    renderFeaturedShortlets();
    
    // Update favorites count on load
    updateFavoritesCount();
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.classList.remove('bg-white/80');
                navbar.classList.add('bg-gray-100/95');
            } else {
                navbar.classList.remove('bg-gray-100/95');
                navbar.classList.add('bg-white/80');
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
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
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
        
        // Start animation when element is in view
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

    // Newsletter Form - Handle Formspree submission
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    
    if (newsletterEmail) {
        newsletterEmail.addEventListener('blur', function() {
            validateEmailInput(this);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = newsletterEmail.value;
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                if (newsletterEmail) {
                    newsletterEmail.classList.add('border-red-500');
                    newsletterEmail.focus();
                }
                return;
            }
            
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Show global loader
            if (typeof showLoader === 'function') {
                showLoader();
            }
            
            try {
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: new FormData(newsletterForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    alert('Thank you for subscribing! You will receive our newsletter at: ' + escapeHtml(email));
                    newsletterForm.reset();
                } else {
                    alert('There was a problem subscribing. Please try again.');
                }
            } catch (error) {
                alert('There was a problem subscribing. Please try again.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                if (typeof hideLoader === 'function') {
                    setTimeout(hideLoader, 1200);
                }
            }
        });
    }

    // Sidebar Newsletter Form
    const sidebarNewsletterForm = document.getElementById('sidebarNewsletterForm');
    
    if (sidebarNewsletterForm) {
        sidebarNewsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = sidebarNewsletterForm.querySelector('input[type="email"]').value;
            const submitBtn = sidebarNewsletterForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn?.textContent || 'Subscribe';
            
            if (submitBtn) {
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
            }
            
            // Show global loader
            if (typeof showLoader === 'function') {
                showLoader();
            }
            
            try {
                if (sidebarNewsletterForm.action && sidebarNewsletterForm.action.includes('formspree')) {
                    const response = await fetch(sidebarNewsletterForm.action, {
                        method: 'POST',
                        body: new FormData(sidebarNewsletterForm),
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.ok) {
                        alert('Thank you for subscribing! You will receive our newsletter at: ' + email);
                        sidebarNewsletterForm.reset();
                    } else {
                        alert('There was a problem subscribing. Please try again.');
                    }
                } else {
                    // Simulate form submission
                    await new Promise(resolve => setTimeout(resolve, 800));
                    alert('Thank you for subscribing! You will receive our newsletter at: ' + email);
                    sidebarNewsletterForm.reset();
                }
            } catch (error) {
                alert('There was a problem subscribing. Please try again.');
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
                if (typeof hideLoader === 'function') {
                    setTimeout(hideLoader, 500);
                }
            }
        });
    }

    // Quick Search Form
    const quickSearchForm = document.getElementById('quickSearchForm');
    
    if (quickSearchForm) {
        quickSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const propertyType = document.getElementById('propertyType').value;
            const location = document.getElementById('location').value;
            
            // Redirect to properties page with filters
            window.location.href = 'properties.html?type=' + propertyType + '&location=' + location;
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle answer visibility
            answer.classList.toggle('hidden');
            
            // Rotate icon
            icon.classList.toggle('rotate-180');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

// Map tabs for contact page
    const mapTabs = document.querySelectorAll('.map-tab');
    const officeCards = document.querySelectorAll('.office-card');
    const officeMap = document.getElementById('officeMap');
    
    if (mapTabs.length > 0) {
        const mapUrls = {
            lagos: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728639489274!2d3.4472!3d6.4398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e7648d%3A0x4d01e5de6b847fe!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890',
            abuja: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728639489274!2d7.4952!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b8c8c8c8c8%3A0x4d01e5de6b847fe!2sAsokoro%2C%20Abuja!5e0!3m2!1sen!2sng!4v1234567890',
            portharcourt: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.728639489274!2d7.0134!3d4.8156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b8c8c8c8c8%3A0x4d01e5de6b847fe!2sGRA%2C%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1234567890'
        };
        
        mapTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const location = this.getAttribute('data-location');
                
                // Update active tab
                mapTabs.forEach(t => {
                    t.classList.remove('bg-primary', 'text-white');
                    t.classList.add('bg-gray-200', 'text-gray-700');
                });
                this.classList.remove('bg-gray-200', 'text-gray-700');
                this.classList.add('bg-primary', 'text-white');
                
                // Update office cards
                officeCards.forEach(card => {
                    if (card.getAttribute('data-location') === location) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                // Update map
                if (officeMap && mapUrls[location]) {
                    officeMap.src = mapUrls[location];
                }
            });
        });
    }

    // View toggle for properties page
    const viewBtns = document.querySelectorAll('.view-btn');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (viewBtns.length > 0 && propertiesGrid) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Update active button
                viewBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-600');
                });
                this.classList.remove('bg-gray-200', 'text-gray-600');
                this.classList.add('bg-primary', 'text-white');
                
                // Update grid layout
                if (view === 'list') {
                    propertiesGrid.classList.remove('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3');
                    propertiesGrid.classList.add('grid-cols-1');
                } else {
                    propertiesGrid.classList.remove('grid-cols-1');
                    propertiesGrid.classList.add('grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3');
                }
            });
        });
    }

    // Contact Agent Form
    const contactAgentForm = document.getElementById('contactAgentForm');
    
    if (contactAgentForm) {
        contactAgentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            
            // Simulate form submission
            alert('Thank you ' + name + '! Your message has been sent. Our agent will contact you shortly.');
            contactAgentForm.reset();
        });
    }

    // Schedule Viewing Form
    const scheduleViewingForm = document.getElementById('scheduleViewingForm');
    
    if (scheduleViewingForm) {
        scheduleViewingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const date = document.getElementById('viewingDate').value;
            const time = document.getElementById('viewingTime').value;
            
            // Simulate form submission
            alert('Thank you! Your viewing has been scheduled for ' + date + ' at ' + time + '. Our agent will confirm the appointment.');
            scheduleViewingForm.reset();
        });
    }

    // Download Brochure
    const downloadBrochure = document.getElementById('downloadBrochure');
    
    if (downloadBrochure) {
        downloadBrochure.addEventListener('click', function() {
            alert('Property brochure download started!');
        });
    }

    // Start Virtual Tour
    const startTour = document.getElementById('startTour');
    
    if (startTour) {
        startTour.addEventListener('click', function() {
            alert('Virtual tour feature coming soon!');
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Add validation listeners for contact form
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmailInput(this);
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            validatePhoneInput(this);
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = emailInput.value;
            const phone = phoneInput.value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                emailInput.classList.add('border-red-500');
                emailInput.focus();
                return;
            }
            
            // Validate phone (optional but if provided should be valid)
            if (phone && !validatePhone(phone)) {
                alert('Please enter a valid phone number (e.g., +234XXXXXXXXXX).');
                phoneInput.classList.add('border-red-500');
                return;
            }
            
            // Simulate form submission
            alert('Thank you ' + escapeHtml(firstName) + '! Your message has been sent. We will get back to you within 24 hours.');
            contactForm.reset();
        });
    }

    // Property Search Form
    const propertySearchForm = document.getElementById('propertySearchForm');
    
    if (propertySearchForm) {
        propertySearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Search filters applied!');
        });
    }

    // Reset Filters
    const resetFilters = document.getElementById('resetFilters');
    
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            if (propertySearchForm) {
                propertySearchForm.reset();
            }
        });
    }

      // Sort Properties
      const sortProperties = document.getElementById('sortProperties');
      
      if (sortProperties) {
          sortProperties.addEventListener('change', function() {
              const sortBy = this.value;
              alert('Properties sorted by: ' + sortBy);
          });
      }

      // Render featured shortlet properties on homepage
      function renderFeaturedShortlets() {
          const carouselTrackShortlet = document.getElementById('carouselTrackShortlet');
          const prevBtnShortlet = document.getElementById('prevBtnShortlet');
          const nextBtnShortlet = document.getElementById('nextBtnShortlet');
          
          if (!carouselTrackShortlet) return;
          
          // Get featured shortlet properties
          const featuredShortlets = propertiesData.filter(p => p.featured && p.status === 'shortlet');
          const displayShortlets = featuredShortlets.length > 0 ? featuredShortlets : 
                                 propertiesData.filter(p => p.status === 'shortlet').slice(0, 3);
          
          if (displayShortlets.length === 0) {
              carouselTrackShortlet.innerHTML = `
                  <div class="col-span-full text-center py-12">
                      <p class="text-gray-600">No shortlet properties available at the moment.</p>
                  </div>
              `;
              
              // Hide navigation buttons if no properties
              if (prevBtnShortlet) prevBtnShortlet.style.display = 'none';
              if (nextBtnShortlet) nextBtnShortlet.style.display = 'none';
              return;
          }
          
          // Show navigation buttons
          if (prevBtnShortlet) prevBtnShortlet.style.display = 'block';
          if (nextBtnShortlet) nextBtnShortlet.style.display = 'block';
          
          // For now, we'll just display the properties without carousel functionality
          // In a full implementation, you would add carousel logic here
          const shortletsHTML = displayShortlets.map(generatePropertyCard).join('');
          carouselTrackShortlet.innerHTML = shortletsHTML;
          
          // Attach favorite button listeners to newly added buttons
          attachFavoriteListeners();
      }

      console.log('ATHARRYS PROPERTIES website loaded successfully!');
});
