// ========================================
// Language Toggle
// ========================================
function initLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    langToggle.addEventListener('click', () => {
        // Toggle language
        const newLang = CONFIG.lang === 'en' ? 'es' : 'en';
        CONFIG.lang = newLang;

        // Save to localStorage
        localStorage.setItem('lang', newLang);

        // Reload page to apply changes
        location.reload();
    });
}

// Load saved language preference
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
        CONFIG.lang = savedLang;
    }
}

// ========================================
// Publication Filters
// ========================================
// NOTE: initFilters is defined in publications.js with full timeline support.
// Do not define it here to avoid conflicts.

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Initialize on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Load saved language preference FIRST
    loadLanguagePreference();

    // Determine current page
    const path = window.location.pathname;
    const currentPage = path.includes('publications') ? 'publications' : 'home';

    // Initialize components
    initComponents(currentPage);

    // Initialize language toggle
    initLanguageToggle();

    // Initialize smooth scroll
    initSmoothScroll();
});
