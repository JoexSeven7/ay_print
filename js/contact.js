/**
 * Contact / Quote form JavaScript for AY PRINT.
 * Handles form validation (name, email, phone, product, message),
 * honeypot spam protection, submission to Formspree, and
 * URL parameter pre-fill (product slug from ?product=).
 * Reuses validation functions from main.js when available
 * (validateName, validateEmail, validatePhone, validateProduct).
 * Uses IIFE pattern for scope isolation.
 */

(function() {
    "use strict";

    const form = document.getElementById("quoteForm");
    if (!form) return;

    const statusEl = document.getElementById("quoteFormStatus");

    function showStatus(message, type) {
        if (!statusEl) {
            if (type === "error") console.error(message);
            return;
        }
        const isError = type === "error";
        statusEl.textContent = message;
        statusEl.className = "rounded-lg border px-4 py-3 text-sm " + (isError
            ? "border-red-300 bg-red-50 text-red-800"
            : "border-green-300 bg-green-50 text-green-800");
        statusEl.setAttribute("role", isError ? "alert" : "status");
        statusEl.setAttribute("aria-live", isError ? "assertive" : "polite");
        statusEl.classList.remove("hidden");
        statusEl.focus();
    }

    function clearStatus() {
        if (!statusEl) return;
        statusEl.textContent = "";
        statusEl.className = "hidden rounded-lg border px-4 py-3 text-sm";
        statusEl.setAttribute("role", "status");
        statusEl.setAttribute("aria-live", "polite");
    }

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const productSelect = document.getElementById("productInterest");
    const messageInput = document.getElementById("message");
    const honeypot = document.getElementById("company_website");

    /**
     * Pre-fills the product interest dropdown from the URL
     * ?product= query parameter, enabling deep links from
     * product pages directly into the quote form.
     */
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("product");
    if (productSlug && productSelect) {
        const matched = Array.from(productSelect.options).find(function (o) { return o.value === productSlug; });
        if (matched) matched.selected = true;
    }

    /**
     * Toggles error/normal border styling on an input element.
     * Uses Tailwind border classes for visual feedback.
     * @param {HTMLInputElement|HTMLSelectElement} input - The form element
     * @param {boolean} hasError - True to show error state
     */
    function setError(input, hasError) {
        if (!input) return;
        input.classList.toggle("border-red-500", hasError);
        input.classList.toggle("border-gray-300", !hasError);
    }

    /**
     * Validates a name field with configurable requirement.
     * Uses validateName() from main.js if available, otherwise
     * falls back to a simple non-empty check.
     * @param {HTMLInputElement} input - The name input element
     * @param {boolean} required - Whether the field is required
     * @returns {boolean} True if valid
     */
    function validateNameField(input, required) {
        if (!input) return true;
        const value = input.value.trim();
        if (!value) {
            if (required) { setError(input, true); return false; }
            return true;
        }
        const ok = (typeof validateName === "function") ? validateName(value) : (value.length > 0);
        setError(input, !ok);
        return ok;
    }

    if (firstNameInput) firstNameInput.addEventListener("blur", function () { validateNameField(firstNameInput, true); });
    if (lastNameInput) lastNameInput.addEventListener("blur", function () { validateNameField(lastNameInput, false); });
    if (emailInput) emailInput.addEventListener("blur", function () {
        const ok = (typeof validateEmail === "function") ? validateEmail(emailInput.value.trim()) : true;
        setError(emailInput, !ok && emailInput.value.trim() !== "");
    });
    if (phoneInput) phoneInput.addEventListener("blur", function () {
        const v = phoneInput.value.trim();
        const ok = (typeof validatePhone === "function") ? validatePhone(v) : true;
        setError(phoneInput, !ok && v !== "");
    });
    if (messageInput) messageInput.addEventListener("blur", function () {
        setError(messageInput, messageInput.value.trim() === "");
    });

    async function setFormActionFromConfig() {
        const endpoint = window.SITE_CONFIG?.formspree?.endpoint;
        if (endpoint) {
            form.action = endpoint;
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearStatus();

        if (honeypot && honeypot.value.trim() !== "") {
            return;
        }

        await setFormActionFromConfig();

        const firstName = firstNameInput ? firstNameInput.value : "";
        const lastName = lastNameInput ? lastNameInput.value : "";
        const email = emailInput ? emailInput.value : "";
        const phone = phoneInput ? phoneInput.value : "";
        const product = productSelect ? productSelect.value : "";
        const message = messageInput ? messageInput.value : "";

        let firstInvalid = null;
        const fail = function (input) { if (input && !firstInvalid) firstInvalid = input; };

        if (!validateNameField(firstNameInput, true)) { fail(firstNameInput); }
        validateNameField(lastNameInput, false);
        if (typeof validateEmail === "function" && !validateEmail(email)) { setError(emailInput, true); fail(emailInput); }
        else { setError(emailInput, false); }

        if (phone && typeof validatePhone === "function" && !validatePhone(phone)) { setError(phoneInput, true); fail(phoneInput); }
        else { setError(phoneInput, false); }

        // Allow empty product selection (optional field); only validate when a value is chosen
        if (product && typeof validateProduct === "function" && !validateProduct(product)) { setError(productSelect, true); fail(productSelect); }
        else { setError(productSelect, false); }

        if (message.trim() === "") { setError(messageInput, true); fail(messageInput); }
        else { setError(messageInput, false); }

        if (firstInvalid) {
            showStatus("Please correct the highlighted fields and try again.", "error");
            firstInvalid.focus();
            return;
        }

        const submitBtn = form.querySelector("button[type=\"submit\"]");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
        if (typeof showLoader === "function") showLoader();

        try {
            await setFormActionFromConfig();
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { "Accept": "application/json" }
            });
            if (response.ok) {
                const displayName = (typeof sanitizeText === "function") ? sanitizeText(firstName, 50) : firstName;
                showStatus("Thank you" + (displayName ? " " + displayName : "") + "! Your quote request has been sent. We will get back to you within 24 hours.", "success");
                form.reset();
                [firstNameInput, lastNameInput, emailInput, phoneInput, productSelect, messageInput].forEach(function (i) { if (i) setError(i, false); });
            } else {
                showStatus("There was a problem sending your request. Please try again or email us directly.", "error");
            }
        } catch (err) {
            showStatus("There was a problem sending your request. Please try again or email us directly.", "error");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            if (typeof hideLoader === "function") setTimeout(hideLoader, window.APP_CONFIG.thresholds.hideLoaderDelay);
        }
    });
})();
