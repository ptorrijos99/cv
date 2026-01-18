// ========================================
// Publication Filters
// ========================================
function initFilters() {
    const filterButtons = document.querySelectorAll('.pub-filter');
    const pubCards = document.querySelectorAll('.pub-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter publications
            pubCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = '';
                    card.removeAttribute('data-hidden');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('data-hidden', 'true');
                }
            });
        });
    });
}

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
    // Determine current page
    const path = window.location.pathname;
    const currentPage = path.includes('publications') ? 'publications' : 'home';

    // Initialize components
    initComponents(currentPage);

    // Initialize smooth scroll
    initSmoothScroll();
});
