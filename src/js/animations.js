// Scroll reveal bằng IntersectionObserver.
// Mỗi phần tử chỉ hiện một lần (unobserve ngay), các phần tử cùng cha lệch nhau 1 --stagger
// (tối đa 4 bậc để khối cuối không phải chờ lâu). Hiệu ứng nằm trong animations.css.

const MAX_STAGGER_STEPS = 4;

export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const groups = new Map();
  items.forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    list.push(el);
    groups.set(el.parentElement, list);
  });
  groups.forEach((list) =>
    list.forEach((el, i) => el.style.setProperty('--reveal-i', String(Math.min(i, MAX_STAGGER_STEPS)))),
  );

  let remaining = items.length;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
        remaining -= 1;
      });
      if (remaining === 0) observer.disconnect();
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );
  items.forEach((el) => observer.observe(el));
}
