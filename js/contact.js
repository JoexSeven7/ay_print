// Contact page JavaScript

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

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form - Handle Formspree submission
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Add validation listeners
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !validateEmail(email)) {
                this.classList.add('border-red-500');
            } else {
                this.classList.remove('border-red-500');
            }
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone && !validatePhone(phone)) {
                this.classList.add('border-red-500');
            } else {
                this.classList.remove('border-red-500');
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value;
            const phone = phoneInput.value;
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                if (emailInput) emailInput.classList.add('border-red-500');
                return;
            }
            
            // Validate phone
            if (phone && !validatePhone(phone)) {
                alert('Please enter a valid phone number (e.g., +234XXXXXXXXXX).');
                phoneInput.classList.add('border-red-500');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Show global loader
            if (typeof showLoader === 'function') {
                showLoader();
            }
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.');
                    contactForm.reset();
                } else {
                    alert('There was a problem sending your message. Please try again or contact us directly.');
                }
            } catch (error) {
                alert('There was a problem sending your message. Please try again or contact us directly.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                // Hide loader after 1.2 second delay so user sees completion
                if (typeof hideLoader === 'function') {
                    setTimeout(hideLoader, 1200);
                }
            }
        });
    }
    
    // Map tabs functionality
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
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle answer visibility
            answer.classList.toggle('hidden');
            
            // Rotate icon
            if (icon) {
                icon.classList.toggle('rotate-180');
            }
        });
    });
    
    // Get property ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property');
    
    if (propertyId && document.getElementById('propertyInterest')) {
        document.getElementById('propertyInterest').value = 'Property ID: ' + propertyId;
    }
    
    console.log('Contact page loaded successfully!');
});
