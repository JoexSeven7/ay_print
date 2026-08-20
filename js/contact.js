// Contact / Quote form JavaScript for AY PRINT

(function() {
    "use strict";

    const form = document.getElementById("quoteForm");
    if (!form) return;

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const productSelect = document.getElementById("productInterest");
    const messageInput = document.getElementById("message");
    const honeypot = document.getElementById("company_website");

    // Prefill product interest from ?product=slug
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("product");
    if (productSlug && productSelect) {
        const matched = Array.from(productSelect.options).find(function (o) { return o.value === productSlug; });
        if (matched) matched.selected = true;
    }

    function setError(input, hasError) {
        if (!input) return;
        input.classList.toggle("border-red-500", hasError);
        input.classList.toggle("border-gray-300", !hasError);
    }

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

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Honeypot: bots auto-fill the hidden field; silently ignore them.
        if (honeypot && honeypot.value.trim() !== "") {
            return;
        }

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

        if (product && typeof validateProduct === "function" && !validateProduct(product)) { setError(productSelect, true); fail(productSelect); }
        else { setError(productSelect, false); }

        if (message.trim() === "") { setError(messageInput, true); fail(messageInput); }
        else { setError(messageInput, false); }

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        const submitBtn = form.querySelector("button[type=\"submit\"]");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
        if (typeof showLoader === "function") showLoader();

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: { "Accept": "application/json" }
            });
            if (response.ok) {
                const displayName = (typeof sanitizeText === "function") ? sanitizeText(firstName, 50) : firstName;
                alert("Thank you" + (displayName ? " " + displayName : "") + "! Your quote request has been sent. We will get back to you within 24 hours.");
                form.reset();
                [firstNameInput, lastNameInput, emailInput, phoneInput, productSelect, messageInput].forEach(function (i) { if (i) setError(i, false); });
            } else {
                alert("There was a problem sending your request. Please try again or email us directly.");
            }
        } catch (err) {
            alert("There was a problem sending your request. Please try again or email us directly.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            if (typeof hideLoader === "function") setTimeout(hideLoader, 1200);
        }
    });
})();
