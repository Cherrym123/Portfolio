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

// Init
setActive('#home');
