/*──────────────────────────────────────────────
  PROJECTS PAGE — search, category filter, pagination
  Depends on PROJECTS + renderProjectCard from projects-data.js
──────────────────────────────────────────────*/
const PAGE_SIZE = 9;

let activeCategory = 'All';
let searchQuery = '';
let pageNum = 1;

const searchInput   = document.getElementById('projects-search');
const filtersEl      = document.getElementById('projects-filters');
const gridEl          = document.getElementById('projects-grid');
const metaEl          = document.getElementById('projects-meta');
const emptyEl         = document.getElementById('projects-empty');
const emptyQueryEl   = document.getElementById('projects-empty-query');
const clearBtn        = document.getElementById('projects-clear-btn');
const paginationEl   = document.getElementById('pagination');

function buildFilters() {
  const categories = ['All', ...new Set(PROJECTS.map(p => p.category))];
  filtersEl.innerHTML = categories.map(cat =>
    `<button type="button" class="filter-chip${cat === activeCategory ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');
  filtersEl.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      pageNum = 1;
      filtersEl.querySelectorAll('.filter-chip').forEach(b => b.classList.toggle('active', b === btn));
      render();
    });
  });
}

function getFilteredProjects() {
  const q = searchQuery.trim().toLowerCase();
  return PROJECTS.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    if (!matchesCategory) return false;
    if (!q) return true;
    const haystack = [p.name, p.desc, p.category, ...p.techs].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

function render() {
  const filtered = getFilteredProjects();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  pageNum = Math.min(pageNum, totalPages);
  const start = (pageNum - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  if (filtered.length === 0) {
    gridEl.innerHTML = '';
    emptyEl.hidden = false;
    emptyQueryEl.textContent = searchQuery || (activeCategory !== 'All' ? activeCategory : 'your filters');
    metaEl.textContent = '';
    paginationEl.innerHTML = '';
    return;
  }

  emptyEl.hidden = true;
  metaEl.textContent = `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length} project${filtered.length === 1 ? '' : 's'}`;
  gridEl.innerHTML = pageItems.map(p => renderProjectCard(p)).join('');

  // Fade the newly-rendered cards in (they bypass the scroll IntersectionObserver
  // since they're inserted after page load).
  requestAnimationFrame(() => {
    gridEl.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
  let html = `<button type="button" class="page-btn page-nav" id="page-prev" ${pageNum === 1 ? 'disabled' : ''} aria-label="Previous page">&larr;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" class="page-btn${i === pageNum ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button type="button" class="page-btn page-nav" id="page-next" ${pageNum === totalPages ? 'disabled' : ''} aria-label="Next page">&rarr;</button>`;
  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      pageNum = parseInt(btn.getAttribute('data-page'), 10);
      render();
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const prevBtn = document.getElementById('page-prev');
  const nextBtn = document.getElementById('page-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { pageNum--; render(); gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  if (nextBtn) nextBtn.addEventListener('click', () => { pageNum++; render(); gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = searchInput.value;
    pageNum = 1;
    render();
  }, 150);
});

clearBtn.addEventListener('click', () => {
  searchQuery = '';
  activeCategory = 'All';
  pageNum = 1;
  searchInput.value = '';
  buildFilters();
  render();
});

buildFilters();
render();
