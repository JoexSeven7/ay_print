/**
 * Config module for AY PRINT.
 * Defines the global APP_CONFIG object with paths, thresholds,
 * limits, animations, and branding settings. Also provides
 * utility functions for config-based dynamic content population
 * and placeholder image resolution.
 * All values are centralized here to avoid hardcoded magic strings
 * and numbers throughout the codebase.
 */
(function () {
    'use strict';

    /**
     * Global application configuration object.
     * Contains:
     * - paths: URL paths to JSON data files and assets
     * - thresholds: scroll, timing, and animation thresholds
     * - limits: maximum values and storage keys
     * - animations: scroll and transition behaviors
     * - branding: primary/secondary color values
     */
    window.APP_CONFIG = {
        paths: {
            productsData: 'data/products.json',
            blogPostsData: 'data/blog-posts.json',
            siteConfig: 'data/config.json',
            galleryData: 'data/gallery.json',
            testimonialsData: 'data/testimonials.json',
            servicesData: 'data/services.json',
            placeholderImage: 'images/products/card.jpeg'
        },
        /**
         * Scroll and timing thresholds used across the application.
         * navbarScroll: px scroll before navbar style changes
         * backToTopScroll: px scroll before back-to-top appears
         * counterDuration: ms for counter animation to complete
         * counterTick: ms between counter increments
         * loaderNavigateDelay: ms delay before internal navigation
         * hideLoaderDelay: ms before loader auto-hides after load
         * initialHideDelay: ms before initial loader hides
         * parallaxFactor: scroll multiplier for hero parallax
         * intersectionThreshold: visibility ratio for counter observer
         */
        thresholds: {
            navbarScroll: 50,
            backToTopScroll: 300,
            counterDuration: 2000,
            counterTick: 16,
            loaderNavigateDelay: 800,
            hideLoaderDelay: 1200,
            initialHideDelay: 500,
            parallaxFactor: 0.25,
            intersectionThreshold: 0.5
        },
        /**
         * Application limits and configuration constants.
         * featuredProducts: max featured products on homepage
         * relatedProducts: max related products on detail page
         * sanitizeTextMax: max chars for text sanitization
         * nameMaxLength, emailMaxLength, phoneMaxLength: form field limits
         * quoteStorageKey: localStorage key for quote shortlist
         */
        limits: {
            featuredProducts: 4,
            relatedProducts: 3,
            sanitizeTextMax: 2000,
            nameMaxLength: 50,
            emailMaxLength: 254,
            phoneMaxLength: 20,
            quoteStorageKey: 'ayprintQuote'
        },
        animations: {
            scrollBehavior: 'smooth',
            loaderEnterDuration: 500
        },
        branding: {
            primary: '#2E90E6',
            secondary: '#C9A227',
            primaryDark: '#1b3a5b'
        }
    };

    // Cached server-side site configuration (populated after fetch)
    window.SITE_CONFIG = null;

    /**
     * Fetches the site configuration from data/config.json.
     * Caches the result in window.SITE_CONFIG so subsequent
     * calls return the cached value without re-fetching.
     * Returns null if the fetch fails, allowing graceful degradation.
     * @returns {Promise<Object|null>} Site config or null on failure
     */
    window.fetchSiteConfig = async function () {
        if (window.SITE_CONFIG) return window.SITE_CONFIG;
        try {
            const res = await fetch(window.APP_CONFIG.paths.siteConfig);
            if (res.ok) {
                window.SITE_CONFIG = await res.json();
                return window.SITE_CONFIG;
            }
        } catch (e) {
            console.error('Failed to load site config:', e);
        }
        return null;
    };

    /**
     * Sets a nested property on an object using a dot-separated path.
     * Creates intermediate objects as needed. Used internally
     * for config manipulation tasks.
     * @param {Object} obj - Target object
     * @param {string} path - Dot-separated path (e.g., "a.b.c")
     * @param {*} value - Value to set at the path
     */
    function setNested(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }

    /**
     * Retrieves a value from SITE_CONFIG using a dot-separated path.
     * Returns null if any key in the path is undefined.
     * Used by populateConfigElements to fill data-config attributes.
     * @param {string} path - Dot-separated config path
     * @returns {*} The config value or null
     */
    window.getConfigValue = function (path) {
        if (!window.SITE_CONFIG) return null;
        const keys = path.split('.');
        let current = window.SITE_CONFIG;
        for (const key of keys) {
            if (current[key] === undefined) return null;
            current = current[key];
        }
        return current;
    };

    /**
     * Populates DOM elements with values from SITE_CONFIG.
     * Handles three attribute patterns:
     * 1. [data-config="path.to.value"] - sets textContent
     * 2. [data-config-attr="attr|path.to.value"] - sets attribute
     * 3. [data-config-year] - sets current/fallback year
     * This decouples content from markup, enabling centralized
     * content management via data/config.json.
     */
    window.populateConfigElements = function () {
        if (!window.SITE_CONFIG) return;

        document.querySelectorAll('[data-config]').forEach(el => {
            const path = el.getAttribute('data-config');
            const value = window.getConfigValue(path);
            if (value !== null) {
                el.textContent = value;
            }
        });

        document.querySelectorAll('[data-config-attr]').forEach(el => {
            const parts = el.getAttribute('data-config-attr').split('|');
            if (parts.length !== 2) return;
            const attr = parts[0];
            const path = parts[1];
            const value = window.getConfigValue(path);
            if (value !== null) {
                el.setAttribute(attr, value);
            }
        });

        const yearEls = document.querySelectorAll('[data-config-year]');
        yearEls.forEach(el => {
            const useCurrent = window.getConfigValue('copyright.useCurrentYear');
            if (useCurrent) {
                el.textContent = new Date().getFullYear();
            } else {
                const fallback = window.getConfigValue('copyright.fallbackYear');
                el.textContent = fallback || new Date().getFullYear();
            }
        });
    };

    /**
     * Returns the configured placeholder image path.
     * Used by product cards and galleries when primary
     * images fail to load (onerror fallback).
     * @returns {string} Placeholder image URL
     */
    window.getPlaceholderImage = function () {
        return window.APP_CONFIG.paths.placeholderImage;
    };
})();
