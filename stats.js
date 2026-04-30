/*──────────────────────────────────────────────
  LIVE STATS — GoatCounter + GitHub
──────────────────────────────────────────────*/

const GC_CODE    = 'nandanigupta';
const GITHUB_USER = 'nandani2203';

(async function loadStats() {
  await Promise.allSettled([
    fetchPageViews(),
    fetchRepoCount(),
  ]);
})();

async function fetchPageViews() {
  // Try /counter/TOTAL.json first (all-paths total), fall back to homepage path
  const endpoints = [
    `https://${GC_CODE}.goatcounter.com/counter/TOTAL.json`,
    `https://${GC_CODE}.goatcounter.com/counter//.json`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data  = await res.json();
      const count = parseInt(String(data.count).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(count)) { animateCount('stat-views', count); return; }
    } catch (_) { /* try next */ }
  }
  setText('stat-views', '—');
}


async function fetchRepoCount() {
  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error('GitHub API error');
    const user = await res.json();
    animateCount('stat-repos', user.public_repos ?? 0);
  } catch (e) {
    setText('stat-repos', '—');
  }
}

/* Count-up with easeOutExpo */
function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el || isNaN(target)) return;
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const t     = Math.min((now - start) / duration, 1);
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
