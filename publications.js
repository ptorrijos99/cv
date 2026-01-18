// ========================================
// Publications Renderer - Timeline Style
// ========================================

// Type order for sorting within year
const TYPE_ORDER = { 'journal': 0, 'conference': 1, 'workshop': 2, 'national': 3 };

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
 * Generate publication links HTML
 */
function getPubLinks(pub) {
  let links = '';
  if (pub.doi) {
    links += `
      <div class="pub-link-group">
        <a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="pub-link">🔗 DOI</a>
        <button class="pub-copy" onclick="copyToClipboard('${pub.doi}', this)" title="Copy DOI">
          <span class="pub-copy-id">${pub.doi}</span>
        </button>
      </div>`;
  }
  if (pub.arxiv) {
    links += `
      <div class="pub-link-group">
        <a href="https://arxiv.org/abs/${pub.arxiv}" target="_blank" rel="noopener" class="pub-link pub-link-arxiv">📄 arXiv</a>
        <button class="pub-copy pub-copy-arxiv" onclick="copyToClipboard('${pub.arxiv}', this)" title="Copy arXiv ID">
          <span class="pub-copy-id">${pub.arxiv}</span>
        </button>
      </div>`;
  }
  if (pub.url && !pub.doi) {
    links += `<a href="${pub.url}" target="_blank" rel="noopener" class="pub-link">🔗 Link</a>`;
  }
  return links;
}

/**
 * Render a single publication card for timeline
 */
function renderPublicationCard(pub, highlightAuthor, index) {
  const typeClass = pub.type || 'conference';

  const authors = formatAuthors(pub.authors, highlightAuthor);
  const title = pub.title.replace(/^\{+/, '').replace(/\}+$/, '');
  const venue = (pub.venue || '').replace(/^\{+/, '').replace(/\}+$/, '');
  const links = getPubLinks(pub);
  const ranking = pub.ranking ? `<span class="pub-rank">${pub.ranking}</span>` : '';

  return `
    <article class="timeline-item" data-category="${typeClass}" data-year="${pub.year}" style="--delay: ${(index % 5) * 0.1}s">
      <div class="timeline-dot"></div>
      <div class="pub-card" data-category="${typeClass}">
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
      </div>
    </article>
  `;
}

/**
 * Render simple publication card (for homepage featured, no timeline wrapper)
 */
function renderSimpleCard(pub, highlightAuthor) {
  const typeClass = pub.type || 'conference';

  const authors = formatAuthors(pub.authors, highlightAuthor);
  const title = pub.title.replace(/^\{+/, '').replace(/\}+$/, '');
  const venue = (pub.venue || '').replace(/^\{+/, '').replace(/\}+$/, '');
  const links = getPubLinks(pub);
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
 * Format authors helper
 */
function formatAuthors(authorsList, highlightAuthor) {
  return authorsList
    .map(author => {
      if (author.includes(highlightAuthor.split(',')[0])) {
        return `<strong>${author}</strong>`;
      }
      return author;
    })
    .join('; ');
}

/**
 * Render year marker for timeline
 */
function renderYearMarker(year) {
  return `
    <div class="timeline-year-marker">
      <div class="timeline-year-badge">${year}</div>
    </div>
  `;
}

/**
 * Render publications as timeline grouped by year
 */
function renderTimeline(publications, highlightAuthor) {
  // Sort by year (desc), then by type order
  const sorted = [...publications].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    const typeA = TYPE_ORDER[a.type] !== undefined ? TYPE_ORDER[a.type] : 1;
    const typeB = TYPE_ORDER[b.type] !== undefined ? TYPE_ORDER[b.type] : 1;
    return typeA - typeB;
  });

  let html = '<div class="timeline">';
  let currentYear = null;
  let itemIndex = 0;

  for (const pub of sorted) {
    if (pub.year !== currentYear) {
      currentYear = pub.year;
      html += renderYearMarker(currentYear);
      itemIndex = 0;
    }
    html += renderPublicationCard(pub, highlightAuthor, itemIndex);
    itemIndex++;
  }

  html += '</div>';
  return html;
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.timeline-item, .timeline-year-marker').forEach(el => {
    observer.observe(el);
  });
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
        <div class="stat-number">${stats.workshops}</div>
        <div class="stat-label">Int. Workshops</div>
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
      <button class="pub-filter" data-filter="workshop">Int. Workshops</button>
      <button class="pub-filter" data-filter="national">${t('publications.filters.national')}</button>
    </div>
  `;
}

/**
 * Initialize filter functionality
 */
function initFilters() {
  const buttons = document.querySelectorAll('.pub-filter');
  const items = document.querySelectorAll('.timeline-item');
  const itemsArray = Array.from(items);

  // Define the filter logic as a reusable function
  function applyFilter(filter) {
    // 1. Filter items
    itemsArray.forEach(item => {
      const category = (item.dataset.category || '').trim();
      const matches = filter === 'all' || category === filter;

      if (matches) {
        item.classList.remove('hidden-item');
        setTimeout(() => item.classList.add('visible'), 10);
      } else {
        item.classList.add('hidden-item');
        item.classList.remove('visible');
      }
    });

    // 2. Update year markers visibility
    document.querySelectorAll('.timeline-year-marker').forEach(marker => {
      const yearBadge = marker.querySelector('.timeline-year-badge');
      if (!yearBadge) return;

      const yearText = yearBadge.textContent.trim();
      let hasVisibleItems = false;

      for (const item of itemsArray) {
        const itemYear = (item.dataset.year || '').trim();
        if (!item.classList.contains('hidden-item') && itemYear === yearText) {
          hasVisibleItems = true;
          break;
        }
      }

      if (hasVisibleItems) {
        marker.classList.remove('hidden-item');
        setTimeout(() => marker.classList.add('visible'), 10);
      } else {
        marker.classList.add('hidden-item');
        marker.classList.remove('visible');
      }
    });

    // 3. Update timeline connectors
    const allElements = document.querySelectorAll('.timeline-item, .timeline-year-marker');
    let lastVisibleItem = null;

    // First, remove all no-connect-down classes
    itemsArray.forEach(item => item.classList.remove('no-connect-down'));

    allElements.forEach(el => {
      if (el.classList.contains('hidden-item')) return;

      if (el.classList.contains('timeline-item')) {
        if (lastVisibleItem) {
          lastVisibleItem.classList.remove('no-connect-down');
        }
        lastVisibleItem = el;
      } else if (el.classList.contains('timeline-year-marker')) {
        if (lastVisibleItem) {
          lastVisibleItem.classList.add('no-connect-down');
        }
        lastVisibleItem = null;
      }
    });

    if (lastVisibleItem) {
      lastVisibleItem.classList.add('no-connect-down');
    }
  }

  // Attach click handlers
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });

  // Manually trigger initial "all" filter after a delay to ensure DOM is ready
  setTimeout(() => {
    applyFilter('all');
  }, 150);
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
      // Init filters is called below after everything is rendered
    }

    // Render timeline for publications page
    const listEl = document.getElementById('publications-list');
    if (listEl) {
      listEl.innerHTML = renderTimeline(publications, highlightAuthor);
      // Initialize scroll animations after rendering
      setTimeout(initScrollAnimations, 100);
      // Initialize filters AFTER rendering items
      initFilters();
    }

    // Render featured publications (for homepage - simple cards, no timeline)
    const featuredEl = document.getElementById('featured-publications');
    if (featuredEl) {
      const featured = publications.filter(p => p.featured);
      featuredEl.innerHTML = featured
        .map((pub) => renderSimpleCard(pub, highlightAuthor))
        .join('');
    }

    // Update config stats
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
