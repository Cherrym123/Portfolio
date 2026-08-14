// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll + active nav highlight
const navLinks = document.querySelectorAll('.menu__link, .menu-mobile .menu__link');

function setActive(hash) {
  document.querySelectorAll('.menu__link').forEach(a => a.classList.remove('is-active'));
  const target = document.querySelector(`.menu__link[href="${hash}"]`);
  if (target) target.classList.add('is-active');
}

navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(href);

    // close mobile menu
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      mobileMenu.style.display = 'none';
      burger.setAttribute('aria-expanded', 'false');
    }
  });
});

const sections = [...document.querySelectorAll('main, section')].filter(s => s.id);
window.addEventListener('scroll', () => {
  const y = window.scrollY + 160;
  let current = '#home';
  sections.forEach(sec => {
    if (sec.offsetTop <= y) current = `#${sec.id}`;
  });
  setActive(current);
});

// Mobile nav
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('menuMobile');

burger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.style.display = isOpen ? 'block' : 'none';
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "-8% 0px -8% 0px" });

revealEls.forEach(el => io.observe(el));

// Scroll progress bar (NEW)
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  if (progressBar) progressBar.style.width = `${scrolled}%`;
});

// Contact form AJAX (Formspree) (NEW)
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const sendBtn = document.getElementById('sendBtn');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (formStatus) {
    formStatus.style.display = 'block';
    formStatus.textContent = 'Sending...';
  }
  if (sendBtn) sendBtn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.reset();
      if (formStatus) formStatus.textContent = '✅ Message sent! I will get back to you soon.';
    } else {
      if (formStatus) formStatus.textContent = '❌ Something went wrong. Please try again.';
    }
  } catch (err) {
    if (formStatus) formStatus.textContent = '❌ Network error. Please try again.';
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
});

// Theme toggle (persisted) — default to light unless user chose otherwise
const themeToggle = document.getElementById('themeToggle');
let theme = localStorage.getItem('theme') || 'light';

function applyTheme(t){
  if (t === 'dark') document.body.classList.add('dark'); else document.body.classList.remove('dark');
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(t === 'dark'));
    themeToggle.innerHTML = t === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
}

applyTheme(theme);

themeToggle?.addEventListener('click', () => {
  theme = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  applyTheme(theme);
});

// Modal / project preview
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

function closeModal(){
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modalContent.innerHTML = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.p-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // Ignore clicks on links inside the card
    if (e.target.closest('a')) return;
    const clone = card.cloneNode(true);
    clone.classList.remove('reveal', 'is-visible');
    modalContent.innerHTML = '';
    modalContent.appendChild(clone);
    if (modal) modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (!toTop) return;
  if (window.scrollY > 400) toTop.classList.add('show'); else toTop.classList.remove('show');
});
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Init

setActive('#home');

// Compute professional experience from earliest timeline start date and update UI
(function computeExperience() {
  const expNumEl = document.querySelector('.exp__num');
  if (!expNumEl) return;

  const pillEls = Array.from(document.querySelectorAll('.timeline__card .pill'));
  const dates = pillEls.map(el => el.textContent.trim()).filter(Boolean);
  const starts = [];

  dates.forEach(text => {
    const parts = text.split(/\s*[-–—]\s*/);
    const startStr = parts[0];
    const parsed = Date.parse('1 ' + startStr);
    if (!isNaN(parsed)) {
      starts.push(new Date(parsed));
    } else {
      const yearMatch = startStr.match(/(\d{4})/);
      if (yearMatch) starts.push(new Date(parseInt(yearMatch[1], 10), 0, 1));
    }
  });

  if (starts.length === 0) return;

  const earliest = new Date(Math.min(...starts.map(d => d.getTime())));
  const now = new Date();
  const years = Math.floor((now - earliest) / (365.25 * 24 * 60 * 60 * 1000));

  expNumEl.textContent = years <= 0 ? 'Less than 1' : `${years}+`;
})();
