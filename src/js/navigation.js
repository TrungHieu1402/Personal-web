// Header: dính + bóng khi cuộn, đo chiều cao thực, menu mobile, scroll-spy.

const NAV_MQ = '(min-width: 45rem)'; // khớp --breakpoint-nav trong tokens.css

const MENU_LABELS = {
  vi: { open: 'Mở menu', close: 'Đóng menu' },
  en: { open: 'Open menu', close: 'Close menu' },
};

export function initStickyHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  // Bóng header khi đã cuộn — gom về 1 lần/frame
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

  // --header-h = chiều cao thật (dùng cho scroll-padding và vị trí lớp tối của menu)
  const root = document.documentElement;
  const setHeight = () => root.style.setProperty('--header-h', `${Math.round(header.offsetHeight)}px`);
  setHeight();
  if ('ResizeObserver' in window) new ResizeObserver(setHeight).observe(header);
}

export function initMobileMenu() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-site-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const scrim = document.querySelector('[data-nav-scrim]');
  if (!header || !nav || !toggle) return;

  const mq = window.matchMedia(NAV_MQ);
  const isOpen = () => header.hasAttribute('data-menu-open');
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'vi');

  const syncLabel = () => {
    toggle.setAttribute('aria-label', MENU_LABELS[lang()][isOpen() ? 'close' : 'open']);
  };

  // Menu đóng trên mobile thì link không được nhận focus
  const syncInert = () => {
    nav.inert = !mq.matches && !isOpen();
  };

  const onKeydown = (e) => {
    if (e.key === 'Escape') close({ restoreFocus: true });
  };

  function open() {
    if (isOpen()) return;
    header.setAttribute('data-menu-open', '');
    toggle.setAttribute('aria-expanded', 'true');
    syncInert();
    syncLabel();
    document.addEventListener('keydown', onKeydown);
    // Đợi 2 frame: frame 1 trình duyệt mới áp style "mở" (visibility chuyển sang visible),
    // phần tử còn hidden thì không nhận focus — quan trọng khi bật reduced-motion.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (isOpen()) nav.querySelector('a')?.focus({ preventScroll: true });
      }),
    );
  }

  function close({ restoreFocus = false } = {}) {
    if (!isOpen()) return;
    header.removeAttribute('data-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    syncInert();
    syncLabel();
    document.removeEventListener('keydown', onKeydown);
    if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => (isOpen() ? close({ restoreFocus: true }) : open()));
  scrim?.addEventListener('click', () => close());

  // Chọn link: để trình duyệt cuộn tới section, đồng thời đóng menu
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a') && isOpen()) close();
  });

  // Focus rời khỏi header (Tab ra ngoài) thì đóng
  header.addEventListener('focusout', (e) => {
    if (isOpen() && e.relatedTarget && !header.contains(e.relatedTarget)) close();
  });

  // Đổi kích thước qua breakpoint: luôn về trạng thái đóng, sạch
  mq.addEventListener('change', () => {
    close();
    syncInert();
  });

  document.addEventListener('langchange', syncLabel);

  syncInert();
  syncLabel();
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

  // Một observer cho tất cả section; dải quan sát mỏng ở ~35% chiều cao màn hình
  const hero = document.getElementById('gioi-thieu');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActive(entry.target === hero ? null : entry.target.id);
      });
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  sections.forEach((s) => observer.observe(s));
  if (hero) observer.observe(hero);

  // Section cuối (Liên hệ) thấp hơn màn hình nên không bao giờ chạm dải quan sát:
  // khi đã cuộn tới đáy trang thì đánh dấu mục cuối.
  const last = sections.at(-1);
  let ticking = false;
  const checkBottom = () => {
    ticking = false;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) setActive(last.id);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkBottom);
      }
    },
    { passive: true },
  );
}
