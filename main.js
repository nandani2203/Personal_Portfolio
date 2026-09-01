/*──────────────────────────────────────────────
  THEME TOGGLE
──────────────────────────────────────────────*/
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('portfolio-theme') || (prefersDark ? 'dark' : 'light');
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  themeToggle.style.transform = 'rotate(360deg) scale(1.1)';
  setTimeout(() => themeToggle.style.transform = '', 400);
  // Reinit particles for theme
  initParticles();
});

/*──────────────────────────────────────────────
  MOBILE NAV
──────────────────────────────────────────────*/
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

/*──────────────────────────────────────────────
  NAVBAR SCROLL + ACTIVE LINKS
──────────────────────────────────────────────*/
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('#nav-links a, .mobile-nav a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// This is a multi-page static site (no router). Most nav links point to a
// whole page, so the active link is just whichever href matches the current
// filename. But About/Skills/Publications are anchors on the Home page
// itself (index.html#about etc.), so on Home specifically we scroll-spy
// among those sections instead — page-matching alone would leave "Home"
// permanently active no matter which of those sections is in view.
const currentPage = location.pathname.split('/').pop() || 'index.html';
const isHome = currentPage === 'index.html';
const homeAnchorSections = isHome
  ? ['about', 'skills'].map(id => document.getElementById(id)).filter(Boolean)
  : [];

function setActiveNavByPage() {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });
}

function updateHomeScrollSpy() {
  let current = 'index.html';
  homeAnchorSections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) current = `index.html#${section.id}`;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

if (isHome) {
  updateHomeScrollSpy();
  window.addEventListener('scroll', updateHomeScrollSpy, { passive: true });
} else {
  setActiveNavByPage();
}

/*──────────────────────────────────────────────
  SCROLL REVEAL
──────────────────────────────────────────────*/
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/*──────────────────────────────────────────────
  TYPING EFFECT
──────────────────────────────────────────────*/
const titles = ['Software Developer', 'AI Engineer', 'Problem Solver', 'Open Source Builder', 'Creative Developer'];
let titleIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-title');

function typeTitle() {
  const current = titles[titleIdx];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { isDeleting = true; setTimeout(typeTitle, 2200); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { isDeleting = false; titleIdx = (titleIdx + 1) % titles.length; }
  }
  setTimeout(typeTitle, isDeleting ? 55 : 90);
}
if (typedEl) setTimeout(typeTitle, 1500);

/*──────────────────────────────────────────────
  3D CARD TILT
──────────────────────────────────────────────*/
document.querySelectorAll('.skill-category-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * 6;
    const tiltY = -((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/*──────────────────────────────────────────────
  CONTACT FORM
──────────────────────────────────────────────*/
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('send-btn');
  const success = document.getElementById('form-success');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '✅ Sent!';
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
      btn.disabled = false;
      success.style.display = 'none';
    }, 4000);
  }, 1000);
}

/*──────────────────────────────────────────────
  PARALLAX HERO
──────────────────────────────────────────────*/
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroText = document.querySelector('.hero-text');
  if (heroText && scrollY < window.innerHeight) {
    heroText.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroText.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
  }
}, { passive: true });

/*──────────────────────────────────────────────
  SMOOTH ANCHOR SCROLLING (for older browsers)
──────────────────────────────────────────────*/
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
