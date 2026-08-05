// Property detail page JavaScript - Dynamic JSON-based implementation

// ===== SECURITY UTILITIES =====
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

// Global property data
let currentProperty = null;
let allProperties = [];

// ===== FAVORITE UTILITIES =====
function getFavorites() {
    return JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
}

// Embedded fallback data - kept in sync with data/properties.json
const propertyDetailData = [
    {
        "id": 1, "title": "Luxury Shortlet Apartment", "slug": "luxury-shortlet-apartment", "type": "residential", "status": "shortlet", "location": "Lekki Ikate", "address": "Lekki Ikate, Lagos", "bedrooms": 5, "bathrooms": 6, "size": 120, "price": 150000, "priceDisplay": "₦150,000/night", "features": ["parking", "pool", "gym", "security", "wifi", "kitchen"], "amenities": ["Swimming Pool", "Gym Access", "24/7 Security", "Parking Space", "High-speed WiFi", "Fully Equipped Kitchen", "Housekeeping Service", "Concierge"], "image": "images/house7.jpeg", "images": ["images/house7.jpeg","images/housevideo1.jpeg","images/house9.jpeg","images/house1.jpeg","images/house3.jpeg","images/house4.jpeg"], "description": "Experience luxury short-term living in this stunning 2-bedroom apartment with breathtaking city views. This modern residence offers premium finishes and state-of-the-art amenities perfect for business travelers and tourists seeking comfort and convenience.", "highlights": ["2 spacious bedrooms with en-suite bathrooms","Modern open-plan kitchen with premium appliances","Private balcony with panoramic city views","Access to building gym and swimming pool","24/7 security with concierge service","High-speed WiFi and smart TV","Weekly housekeeping service included","Walking distance to restaurants, shopping malls, and business district"], "yearBuilt": 2023, "parkingSpaces": 1, "featured": true, "createdAt": "2024-03-01"
    },
    {
        "id": 2, "title": "Royal pine estate, Lekki", "slug": "modern-apartment-vi", "type": "residential", "status": "rent", "location": "lagos", "address": "Lekki", "bedrooms": 3, "bathrooms": 2, "size": 180, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "security", "gym"], "amenities": ["Gym Access", "24/7 Security", "Parking Space", "Elevator", "Backup Power"], "image": "images/house24.jpeg", "images": ["images/house17.jpeg","images/house18.jpeg","images/house10.jpeg"], "description": "Contemporary 3-bedroom apartment in the heart of Lekki. This modern residence offers stunning city views, premium finishes, and convenient access to Lagos's business district. The open-concept living space is flooded with natural light, featuring a sleek kitchen and spacious bedrooms. Building amenities include a fully equipped gym, elevator access, and reliable backup power.", "highlights": ["3 spacious bedrooms with built-in wardrobes","Modern kitchen with granite countertops","Access to building gym and facilities","Strategic location near business hubs","Reliable power and water supply"], "yearBuilt": 2021, "parkingSpaces": 2, "featured": true, "createdAt": "2024-02-01"
    },
    {
        "id": 3, "title": "Executive Office Space in Abuja", "slug": "executive-office-abuja", "type": "commercial", "status": "rent", "location": "abuja", "address": "Central Business District, Abuja", "bedrooms": 0, "bathrooms": 4, "size": 350, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "security", "elevator", "gym"], "amenities": ["24/7 Security", "Elevator Access", "Backup Power", "Parking Space", "Conference Room"], "image": "images/build6.jpeg", "images": ["images/build6.jpeg","images/build4.jpeg","images/build1.jpeg"], "description": "Premium office space in the heart of Abuja's business district.", "highlights": ["Strategically located in CBD","Modern office layout with flexible spaces","24/7 security and access control","Reliable backup power and water supply","Ample parking space"], "yearBuilt": 2020, "parkingSpaces": 10, "featured": true, "createdAt": "2024-02-10"
    },
    {
        "id": 4, "title": "Beachfront Plot in Port Harcourt", "slug": "beachfront-plot-ph", "type": "land", "status": "sale", "location": "portharcourt", "address": "Oil Mill Field, Port Harcourt", "bedrooms": 0, "bathrooms": 0, "size": 1200, "price": 0, "priceDisplay": "Contact for price", "features": ["security"], "amenities": ["24/7 Security", "Perimeter Fence"], "image": "images/house2.jpeg", "images": ["images/house2.jpeg"], "description": "Prime beachfront plot perfect for development.", "highlights": ["Prime beachfront location","Large land area for development","Secure perimeter fencing","Investment potential","Clear title"], "yearBuilt": null, "parkingSpaces": 0, "featured": true, "createdAt": "2024-02-15"
    },
    {
        "id": 5, "title": "Penthouse Suite in Ikoyi", "slug": "penthouse-ikoyi", "type": "residential", "status": "sale", "location": "lagos", "address": "Ikoyi, Lagos", "bedrooms": 4, "bathrooms": 4, "size": 320, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "pool", "security", "elevator"], "amenities": ["Private Pool", "24/7 Security", "Elevator Access", "Parking Space", "Smart Home System"], "image": "images/house27.jpeg", "images": ["images/house27.jpeg","images/house26.jpeg"], "description": "Luxurious penthouse with panoramic views of Ikoyi. This exclusive residence offers the ultimate in luxury living with private amenities and premium finishes.", "highlights": ["Panoramic city views","Private swimming pool","Smart home automation","Private elevator access","Premium finishes throughout"], "yearBuilt": 2023, "parkingSpaces": 3, "featured": true, "createdAt": "2024-02-20"
    },
    {
        "id": 6, "title": "Commercial Plaza in Ibadan", "slug": "commercial-plaza-ibadan", "type": "commercial", "status": "sale", "location": "ibadan", "address": "Ring Road, Ibadan", "bedrooms": 0, "bathrooms": 8, "size": 2500, "price": 0, "priceDisplay": "Contact for price", "features": ["parking", "security", "elevator"], "amenities": ["24/7 Security", "Elevator Access", "Backup Power", "Parking Space"], "image": "images/build2.jpeg", "images": ["images/build2.jpeg"], "description": "Multi-story commercial plaza in prime location. This income-generating property offers excellent rental potential with multiple units and prime positioning.", "highlights": ["Prime commercial location","Multiple rental units","Reliable power and water","24/7 security","Strong rental income potential"], "yearBuilt": 2019, "parkingSpaces": 20, "featured": false, "createdAt": "2024-02-25"
    }
];

// DOM Elements
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
let currentImageIndex = 0;
let propertyImages = [];


// Fetch properties from JSON file
async function fetchProperties() {
    try {
        const response = await fetch('data/properties.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        allProperties = data.properties;
        return allProperties;
    } catch (error) {
        console.error('Error loading properties:', error);
        
        // Always use embedded fallback when fetch fails
        console.warn('Using embedded fallback data');
        allProperties = propertyDetailData;
        return allProperties;
    }
}

// Get property by ID
function getPropertyById(id) {
    return allProperties.find(p => p.id === parseInt(id));
}

// Show error message
function showError(message) {
    const mainContent = document.querySelector('.py-16');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
                <i class="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                <p class="text-gray-600 mb-6">${message}</p>
                <a href="properties.html" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-navyLight transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Properties
                </a>
            </div>
        `;
    }
}

// Update page content with property data
function updatePageContent(property) {
    if (!property) {
        showError('The requested property could not be found.');
        return;
    }
    
    currentProperty = property;
    
    // Update page title
    document.title = `${escapeHtml(property.title)} | ATHARRYS PROPERTIES LIMITED`;
    
    // Update header section
    const propertyTitle = document.getElementById('propertyTitle');
    const propertyLocation = document.getElementById('propertyLocation');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    
    if (propertyTitle) propertyTitle.textContent = property.title;
    if (propertyLocation) propertyLocation.innerHTML = `<i class="fas fa-map-marker-alt mr-2"></i> ${escapeHtml(property.address)}`;
    if (breadcrumbTitle) breadcrumbTitle.textContent = property.title;
    
    // Update header background image
    const headerSection = document.querySelector('.pt-32.pb-20');
    if (headerSection) {
        headerSection.style.backgroundImage = `url('${escapeAttr(property.image)}')`;
    }
    
    // Update main image
    if (mainImage) {
        mainImage.src = property.image;
        mainImage.alt = property.title;
    }
    
    // Update images array for gallery
    propertyImages = property.images || [property.image];
    updateThumbnails();
    
    // Update status badge
    const propertyStatus = document.getElementById('propertyStatus');
    if (propertyStatus) {
        if (property.status === 'sale') {
            propertyStatus.textContent = 'For Sale';
            propertyStatus.className = 'bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold';
        } else if (property.status === 'shortlet') {
            propertyStatus.textContent = 'Shortlet';
            propertyStatus.className = 'bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold';
        } else {
            propertyStatus.textContent = 'For Rent';
            propertyStatus.className = 'bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold';
        }
    }
    
    // Update featured badge
    const featuredBadge = document.querySelector('.bg-accent');
    if (featuredBadge && !property.featured) {
        featuredBadge.style.display = 'none';
    }
    
    // Update favorite button state
    const favoriteDetailBtn = document.getElementById('favoriteDetailBtn');
    if (favoriteDetailBtn) {
        const icon = favoriteDetailBtn.querySelector('i');
        const propertyId = String(property.id);
        if (getFavorites().includes(propertyId)) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-red-500');
        }
        
        favoriteDetailBtn.addEventListener('click', function() {
            let favorites = getFavorites();
            const isFavorited = favorites.includes(propertyId);
            if (isFavorited) {
                favorites = favorites.filter(id => id !== propertyId);
                icon.classList.remove('fas', 'text-red-500');
                icon.classList.add('far');
            } else {
                favorites.push(propertyId);
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-red-500');
            }
            localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
            updateFavoritesCount();
        });
    }
    
    // Update property specs
    const bedrooms = document.getElementById('bedrooms');
    const bathrooms = document.getElementById('bathrooms');
    const area = document.getElementById('area');
    const parking = document.getElementById('parking');
    
    if (bedrooms) bedrooms.textContent = property.bedrooms || 'N/A';
    if (bathrooms) bathrooms.textContent = property.bathrooms || 'N/A';
    if (area) area.textContent = property.size;
    if (parking) parking.textContent = property.parkingSpaces || 'N/A';
    
     // Update price
     const priceElement = document.getElementById('price');
     const priceLabel = document.getElementById('priceLabel');
     if (priceElement) {
         priceElement.textContent = property.priceDisplay;
     }
     if (priceLabel) {
         priceLabel.textContent = property.status === 'shortlet' ? 'Price/Night' : 'Price';
     }
    
    // Update description
    const description = document.getElementById('propertyDescription');
    if (description) {
        description.textContent = property.description;
    }
    
    // Update highlights
    const highlightsList = document.getElementById('highlightsList');
    if (highlightsList && property.highlights) {
        highlightsList.innerHTML = property.highlights.map(highlight => 
            `<li class="flex items-start gap-3"><i class="fas fa-check-circle text-green-500 mt-1"></i><span>${escapeHtml(highlight)}</span></li>`
        ).join('');
    }
    
    // Update amenities
    const amenitiesList = document.getElementById('amenitiesList');
    if (amenitiesList && property.amenities) {
        amenitiesList.innerHTML = property.amenities.map(amenity => 
            `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <i class="fas fa-check text-primary"></i>
                <span>${escapeHtml(amenity)}</span>
            </div>`
        ).join('');
    }
    
    // Update year built
    const yearBuilt = document.getElementById('yearBuilt');
    if (yearBuilt) {
        yearBuilt.textContent = property.yearBuilt || 'N/A';
    }
    
    // Update property type
    const propertyType = document.getElementById('propertyType');
    if (propertyType) {
        propertyType.textContent = escapeHtml(property.type.charAt(0).toUpperCase() + property.type.slice(1));
    }
    
    // Update contact form property reference
    const propertyInput = document.querySelector('input[name="property"]');
    if (propertyInput) {
        propertyInput.value = escapeHtml(property.title);
    }
    
    // Update schedule viewing form property name
    const viewingPropertyNameInput = document.getElementById('viewingPropertyName');
    if (viewingPropertyNameInput) {
        viewingPropertyNameInput.value = escapeHtml(property.title);
    }
}
// Get similar properties based on current property type/status
function getSimilarProperties(property, limit = 2) {
    if (!property || allProperties.length === 0) return [];
    
    // First try matching by type
    let similar = allProperties.filter(p => p.id !== property.id && p.type === property.type);
    
    // If not enough, try matching by status
    if (similar.length < limit) {
        const byStatus = allProperties.filter(p => 
            p.id !== property.id && 
            p.status === property.status && 
            !similar.some(s => s.id === p.id)
        );
        similar = [...similar, ...byStatus];
    }
    
    // If still not enough, just take any other properties
    if (similar.length < limit) {
        const others = allProperties.filter(p => 
            p.id !== property.id && 
            !similar.some(s => s.id === p.id)
        );
        similar = [...similar, ...others];
    }
    
    return similar.slice(0, limit);
}

// Render similar properties
function renderSimilarProperties() {
    const container = document.getElementById('similarPropertiesList');
    if (!container || !currentProperty) return;
    
    const similar = getSimilarProperties(currentProperty);
    
    if (similar.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-sm">No similar properties found.</p>';
        return;
    }
    
    container.innerHTML = similar.map(prop => `
        <div class="flex gap-4">
            <img src="${escapeAttr(prop.image)}" alt="${escapeHtml(prop.title)}" class="w-24 h-24 object-cover rounded-lg" onerror="this.src='images/build1.jpeg'">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-1">${escapeHtml(prop.title)}</h4>
                <p class="text-sm text-gray-600 mb-2"><i class="fas fa-map-marker-alt text-primary mr-1"></i> ${escapeHtml(prop.address)}</p>
                <a href="property-detail.html?id=${prop.id}" class="text-sm text-primary font-semibold hover:text-blue-700 transition-colors">View Details <i class="fas fa-arrow-right ml-1"></i></a>
            </div>
        </div>
    `).join('');
}
// Update thumbnail gallery
function updateThumbnails() {
    const thumbnailContainer = document.querySelector('.grid.grid-cols-5');
    if (!thumbnailContainer || propertyImages.length === 0) return;
    
    thumbnailContainer.innerHTML = propertyImages.map((img, index) => `
        <div class="thumbnail cursor-pointer border-2 ${index === 0 ? 'border-primary' : 'border-transparent hover:border-gray-300'} rounded-lg overflow-hidden" data-index="${escapeAttr(index)}">
            <img src="${escapeAttr(img)}" alt="Property Image ${escapeHtml(index + 1)}" class="w-full h-20 object-cover" onerror="this.src='images/build1.jpeg'">
        </div>
    `).join('');
    
    // Re-attach thumbnail click events
    const newThumbnails = document.querySelectorAll('.thumbnail');
    newThumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            updateMainImage(index);
        });
    });
}

// Update main image
function updateMainImage(index) {
    if (!mainImage || propertyImages.length === 0) return;
    
    mainImage.src = escapeAttr(propertyImages[index]);
    currentImageIndex = index;
    
    // Update thumbnail active state
    const thumbs = document.querySelectorAll('.thumbnail');
    thumbs.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('border-primary');
            thumb.classList.remove('border-transparent');
        } else {
            thumb.classList.remove('border-primary');
            thumb.classList.add('border-transparent');
        }
    });
}

// Initialize gallery navigation
function initGalleryNavigation() {
    // Previous button
    if (galleryPrev) {
        galleryPrev.addEventListener('click', function() {
            if (propertyImages.length === 0) return;
            currentImageIndex = (currentImageIndex - 1 + propertyImages.length) % propertyImages.length;
            updateMainImage(currentImageIndex);
        });
    }
    
    // Next button
    if (galleryNext) {
        galleryNext.addEventListener('click', function() {
            if (propertyImages.length === 0) return;
            currentImageIndex = (currentImageIndex + 1) % propertyImages.length;
            updateMainImage(currentImageIndex);
        });
    }
    
    // Auto-advance gallery every 5 seconds
    setInterval(() => {
        if (propertyImages.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % propertyImages.length;
            updateMainImage(currentImageIndex);
        }
    }, 5000);
}

// Initialize contact modal
function initContactModal() {
    const contactModal = document.getElementById('contactModal');
    const contactModalContent = document.getElementById('contactModalContent');
    const openContactModal = document.getElementById('openContactModal');
    const closeContactModal = document.getElementById('closeContactModal');
    
    function openModal() {
        if (contactModal && contactModalContent) {
            contactModal.classList.remove('hidden');
            contactModal.classList.add('flex');
            setTimeout(() => {
                contactModalContent.classList.remove('scale-95', 'opacity-0');
                contactModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
    }
    
    function closeModal() {
        if (contactModal && contactModalContent) {
            contactModalContent.classList.remove('scale-100', 'opacity-100');
            contactModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                contactModal.classList.remove('flex');
                contactModal.classList.add('hidden');
            }, 300);
        }
    }
    
    if (openContactModal) {
        openContactModal.addEventListener('click', openModal);
    }
    
    if (closeContactModal) {
        closeContactModal.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Initialize forms
function initForms() {
    // Contact Agent Form - Handle Formspree submission
    const contactAgentForm = document.getElementById('contactAgentForm');
    
    if (contactAgentForm) {
        contactAgentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactAgentForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Show global loader
            if (typeof showLoader === 'function') {
                showLoader();
            }
            
            try {
                const response = await fetch(contactAgentForm.action, {
                    method: 'POST',
                    body: new FormData(contactAgentForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const name = document.getElementById('contactName').value;
                    alert('Thank you ' + name + '! Your message has been sent. Our agent will contact you shortly.');
                    contactAgentForm.reset();
                    
                    // Close modal
                    const contactModal = document.getElementById('contactModal');
                    if (contactModal) {
                        contactModal.classList.add('hidden');
                        contactModal.classList.remove('flex');
                    }
                } else {
                    alert('There was a problem sending your message. Please try again.');
                }
            } catch (error) {
                alert('There was a problem sending your message. Please try again.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                if (typeof hideLoader === 'function') {
                    setTimeout(hideLoader, 1200);
                }
            }
        });
    }
    
    // Schedule Viewing Form - Handle Formspree submission
    const scheduleViewingForm = document.getElementById('scheduleViewingForm');
    
    if (scheduleViewingForm) {
        scheduleViewingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = scheduleViewingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Scheduling...';
            submitBtn.disabled = true;
            
            // Show global loader
            if (typeof showLoader === 'function') {
                showLoader();
            }
            
            try {
                const response = await fetch(scheduleViewingForm.action, {
                    method: 'POST',
                    body: new FormData(scheduleViewingForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const date = document.getElementById('viewingDate').value;
                    const time = document.getElementById('viewingTime').value;
                    alert('Thank you! Your viewing has been scheduled for ' + date + ' at ' + time + '. Our agent will confirm the appointment.');
                    scheduleViewingForm.reset();
                } else {
                    alert('There was a problem scheduling your viewing. Please try again.');
                }
            } catch (error) {
                alert('There was a problem scheduling your viewing. Please try again.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                if (typeof hideLoader === 'function') {
                    setTimeout(hideLoader, 1200);
                }
            }
        });
    }
}

// Initialize share buttons
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = window.location.href;
            const title = currentProperty ? currentProperty.title : 'Property Details';
            
             if (this.classList.contains('facebook')) {
                 window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
             } else if (this.classList.contains('twitter')) {
                 window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
             } else if (this.classList.contains('tiktok')) {
                 window.open(`https://www.tiktok.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
             } else if (this.classList.contains('whatsapp')) {
                 window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
             } else if (this.classList.contains('email')) {
                 window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
             }
        });
    });
}

function updateFavoritesCount() {
    const count = getFavorites().length;
    const badges = document.querySelectorAll('#favoritesCount');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
    });
}

// Initialize other buttons
function initOtherButtons() {
    // Download Brochure
    const downloadBrochure = document.getElementById('downloadBrochure');
    
    if (downloadBrochure) {
        downloadBrochure.addEventListener('click', function() {
            alert('Property brochure download started!');
        });
    }
    
    // Start Virtual Tour
    const startTour = document.getElementById('startTour');

    // Render similar properties
    renderSimilarProperties();
    
    if (startTour) {
        startTour.addEventListener('click', function() {
            alert('Virtual tour feature coming soon!');
        });
    }
}

// Initialize the page
async function initializePage() {
    // Get property ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (!propertyId) {
        showError('No property specified. Please select a property from the listings.');
        return;
    }
    
    // Fetch properties data
    await fetchProperties();
    
    // Get the specific property
    const property = getPropertyById(propertyId);
    
    if (!property) {
        showError('The requested property could not be found.');
        return;
    }
    
    // Update page content
    updatePageContent(property);
    
    // Initialize gallery navigation
    initGalleryNavigation();
    
    // Initialize contact modal
    initContactModal();
    
    // Update favorites count on load
    updateFavoritesCount();
    
    // Initialize forms
    initForms();
    
    // Initialize share buttons
    initShareButtons();
    
    // Initialize other buttons
    initOtherButtons();
    
    console.log('Property detail page loaded successfully for property ID:', propertyId);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);
