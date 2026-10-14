// Nút "lên đầu trang".
// - Chỉ hiện khi đã cuộn quá 3/4 chiều cao màn hình (trang ngắn thì không bao giờ hiện).
// - Vòng viền vàng thể hiện tiến độ đọc (0 → 100%).
// - Khi footer lọt vào màn hình, nút được nâng lên để không che link / bản quyền.
// Mọi phép đo gom vào 1 lần/frame bằng requestAnimationFrame.

const SHOW_AFTER = 0.75; // × chiều cao viewport

export function initBackToTop() {
  const btn = document.querySelector('[data-to-top]');
  if (!btn) return;
  const footer = document.querySelector('body > footer');
  const ring = btn.querySelector('.to-top__ring circle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const max = root.scrollHeight - vh;
    const y = window.scrollY;

    btn.toggleAttribute('data-visible', y > vh * SHOW_AFTER);

    if (ring) {
      const progress = max > 0 ? Math.min(1, y / max) : 0;
      ring.style.strokeDashoffset = String(100 - progress * 100);
    }

    btn.style.setProperty('--lift', `${Math.round(computeLift())}px`);
  };

  // Chọn "mép neo" trong footer cho cột của nút:
  //  - Tìm phần tử nội dung (ảnh, chữ, link) đầu tiên của footer nằm ngay dưới nút (giao nhau theo chiều ngang).
  //  - Nếu giữa viền trên footer và phần tử đó đủ chỗ cho nút → neo trên phần tử đó
  //    (mobile: nút nằm gọn trong khoảng trống bên phải footer, không đè nút "Liên hệ hợp tác").
  //  - Không đủ chỗ → neo trên viền footer (desktop: bản quyền nằm ngay dưới nút).
  // Lượng nâng thay đổi liên tục theo vị trí cuộn nên nút không bị giật.
  const GAP = 12;
  const items = footer ? [...footer.querySelectorAll('img, p, a')] : [];
  function computeLift() {
    if (!footer) return 0;
    const current = parseFloat(btn.style.getPropertyValue('--lift')) || 0;
    const r = btn.getBoundingClientRect();
    const bottom0 = r.bottom + current; // đáy nút khi chưa nâng
    const fTop = footer.getBoundingClientRect().top;
    if (fTop > bottom0 + GAP) return 0; // footer chưa tới

    let firstTop = Infinity;
    for (const el of items) {
      const o = el.getBoundingClientRect();
      if (o.width && o.left < r.right && o.right > r.left) firstTop = Math.min(firstTop, o.top);
    }
    if (firstTop === Infinity) return 0; // cột của nút trong footer trống hoàn toàn

    const roomInFooter = firstTop - fTop >= r.height + GAP * 2;
    const anchorTop = roomInFooter ? firstTop : fTop;
    return Math.max(0, bottom0 + GAP - anchorTop);
  }

  const schedule = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    // Bỏ #section trên URL để tải lại trang không nhảy xuống lại
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    // Chuyển focus về đầu trang cho người dùng bàn phím / trình đọc màn hình
    document.querySelector('[data-header] a')?.focus({ preventScroll: true });
  });
}
