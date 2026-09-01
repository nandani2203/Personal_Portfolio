/*──────────────────────────────────────────────
  HOME PAGE — featured projects teaser (top 3)
  Depends on PROJECTS + renderProjectCard from projects-data.js
──────────────────────────────────────────────*/
(function renderFeaturedProjects() {
  const grid = document.getElementById('featured-projects-grid');
  if (!grid) return;
  const top3 = PROJECTS.filter(p => p.featured).slice(0, 3);
  grid.innerHTML = top3.map((p, i) => renderProjectCard(p, i * 0.08)).join('');

  // These cards are inserted after main.js's IntersectionObserver already ran
  // its initial querySelectorAll, so they'd otherwise stay at opacity:0 forever
  // (nothing ever adds .visible to them) — fade them in manually instead.
  requestAnimationFrame(() => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  });
})();
