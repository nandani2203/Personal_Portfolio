/*──────────────────────────────────────────────
  SKILLS CAROUSEL — one horizontal, infinite-loop,
  auto-advancing row per category. Shows N icons at
  a time (set by --sk-slot-w / .sk-carousel-viewport
  width in CSS); arrows step manually and reset the
  auto-advance timer.

  Loop technique: the original icons are tripled as
  [clone][original][clone]. We start viewing the
  middle (real) copy. Advancing past it lands on a
  clone region that is pixel-identical to the start
  of the real copy, so we can snap back with no
  visible jump — and symmetrically for going back.
──────────────────────────────────────────────*/
(function initSkillCarousels() {
  const AUTO_ADVANCE_MS = 2600;
  const RESET_DELAY_MS = 610; // matches the CSS transition duration

  document.querySelectorAll('.sk-carousel').forEach(carousel => {
    const track = carousel.querySelector('.sk-carousel-track');
    const prevBtn = carousel.querySelector('.sk-carousel-prev');
    const nextBtn = carousel.querySelector('.sk-carousel-next');
    if (!track || !prevBtn || !nextBtn) return;

    const original = Array.from(track.children);
    const n = original.length;
    if (n === 0) return;

    const cloneBefore = original.map(el => el.cloneNode(true));
    const cloneAfter = original.map(el => el.cloneNode(true));
    track.innerHTML = '';
    [...cloneBefore, ...original, ...cloneAfter].forEach(el => track.appendChild(el));

    let index = n; // start at the real (middle) copy
    let stepWidth = 0;

    function measure() {
      const item = track.children[0];
      const style = getComputedStyle(item);
      stepWidth = item.getBoundingClientRect().width + parseFloat(style.marginRight || '0');
      goTo(index, false);
    }

    function goTo(newIndex, animate) {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(-${newIndex * stepWidth}px)`;
      if (!animate) {
        track.getBoundingClientRect(); // force reflow so a later transition re-applies
        track.style.transition = '';
      }
      index = newIndex;
    }

    function next() {
      goTo(index + 1, true);
      if (index >= 2 * n) {
        setTimeout(() => goTo(index - n, false), RESET_DELAY_MS);
      }
    }

    function prev() {
      if (index <= 0) {
        goTo(index + n, false);
        requestAnimationFrame(() => goTo(index - 1, true));
        return;
      }
      goTo(index - 1, true);
    }

    measure();
    window.addEventListener('resize', measure);

    let timer = setInterval(next, AUTO_ADVANCE_MS);
    function restart() { clearInterval(timer); timer = setInterval(next, AUTO_ADVANCE_MS); }

    nextBtn.addEventListener('click', () => { next(); restart(); });
    prevBtn.addEventListener('click', () => { prev(); restart(); });
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', restart);
  });
})();
