// ========================================
// Publications Renderer
// ========================================

// Type order for sorting within year
const TYPE_ORDER = { 'journal': 0, 'conference': 1, 'national': 2 };

/**
 * Copy text to clipboard and show feedback
 */
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.innerHTML;
    button.innerHTML = '✓';
    button.classList.add('copied');
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('copied');
    }, 1500);
  });
}

/**
 * Render a single publication card
 */
function renderPublicationCard(pub, highlightAuthor) {
  const typeClass = pub.type || 'conference';

  // Format authors with highlighting
  const authors = pub.authors
    .map(author => {
      if (author.includes(highlightAuthor.split(',')[0])) {
        return `<strong>${author}</strong>`;
      }
      return author;
    })
    .join('; ');

  // Clean title (remove leading { if present)
  const title = pub.title.replace(/^\{+/, '').replace(/\}+$/, '');

  // Clean venue
  const venue = (pub.venue || '').replace(/^\{+/, '').replace(/\}+$/, '');

  // Build links with copy buttons
  let links = '';
  if (pub.doi) {
    links += `
      <div class="pub-link-group">
        <a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="pub-link">DOI</a>
        <button class="pub-copy" onclick="copyToClipboard('${pub.doi}', this)" title="Copy DOI">
          <span class="pub-copy-id">${pub.doi}</span>
        </button>
      </div>`;
  }
  if (pub.arxiv) {
    links += `
      <div class="pub-link-group">
        <a href="https://arxiv.org/abs/${pub.arxiv}" target="_blank" rel="noopener" class="pub-link pub-link-arxiv">arXiv</a>
        <button class="pub-copy pub-copy-arxiv" onclick="copyToClipboard('${pub.arxiv}', this)" title="Copy arXiv ID">
          <span class="pub-copy-id">${pub.arxiv}</span>
        </button>
      </div>`;
  }
  if (pub.url && !pub.doi) {
    links += `<a href="${pub.url}" target="_blank" rel="noopener" class="pub-link">Link</a>`;
  }

  // Ranking badge
  const ranking = pub.ranking ? `<span class="pub-rank">${pub.ranking}</span>` : '';

  return `
    <article class="pub-card" data-category="${typeClass}" data-year="${pub.year}">
      <div class="pub-stripe"></div>
      <div class="pub-content">
        <div class="pub-header">
          <span class="pub-venue">${venue}</span>
          <span class="pub-year">${pub.year}</span>
          ${ranking}
        </div>
        <h3 class="pub-title">${title}</h3>
        <p class="pub-authors">${authors}</p>
        <div class="pub-links">${links}</div>
      </div>
    </article>
  `;
}

/**
 * Render year separator
 */
function renderYearDivider(year) {
  return `
    <div class="year-divider">
      <span class="year-divider-line"></span>
      <span class="year-divider-text">${year}</span>
      <span class="year-divider-line"></span>
    </div>
  `;
}

/**
 * Render publications grouped by year
 */
function renderPublicationsWithYears(publications, highlightAuthor) {
  // Sort by year (desc), then by type order
  const sorted = [...publications].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return (TYPE_ORDER[a.type] || 1) - (TYPE_ORDER[b.type] || 1);
  });

  let html = '';
  let currentYear = null;

  for (const pub of sorted) {
    if (pub.year !== currentYear) {
      currentYear = pub.year;
      html += renderYearDivider(currentYear);
    }
    html += renderPublicationCard(pub, highlightAuthor);
  }

  return html;
}

/**
 * Render stats section
 */
function renderPubStats(stats) {
  return `
    <div class="stats">
      <div class="stat">
        <div class="stat-number">${stats.journals}</div>
        <div class="stat-label">${t('publications.stats.journals')}</div>
      </div>
      <div class="stat">
        <div class="stat-number">${stats.conferences}</div>
        <div class="stat-label">${t('publications.stats.conferences')}</div>
      </div>
      <div class="stat">
        <div class="stat-number">${stats.national}</div>
        <div class="stat-label">${t('publications.stats.national')}</div>
      </div>
    </div>
  `;
}

/**
 * Render filter buttons
 */
function renderPubFilters() {
  return `
    <div class="pub-filters">
      <button class="pub-filter active" data-filter="all">${t('publications.filters.all')}</button>
      <button class="pub-filter" data-filter="journal">${t('publications.filters.journals')}</button>
      <button class="pub-filter" data-filter="conference">${t('publications.filters.conferences')}</button>
      <button class="pub-filter" data-filter="national">${t('publications.filters.national')}</button>
    </div>
  `;
}

/**
 * Load and render publications from JSON
 */
async function loadPublications() {
  try {
    const response = await fetch('publications.json');
    const data = await response.json();

    const { publications, stats, highlightAuthor } = data;

    // Render stats
    const statsEl = document.getElementById('site-stats');
    if (statsEl) {
      statsEl.innerHTML = renderPubStats(stats);
    }

    // Render filters
    const filtersEl = document.getElementById('site-filters');
    if (filtersEl) {
      filtersEl.innerHTML = renderPubFilters();
      // Re-initialize filter buttons
      initFilters();
    }

    // Render all publications with year dividers
    const listEl = document.getElementById('publications-list');
    if (listEl) {
      listEl.innerHTML = renderPublicationsWithYears(publications, highlightAuthor);
    }

    // Render featured publications (for homepage - no year dividers)
    const featuredEl = document.getElementById('featured-publications');
    if (featuredEl) {
      const featured = publications.filter(p => p.featured);
      featuredEl.innerHTML = featured
        .map(pub => renderPublicationCard(pub, highlightAuthor))
        .join('');
    }

    // Update config stats (for other uses)
    if (CONFIG && CONFIG.stats) {
      CONFIG.stats = stats;
    }

  } catch (error) {
    console.error('Error loading publications:', error);
  }
}

// Export for use
if (typeof module !== 'undefined') {
  module.exports = { loadPublications, renderPublicationCard };
}
