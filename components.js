// ========================================
// Shared Components
// ========================================

// SVG Icons
const ICONS = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  scholar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>',
  orcid: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/></svg>',
  scopus: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.835 15.025c-.151.388-.368.685-.651.889-.284.204-.637.337-1.06.399-.236.034-.483.052-.74.052H12v-2.209h2.93c.359 0 .641-.084.846-.252.205-.168.308-.421.308-.76 0-.338-.103-.591-.308-.76-.205-.168-.487-.252-.846-.252H12.45c-.557 0-1.053-.088-1.488-.264-.435-.176-.787-.457-1.055-.843-.269-.386-.403-.89-.403-1.512 0-.622.134-1.126.403-1.512.268-.386.62-.667 1.055-.843.435-.176.931-.264 1.488-.264h3.384v2.209h-2.93c-.359 0-.641.084-.846.252-.205.168-.308.421-.308.76 0 .338.103.591.308.76.205.168.487.252.846.252h2.93c.557 0 1.053.088 1.488.264.435.176.787.457 1.055.843.269.386.403.89.403 1.512 0 .389-.05.729-.151 1.019z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>'
};

// Render Header Component
function renderHeader(currentPage = 'home') {
  const { profile } = CONFIG;
  const photoFallback = `https://api.dicebear.com/7.x/initials/svg?seed=PT&backgroundColor=8a0028&textColor=ffffff`;
  const isEnglish = CONFIG.lang === 'en';

  return `
    <header class="header">
      <button id="lang-toggle" class="lang-toggle" aria-label="Change language">
        <span class="${isEnglish ? 'active' : ''}">EN</span>
        <span class="${!isEnglish ? 'active' : ''}">ES</span>
      </button>
      
      <div class="header-content">
        <img src="${profile.photo}" alt="${profile.name}" class="header-photo" 
             onerror="this.src='${photoFallback}'">
        
        <div class="header-info">
          <h1>${profile.name}</h1>
          <p class="header-role">${t('header.role')}</p>
          <p class="header-affiliation">
            ${t('header.affiliation')}<br>
            ${t('header.university')}
          </p>
        </div>
        
        <div class="header-links">
          <a href="mailto:${profile.email}" class="header-link header-link-email">
            ${ICONS.email} ${profile.email}
          </a>
          <a href="${profile.links.scholar}" target="_blank" rel="noopener" class="header-link">
            ${ICONS.scholar} ${t('header.scholar')}
          </a>
          <a href="${profile.links.orcid}" target="_blank" rel="noopener" class="header-link">
            ${ICONS.orcid} ${t('header.orcid')}
          </a>
          <a href="${profile.links.scopus}" target="_blank" rel="noopener" class="header-link">
            ${ICONS.scopus} ${t('header.scopus')}
          </a>
          <a href="${profile.links.github}" target="_blank" rel="noopener" class="header-link">
            ${ICONS.github} ${t('header.github')}
          </a>
        </div>
      </div>
    </header>
  `;
}


// Render Navigation Component
function renderNav(currentPage = 'home') {
  return `
    <nav class="nav">
      <div class="nav-content">
        <a href="index.html" class="nav-link ${currentPage === 'home' ? 'active' : ''}">${t('nav.home')}</a>
        <a href="publications.html" class="nav-link ${currentPage === 'publications' ? 'active' : ''}">${t('nav.publications')}</a>
      </div>
    </nav>
  `;
}

// Render Footer Component
function renderFooter() {
  const simdLogo = CONFIG.lang === 'es' ? CONFIG.logos.simd_es : CONFIG.logos.simd_en;
  const uclmUrl = CONFIG.lang === 'es' ? 'https://www.uclm.es/?sc_lang=es' : 'https://www.uclm.es/?sc_lang=en';

  return `
    <footer class="footer">
      <div class="footer-logos">
        <a href="${uclmUrl}" target="_blank" rel="noopener">
          <img src="${CONFIG.logos.uclm}" alt="UCLM" class="footer-logo">
        </a>
        <a href="https://simd.i3a.uclm.es/" target="_blank" rel="noopener">
          <img src="${simdLogo}" alt="SIMD" class="footer-logo">
        </a>
      </div>
      <p class="footer-text">${t('footer.copyright')}</p>
    </footer>
  `;
}

// Render Stats Component
function renderStats() {
  return `
    <div class="stats">
      <div class="stat">
        <div class="stat-number">${CONFIG.stats.journals}</div>
        <div class="stat-label">${t('publications.stats.journals')}</div>
      </div>
      <div class="stat">
        <div class="stat-number">${CONFIG.stats.conferences}</div>
        <div class="stat-label">${t('publications.stats.conferences')}</div>
      </div>
      <div class="stat">
        <div class="stat-number">${CONFIG.stats.national}</div>
        <div class="stat-label">${t('publications.stats.national')}</div>
      </div>
    </div>
  `;
}

// Render Filters Component
function renderFilters() {
  return `
    <div class="pub-filters">
      <button class="pub-filter active" data-filter="all">${t('publications.filters.all')}</button>
      <button class="pub-filter" data-filter="journal">${t('publications.filters.journals')}</button>
      <button class="pub-filter" data-filter="conference">${t('publications.filters.conferences')}</button>
      <button class="pub-filter" data-filter="national">${t('publications.filters.national')}</button>
    </div>
  `;
}

// Initialize shared components
function initComponents(currentPage = 'home') {
  // Apply config colors
  applyConfig();

  // Set HTML lang attribute
  document.documentElement.lang = CONFIG.lang;

  // Render components into placeholders
  const headerEl = document.getElementById('site-header');
  const navEl = document.getElementById('site-nav');
  const footerEl = document.getElementById('site-footer');
  const statsEl = document.getElementById('site-stats');
  const filtersEl = document.getElementById('site-filters');

  if (headerEl) headerEl.innerHTML = renderHeader(currentPage);
  if (navEl) navEl.innerHTML = renderNav(currentPage);
  if (footerEl) footerEl.innerHTML = renderFooter();
  if (statsEl) statsEl.innerHTML = renderStats();
  if (filtersEl) filtersEl.innerHTML = renderFilters();

  // Initialize filters if present
  if (filtersEl) initFilters();
}

// Export for use in other modules
if (typeof module !== 'undefined') {
  module.exports = { ICONS, renderHeader, renderNav, renderFooter, initComponents };
}
