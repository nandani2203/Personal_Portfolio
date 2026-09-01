# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

This is Nandani Gupta's personal portfolio site — a static, **multi-page** HTML/CSS/vanilla-JS
site with no build step, no framework, and no package manager. Everything ships as-is from the
repo root; there's nothing to compile or bundle. It was a single long-scrolling page originally,
then split into separate pages, then partially recombined — see Pages below for the current split.

## Pages

- `index.html` (Home) — hero, About, a 3-stat teaser strip (website views, public repos, LeetCode
  solved), Skills, and a "Featured Projects" teaser (top 3, via `home-projects.js`) linking to the
  full Projects page. About and Skills live ONLY here (reached via `index.html#about` /
  `index.html#skills` anchors from other pages) — they are not separate `.html` files.
- `experience.html`, `leetcode.html`, `contact.html`, `publications.html` — one section each, each
  its own standalone page.
- `projects.html` — the full project list with a search box, category filter chips (All /
  Full-Stack / Backend / ML / Systems), and pagination at 9 projects per page, all client-side via
  `projects.js`.

There is no `about.html` or `skills.html` — don't recreate them; that content is intentionally
Home-only. There WAS a `publications.html` fold-in to Home at one point too, but it was moved back
out to its own page — check with the user before moving any section between "own page" and
"Home section" again, since this has flip-flopped once already.

## Shared boilerplate — duplicated per page, must stay in sync

There's no templating engine, so the navbar, mobile nav, and footer are duplicated verbatim across
all 6 HTML files. **Editing a nav link, adding a page, or changing the footer requires editing
every file** — there is no single source of truth to change once. When doing this kind of
cross-cutting edit, script it (read one file, apply the same string replacement to all 6) rather
than hand-editing each one, to avoid the copies drifting.

The active nav link is set statically per file (`class="active"` on the matching `<a>` in both
`#nav-links` and `.mobile-nav`). `main.js` also sets it at runtime: page-matching
(`setActiveNavByPage`) on every page except Home, and scroll-spying among `#about`/`#skills`
(`updateHomeScrollSpy`) specifically on Home, since About/Skills are anchors on that page rather
than separate pages.

## Every non-module `<script>` on a page shares ONE global scope

None of the JS files use `type="module"` — they're plain scripts, which means every `<script src>`
loaded on the same page executes in the *same* global scope, as if it were one concatenated file.
**A `const`/`let` name declared in one file collides with the same name in another file loaded on
the same page — this is a `SyntaxError` (parse-time, not runtime), which silently kills the entire
second script.** This actually happened: `main.js` declares `const currentPage` (the current
filename, for nav highlighting) and `projects.js` separately declared `let currentPage` (the
pagination page number) — since both load together on `projects.html`, the whole of `projects.js`
failed to parse and NOTHING on the Projects page rendered (no cards, no filters), with zero error
visible from static checks (`node --check` passes fine on each file in isolation — the collision
only exists when both are loaded in the same document). Fixed by renaming `projects.js`'s variable
to `pageNum`. **Before introducing a new top-level `const`/`let`/`function` name in any script,
check it doesn't collide with a name in another script loaded on the same page(s)** — see the
per-page script lists in "File structure" below for which files share a scope.

## Verifying changes — a browser is required, curl/grep are not enough

A file that's syntactically valid *and* looks correct in a static read can still be completely
broken at runtime in ways `node --check` and `curl`/`grep` will never catch (the collision above is
the proof: every static check passed while the page rendered nothing). There's no headless browser
tool available in this environment, so the effective substitute is **jsdom**, run through the real
local server so relative script/link URLs resolve:

```bash
npm install jsdom@24 --no-save   # jsdom 25+ has an ESM/CJS interop issue in this environment; pin 24
```

Load a page with `JSDOM.fromURL(url, { runScripts: 'dangerously', resources: 'usable', beforeParse })`,
stub what jsdom doesn't implement in `beforeParse` (`window.matchMedia`, `window.IntersectionObserver`,
`HTMLCanvasElement.prototype.getContext` — real browsers have all three; jsdom has none, and letting
them throw uncaught can mask *other*, real errors by aborting `main.js`/`particles.js` partway
through), attach a `window.onerror` collector, wait ~1.5s for scripts and timers, then inspect the
resulting DOM (element counts, text content, attribute values) the same way you'd eyeball the
rendered page. This is what caught the `currentPage` collision — check for uncaught errors AND
assert on the actual DOM state after every non-trivial JS/HTML change, not just "no error thrown".

One known gap: jsdom doesn't polyfill `fetch`/`AbortController`. Assigning Node's native
`globalThis.fetch` onto `window.fetch` in `beforeParse` lets `stats.js`/`leetcode-stats.js` run, but
cross-realm Promise interop between a vm-executed script and Node's own fetch is unreliable in this
setup (the call may just never resolve) — treat a live-fetch script's success/fail state in jsdom as
inconclusive, not authoritative. Verify that class of code by running the exact fetch+parsing logic
in a plain Node script against the real endpoint instead, and only use jsdom to confirm the DOM
*wiring* (right element IDs, no reference errors, fallback values present).

## Cache-busting — bump the version on every CSS/JS edit

Every `<link rel="stylesheet" href="styles.css?v=N">` and local `<script src="foo.js?v=N">` tag
carries a `?v=N` query string, **the same N across every file**. The static server here sends no
`Cache-Control` header, so without this, browsers have been observed serving a stale `styles.css`
across page navigations even after edits were confirmed correct on disk — a real bug hit multiple
times in this project's history that looked like "the CSS isn't applying" but was actually a stale
cache. **Whenever you edit `styles.css` or any local `.js` file, bump `?v=N` to `N+1` on every
reference to it, in every HTML file**, in the same change. Script this across all 6 files rather
than editing by hand (see the "shared boilerplate" note above for why).

## File structure

- `styles.css` — all styling. Theme colors are CSS custom properties defined per-theme under
  `[data-theme="dark"]` and `[data-theme="light"]` selectors on `:root` — never hardcode a color
  that should adapt to theme; add/use a variable instead.
- `main.js` — loaded on every page. Theme toggle (persisted to `localStorage` under
  `portfolio-theme`), mobile nav, active-nav-link state (see above),
  `IntersectionObserver`-driven scroll-reveal animations, the hero title typing effect (guarded —
  only runs if `#typed-title` exists on the page), 3D card tilt-on-hover, the contact form's
  fake-submit handler (no backend — it just simulates a send), and parallax on the hero text.
  Written to be safe to include on pages that don't have the element it targets.
- `projects-data.js` — the single source of truth for all project cards: a `PROJECTS` array
  (name, desc, techs, category, tag, `thumbnail` — an SVG filename, GitHub link, `featured` flag)
  plus a shared `renderProjectCard(project, delaySeconds)` function. Loaded by both `index.html`
  (via `home-projects.js`, top 3 where `featured: true`) and `projects.html` (via `projects.js`,
  full list, `PAGE_SIZE = 9`). **Add a new project here, once** — it appears in both places
  automatically; mark it `featured: true` only if it should also show on the Home teaser. Each
  project needs its own `thumb-*.svg` illustration (see below) — there's no generic fallback
  thumbnail.
- `thumb-*.svg` (one per project, e.g. `thumb-advani.svg`) — a small hand-drawn illustration used
  as the project card's thumbnail image (`renderProjectCard` renders `<img src="${p.thumbnail}">`),
  replacing an earlier emoji-on-gradient version. Each is self-contained: its own background
  gradient (matching the project's original accent color) plus simple line-art relevant to what the
  project does. Follow the same visual language for any new project — dark gradient background,
  white/accent-colored line art, `viewBox="0 0 340 200"` — rather than reusing an emoji.
- `home-projects.js` — renders the first 3 featured `PROJECTS` into `#featured-projects-grid` on
  Home, then manually fades them in (see the reveal-animation gotcha below — this file is a
  concrete example of it).
- `projects.js` — search input, category filter chips, and pagination for `projects.html`. Its page
  counter is named `pageNum`, not `currentPage` — see the global-scope collision note above for why.
- Both Home's and Projects' project grids use the `.uniform-grid` CSS class (fixed-size cards, 3
  per row, 2 on tablet, 1 on phone) — this overrides the `.featured` card's "full-width banner"
  treatment that `renderProjectCard()` would otherwise apply, so all cards render at a consistent
  size in both places.
- `skills-carousel.js` — drives the Skills section's per-category carousels (`.sk-carousel` in
  `index.html`): auto-advances slowly, loops infinitely (via a `[clone][original][clone]`
  triple-set technique — see the file's header comment), and exposes prev/next arrow buttons that
  reset the auto-advance timer. Measures actual rendered icon width at runtime rather than
  hardcoding it, so it stays correct if the CSS sizing ever changes. The viewport is `flex:1` (fills
  the card's actual width) rather than a fixed "N icons" size — however many icons fit at the
  card's rendered width is how many show at once, on any screen size.
- `leetcode-stats.js` — loaded only on `leetcode.html`. Fetches live solved-problem counts from
  `alfa-leetcode-api.onrender.com` (a community-run proxy — LeetCode's own GraphQL API has no CORS
  headers, so it can't be called directly from browser JS). Parses fields defensively (tries
  several possible key names) and leaves the hardcoded fallback numbers already in the HTML
  untouched on any failure — this is an unofficial third-party service with no uptime guarantee.
  Drives a donut chart (`#lc-donut-svg`, three stacked `<circle>` arcs sized via `stroke-dasharray`/
  `stroke-dashoffset` as fractions of the ring's circumference) rather than the flat bars an earlier
  version used — the bars were removed because they were plain and not very "portfolio-worthy"; if
  redesigning again, `updateDonut()`'s stacking math (each arc starts where the previous one ended)
  is the part to preserve conceptually even if the visual changes.
- `stats.js` — loaded only on `index.html` (the only page with `#stat-views`/`#stat-repos`).
  Fetches page views from GoatCounter (`nandanigupta.goatcounter.com`) and adds `VIEWS_BASE_OFFSET`
  (a fixed starting count from before GoatCounter tracking began) on top of the live count; fetches
  public repo count from the GitHub REST API (`api.github.com/users/nandani2203`). Both calls are
  best-effort (`Promise.allSettled`) and fall back to `—` on failure.
- `particles.js` — loaded on every page; assumes `#particle-canvas` exists (no guard), so every
  page must include that canvas element.
- `hero3d.js` — loaded only on `index.html` (needs `#hero-3d-canvas` + the three.js CDN script,
  both only present there).
- `avatar.js` — loaded only on `index.html` (needs `#avatar-photo`, which lives in the About
  section there).
- `Resume_Photo.jpeg` — the About section headshot.
- `injector-diagram.svg` — a hand-drawn schematic (not the published journal figure) illustrating
  the Publications page's paper, used because no PDF-to-image tool was available in this
  environment when it was made; replace with a real figure export if one becomes available.

## Conventions

- No comments in HTML/CSS/JS beyond the existing section-banner style already in use — match that
  style if adding a new section, don't introduce a different comment convention.
- Section markup pattern to follow for any new section: a `.container` wrapping a `.reveal` header
  block (`.section-tag`, `.section-title` with a `.highlight` span, `.section-subtitle`), then the
  section's content grid. Add `.reveal` / `.reveal-left` / `.reveal-right` classes to any new
  animated block so `main.js`'s existing `IntersectionObserver` picks it up automatically — no JS
  changes needed for standard reveal animation. **Gotcha:** elements inserted dynamically after
  page load (by `home-projects.js`, `projects.js`, `skills-carousel.js`) bypass that observer,
  since it only observes elements present when `main.js` runs — each of those scripts fades its
  own content in manually instead. Follow the same pattern for any new dynamic content.
- Project cards follow a fixed structure via `renderProjectCard()` in `projects-data.js`:
  `.project-thumbnail` (an SVG `<img>`, see `thumb-*.svg` above, + tag badge) → `.project-body`
  (`.project-name`, `.project-desc`, `.project-techs` chips, `.project-actions` with a GitHub link
  button). Don't hand-write a project card's HTML — add an entry to the `PROJECTS` array instead.
- Experience (`experience.html`) is a flat list of `.exp-card` entries (colored left accent bar +
  icon badge + role/company/date header + bullets + tech badges) — deliberately NOT a connected
  timeline/spine-and-nodes layout, which read as looking like a "tree" and was replaced for being
  less professional-looking. Includes one `.exp-card-education` entry alongside the work history.
  If asked to redesign this again, avoid reintroducing a connecting line/node visual without
  checking first — it's been tried and explicitly rejected once already.
- Skills are grouped into `.sk-card` categories (Languages, Backend & APIs, AI & ML, Infra &
  Tools) on the Home page, each rendered as a `.sk-carousel` (see `skills-carousel.js` above), not
  a static grid. Prefer an existing `devicon` class (`devicon-<tech>-plain colored`, see
  https://devicon.dev for available icons) for a technology's icon; only fall back to the manual
  `.sk-noicon` gradient-square-with-initials pattern when no devicon exists.

## Content sources

- GitHub: https://github.com/nandani2203 — source of truth for project links, descriptions, and
  tech stacks. Use `gh api users/nandani2203/repos` to check for new/updated repos before adding
  or editing a `PROJECTS` entry in `projects-data.js`.
- LinkedIn: https://www.linkedin.com/in/nandani-gupta~/ — source of truth for work experience,
  education, and headline. LinkedIn blocks automated fetches (rate-limits/auth-walls scrapers),
  so pull updates from what the user pastes directly (e.g. a resume) rather than trying to fetch
  the URL.
- LeetCode: username `Nandani22`. Difficulty breakdown/total on `leetcode.html` are live-fetched
  (see `leetcode-stats.js`); don't hand-edit those numbers — they're just the fallback shown before
  the fetch resolves (or if it fails).
- Email shown across the site: nandanigupta2212@gmail.com.

## Working in this repo

- There's no dev server or build; run a static file server from the repo root (e.g.
  `python -m http.server 8080`) and open `index.html` — opening the file directly via `file://`
  will break the root-relative script/link tags on some setups.
- No test suite and no linter configured — verify changes by visual inspection in both themes
  (toggle via the moon/sun button), across a few pages (nav/footer are duplicated, so a mistake in
  one may not show in another), and check that `.reveal`-class elements still animate in on scroll.
  **Always bump the cache-busting `?v=N` (see above) when touching CSS/JS, and tell whoever's
  testing to hard-refresh** — this project has repeatedly produced "my fix isn't showing up"
  reports that were actually stale-cache, not a code bug.
- Be careful editing the hero/About section (`index.html` only): it's dense, hand-rolled SVG-heavy
  markup. When touching the `.hero-socials` block, edit surgically — mixing up nesting there has
  caused broken markup before.
