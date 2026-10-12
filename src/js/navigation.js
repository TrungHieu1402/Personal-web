// Header dính + đánh dấu mục đang xem trên thanh điều hướng.

export function initStickyHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

export function initScrollSpy() {
  const links = [...document.querySelectorAll('[data-nav]')];
  const sections = links
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((link) => {
      if (link.dataset.nav === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // Vùng quan sát là một dải mỏng ở khoảng 35% chiều cao màn hình
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  sections.forEach((s) => observer.observe(s));

  // Ở đầu trang (hero) thì không đánh dấu mục nào
  const hero = document.getElementById('gioi-thieu');
  if (hero) {
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(null);
      },
      { rootMargin: '-35% 0px -60% 0px' },
    ).observe(hero);
  }
}
