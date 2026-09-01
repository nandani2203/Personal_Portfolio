/*──────────────────────────────────────────────
  LEETCODE LIVE STATS
  LeetCode's own GraphQL API has no CORS headers, so a
  browser can't call it directly from this origin — we go
  through alfa-leetcode-api (community-run, CORS-enabled)
  instead. It's a third-party service with no uptime
  guarantee, so every field is read defensively and the
  hardcoded fallback values already in the HTML are left
  untouched on any failure.
──────────────────────────────────────────────*/
const LC_USERNAME = 'Nandani22';
const LC_API_BASE = 'https://alfa-leetcode-api.onrender.com';
const LC_DONUT_RADIUS = 50;
const LC_DONUT_CIRCUMFERENCE = 2 * Math.PI * LC_DONUT_RADIUS;
const LC_CACHE_KEY = 'lc-stats-cache';

(async function loadLeetCodeStats() {
  // Show a cached last-known-good result immediately (if we have one) so the
  // page doesn't sit on stale hardcoded numbers while waiting on the network
  // — alfa-leetcode-api is a free Render instance that can take 30s+ to wake
  // up from a cold start, well past what a user will wait around for.
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(LC_CACHE_KEY)); } catch (_) { /* none yet */ }
  if (cached) applyStats(cached, false);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${LC_API_BASE}/${LC_USERNAME}/solved`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('LeetCode stats API error: ' + res.status);
    const data = await res.json();

    const total = firstNumber(data, ['solvedProblem', 'totalSolved', 'total']);
    const easy = firstNumber(data, ['easySolved', 'easy']);
    const medium = firstNumber(data, ['mediumSolved', 'medium']);
    const hard = firstNumber(data, ['hardSolved', 'hard']);

    if ([total, easy, medium, hard].some(v => v === null) || total <= 0) {
      throw new Error('Unexpected response shape from LeetCode stats API');
    }

    const stats = { total, easy, medium, hard };
    applyStats(stats, true);
    try { localStorage.setItem(LC_CACHE_KEY, JSON.stringify(stats)); } catch (_) { /* storage unavailable */ }
  } catch (e) {
    // Best-effort only — the cached or hardcoded values already shown stand in.
  }
})();

function applyStats({ total, easy, medium, hard }, isLive) {
  // The headline "Problems Solved" stat shows a rounded milestone (500+, not
  // 534+) — a round number reads as a stable achievement rather than a count
  // that'll look "out of date" after the next few problems solved. The donut
  // and legend below it still show the exact live numbers.
  const milestone = Math.floor(total / 50) * 50;
  setText('lc-total', milestone.toLocaleString() + '+');
  setText('lc-donut-total', total.toLocaleString());
  setText('lc-easy-count', easy.toLocaleString());
  setText('lc-medium-count', medium.toLocaleString());
  setText('lc-hard-count', hard.toLocaleString());
  updateDonut({ easy, medium, hard });
  const badge = document.getElementById('lc-live-badge');
  if (badge) badge.hidden = !isLive;
}

function firstNumber(obj, keys) {
  for (const key of keys) {
    const val = obj && obj[key];
    if (typeof val === 'number' && !Number.isNaN(val)) return val;
  }
  return null;
}

// Draws the Easy/Medium/Hard arcs as fractions of the ring's circumference,
// stacked back-to-back (each starts where the previous one ended).
function updateDonut({ easy, medium, hard }) {
  const total = easy + medium + hard;
  if (total <= 0) return;
  const lengths = {
    easy: (easy / total) * LC_DONUT_CIRCUMFERENCE,
    medium: (medium / total) * LC_DONUT_CIRCUMFERENCE,
    hard: (hard / total) * LC_DONUT_CIRCUMFERENCE,
  };
  let cumulative = 0;
  for (const key of ['easy', 'medium', 'hard']) {
    const el = document.getElementById(`lc-donut-${key}`);
    if (el) {
      el.setAttribute('stroke-dasharray', `${lengths[key].toFixed(2)} ${(LC_DONUT_CIRCUMFERENCE - lengths[key]).toFixed(2)}`);
      el.setAttribute('stroke-dashoffset', (-cumulative).toFixed(2));
    }
    cumulative += lengths[key];
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
