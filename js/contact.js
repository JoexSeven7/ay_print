// Contact / Quote form JavaScript for AY PRINT

(function() {
    'use strict';

    const form = document.getElementById('quoteForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const productSelect = document.getElementById('productInterest');

    // Prefill product interest from ?product=slug
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get('product');
    if (productSlug && productSelect) {
        // Try to match by value first
        let matched = Array.from(productSelect.options).find(o => o.value === productSlug);
        if (matched) matched.selected = true;
    }

    if (emailInput) emailInput.addEventListener('blur', () => {
        if (typeof validateEmailInput === 'function') validateEmailInput(emailInput);
    });
    if (phoneInput) phoneInput.addEventListener('blur', () => {
        if (typeof validatePhoneInput === 'function') validatePhoneInput(phoneInput);
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName') ? document.getElementById('firstName').value : '';
        const email = emailInput ? emailInput.value : '';
        const phone = phoneInput ? phoneInput.value : '';

        if (typeof validateEmail === 'function' && !validateEmail(email)) {
            alert('Please enter a valid email address.');
            if (emailInput) { emailInput.classList.add('border-red-500'); emailInput.focus(); }
            return;
        }
        if (phone && typeof validatePhone === 'function' && !validatePhone(phone)) {
            alert('Please enter a valid phone number (e.g., +234XXXXXXXXXX).');
            if (phoneInput) phoneInput.classList.add('border-red-500');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        if (typeof showLoader === 'function') showLoader();

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                alert('Thank you' + (firstName ? ' ' + firstName : '') + '! Your quote request has been sent. We will get back to you within 24 hours.');
                form.reset();
            } else {
                alert('There was a problem sending your request. Please try again or email us directly.');
            }
        } catch (err) {
            alert('There was a problem sending your request. Please try again or email us directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            if (typeof hideLoader === 'function') setTimeout(hideLoader, 1200);
        }
    });
})();
