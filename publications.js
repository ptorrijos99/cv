// ========================================
// Publications Renderer
// ========================================

// arXiv icon SVG
const ARXIV_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-1.5 18.75v-1.5h3v1.5h-3zm3.75-4.5c-.75.75-1.125 1.125-1.125 2.25h-2.25c0-1.875.75-2.625 1.5-3.375.75-.75 1.125-1.125 1.125-1.875 0-.75-.75-1.5-1.5-1.5s-1.5.75-1.5 1.5H8.25c0-2.25 1.5-3.75 3.75-3.75s3.75 1.5 3.75 3.75c0 1.5-.75 2.25-1.5 3z"/></svg>';

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

    // Build links
    let links = '';
    if (pub.doi) {
        links += `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="pub-link">DOI</a>`;
    }
    if (pub.arxiv) {
        links += `<a href="https://arxiv.org/abs/${pub.arxiv}" target="_blank" rel="noopener" class="pub-link pub-link-arxiv">${ARXIV_ICON} arXiv</a>`;
    }
    if (pub.url && !pub.doi) {
        links += `<a href="${pub.url}" target="_blank" rel="noopener" class="pub-link">Link</a>`;
    }

    // Ranking badge
    const ranking = pub.ranking ? `<span class="pub-rank">${pub.ranking}</span>` : '';

    return `
    <article class="pub-card" data-category="${typeClass}">
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

        // Render all publications
        const listEl = document.getElementById('publications-list');
        if (listEl) {
            listEl.innerHTML = publications
                .map(pub => renderPublicationCard(pub, highlightAuthor))
                .join('');
        }

        // Render featured publications (for homepage)
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
