(function () {
    'use strict';

    window.APP_CONFIG = {
        paths: {
            productsData: 'data/products.json',
            blogPostsData: 'data/blog-posts.json',
            siteConfig: 'data/config.json',
            galleryData: 'data/gallery.json',
            testimonialsData: 'data/testimonials.json',
            servicesData: 'data/services.json',
            placeholderImage: 'images/placeholder.svg'
        },
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

    window.SITE_CONFIG = null;

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

    function setNested(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }

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

    window.getPlaceholderImage = function () {
        return window.APP_CONFIG.paths.placeholderImage;
    };
})();
