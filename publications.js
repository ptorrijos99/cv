// ========================================
// Publications Renderer - Timeline Style
// ========================================

const TYPE_ORDER = { 'journal': 0, 'conference': 1, 'workshop': 2, 'national': 3 };

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

function renderYearMarker(year) {
  return `
    <div class="timeline-year-marker" data-year="${year}">
      <div class="timeline-year-badge">${year}</div>
    </div>
  `;
}

function renderTimeline(publications, highlightAuthor) {
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
        <div class="stat-label">${t('publications.stats.workshops')}</div>
      </div>
      <div class="stat">
        <div class="stat-number">${stats.national}</div>
        <div class="stat-label">${t('publications.stats.national')}</div>
      </div>
    </div>
  `;
}

function renderPubFilters() {
  return `
    <div class="pub-filters" id="pub-filters-container">
      <button class="pub-filter active" data-filter="all">${t('publications.filters.all')}</button>
      <button class="pub-filter" data-filter="journal">${t('publications.filters.journals')}</button>
      <button class="pub-filter" data-filter="conference">${t('publications.filters.conferences')}</button>
      <button class="pub-filter" data-filter="workshop">${t('publications.filters.workshops')}</button>
      <button class="pub-filter" data-filter="national">${t('publications.filters.national')}</button>
    </div>
  `;
}

function initFilters() {
  const container = document.getElementById('pub-filters-container');
  if (!container) return;

  container.addEventListener('click', function (e) {
    const button = e.target.closest('.pub-filter');
    if (!button) return;

    const filter = button.dataset.filter;

    // Update active button
    container.querySelectorAll('.pub-filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    // Filter items and markers
    const items = document.querySelectorAll('.timeline-item');
    const markers = document.querySelectorAll('.timeline-year-marker');

    items.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden-item');
        item.style.display = '';  // Reset to default
      } else {
        item.classList.add('hidden-item');
        item.style.display = 'none';  // Force hide with inline style
      }
    });

    markers.forEach(marker => {
      const year = marker.dataset.year;
      let hasVisibleItems = false;

      items.forEach(item => {
        if (!item.classList.contains('hidden-item') && item.dataset.year === year) {
          hasVisibleItems = true;
        }
      });

      if (hasVisibleItems) {
        marker.classList.remove('hidden-item');
        marker.style.display = '';  // Reset to default
      } else {
        marker.classList.add('hidden-item');
        marker.style.display = 'none';  // Force hide with inline style
      }
    });

    // Update connectors
    updateConnectors();
  });
}

function updateConnectors() {
  const items = document.querySelectorAll('.timeline-item');
  const markers = document.querySelectorAll('.timeline-year-marker');
  const allElements = [...markers, ...items].sort((a, b) => {
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  items.forEach(item => item.classList.remove('no-connect-down'));

  let lastVisibleItem = null;

  allElements.forEach(el => {
    if (el.classList.contains('hidden-item')) return;

    if (el.classList.contains('timeline-item')) {
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

async function loadPublications() {
  try {
    const response = await fetch('publications.json');
    const data = await response.json();
    const { publications, stats, highlightAuthor } = data;

    const statsEl = document.getElementById('site-stats');
    if (statsEl) {
      statsEl.innerHTML = renderPubStats(stats);
    }

    const filtersEl = document.getElementById('site-filters');
    if (filtersEl) {
      filtersEl.innerHTML = renderPubFilters();
    }

    const listEl = document.getElementById('publications-list');
    if (listEl) {
      listEl.innerHTML = renderTimeline(publications, highlightAuthor);
      setTimeout(() => {
        initScrollAnimations();
        initFilters();
      }, 100);
    }

    const featuredEl = document.getElementById('featured-publications');
    if (featuredEl) {
      const featured = publications.filter(p => p.featured);
      featuredEl.innerHTML = featured
        .map((pub) => renderSimpleCard(pub, highlightAuthor))
        .join('');
    }

    // Update CONFIG with loaded stats for use by other components
    if (CONFIG) {
      CONFIG.stats = stats;
    }

  } catch (error) {
    console.error('Error loading publications:', error);
  }
}

if (typeof module !== 'undefined') {
  module.exports = { loadPublications, renderPublicationCard };
}
