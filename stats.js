/*──────────────────────────────────────────────
  LIVE STATS — GoatCounter + GitHub
──────────────────────────────────────────────*/

const GC_CODE    = 'nandanigupta';
const GITHUB_USER = 'nandani2203';
const VIEWS_BASE_OFFSET = 300; // starting count from before GoatCounter tracking began

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
      if (!isNaN(count)) { animateCount('stat-views', VIEWS_BASE_OFFSET + count); return; }
    } catch (_) { /* try next */ }
  }
  setText('stat-views', '—');
}


const REPO_COUNT_CACHE_KEY = 'gh-repo-count-cache';

async function fetchRepoCount() {
  // GitHub's unauthenticated API is capped at 60 requests/hour per IP, shared
  // with everyone else on the same network/NAT — easy to exhaust and stays
  // exhausted for up to an hour, so this fails far more often than a typical
  // "occasional glitch". The HTML already ships a real, reasonably-current
  // count as its starting text (not "—"), so on failure we simply leave that
  // alone instead of ever displaying a blank dash.
  try {
    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error('GitHub API error: ' + res.status);
    const user = await res.json();
    const count = user.public_repos ?? 0;
    animateCount('stat-repos', count);
    try { localStorage.setItem(REPO_COUNT_CACHE_KEY, String(count)); } catch (_) { /* storage unavailable */ }
  } catch (e) {
    let cached = null;
    try { cached = localStorage.getItem(REPO_COUNT_CACHE_KEY); } catch (_) { /* storage unavailable */ }
    if (cached !== null) animateCount('stat-repos', parseInt(cached, 10));
    // else: leave the HTML's static fallback number in place — no dash.
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
