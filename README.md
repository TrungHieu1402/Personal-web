# Portfolio — Lập trình & Thiết kế

Website tĩnh một trang, dựng từ Figma **TTH-web** (frame `Portfolio — Draft 01` 165:121 cho desktop và `Portfolio — Điện thoại` 165:5034 cho mobile).

**Stack:** HTML5 · Tailwind CSS 4.3.3 (plugin `@tailwindcss/vite`, cấu hình CSS-first) · Vanilla JS (ES modules) · Vite 8.3.4 · npm. Không dùng framework frontend, không Bootstrap, không jQuery.

## Yêu cầu

- Node.js ≥ 20.19 (đã kiểm tra trên Node 22)
- npm ≥ 10

## Lệnh

```bash
npm install       # cài dependency (đã khóa phiên bản trong package-lock.json)
npm run dev       # dev server: http://localhost:5173
npm run build     # build production ra thư mục dist/
npm run preview   # xem bản build: http://localhost:4173
```

Deploy vào thư mục con (ví dụ `https://domain.com/portfolio/`):

```bash
BASE_PATH=/portfolio/ npm run build
```

## Cấu trúc

```
index.html               # toàn bộ trang (semantic HTML, nội dung tiếng Việt gốc)
public/favicon.png       # copy nguyên vào dist/
src/css/main.css         # entry Tailwind + base + components
src/css/tokens.css       # design tokens (@theme): màu, radius, type scale, motion
src/css/fonts.css        # Inter Variable, chỉ subset latin / latin-ext / vietnamese
src/css/animations.css   # scroll reveal, hero entrance, prefers-reduced-motion
src/js/main.js           # khởi tạo, dialog dự án, năm hiện tại
src/js/navigation.js     # header dính + scroll-spy cho nav
src/js/animations.js     # IntersectionObserver reveal + stagger
src/js/i18n.js           # chuyển VN / EN (ghi nhớ trong localStorage)
src/assets/images/       # ảnh — HIỆN LÀ PLACEHOLDER, xem bên dưới
```

## Thay ảnh thật

Ảnh trong `src/assets/images/` đang là placeholder có chữ "PLACEHOLDER". Ghi đè bằng file export từ Figma, **giữ nguyên tên file**:

| File | Layer Figma | Kích thước gợi ý (2x) |
|---|---|---|
| `logo-turtle.png` | rua-tia-chop-khong-nen 1 | 180 × 120, nền trong suốt |
| `hero-portrait.jpg` | hero-image / Portrait | 1552 × 840 |
| `project-01.jpg` | featured-image | 1968 × 840 |
| `project-02.jpg` | project-row › Frame | 1904 × 392 |
| `vnnic-logo.png` | Rectangle (timeline) | 144 × 144 |

Nếu đổi định dạng (ví dụ sang `.webp`), sửa đường dẫn tương ứng trong `index.html`. Thay luôn `public/favicon.png` bằng logo thật.

## Deploy

`dist/` là site tĩnh thuần, không cần SPA fallback (chỉ có `index.html`, điều hướng bằng anchor).

**Static hosting** (Netlify, Vercel, Cloudflare Pages, GitHub Pages): build command `npm run build`, output `dist`.

**Nginx**

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/portfolio/dist;
  index index.html;

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  location / {
    try_files $uri $uri/ =404;
  }
}
```

**Apache** — copy `dist/` vào DocumentRoot. Có thể thêm cache cho `/assets/` (tên file đã có hash):

```apache
<Directory "/var/www/portfolio/dist/assets">
  Header set Cache-Control "public, max-age=31536000, immutable"
</Directory>
```

## Ghi chú thiết kế & quyết định

- **Font:** frame desktop dùng Inter; frame mobile dùng Roboto/DM Sans (từ một thư viện component khác). Để nhất quán, toàn site dùng Inter, áp dụng kích thước/line-height của từng frame.
- **Breakpoint:** < 768 theo frame mobile; 768–1023 bản xếp chồng mở rộng (suy luận, Figma không có tablet); ≥ 1024 bố cục 2 cột (intro 360px | nội dung) như desktop; hero chuyển sang 2 cột từ 1280px để cột ảnh không bị hẹp.
- **Icon:** tên layer trong Figma trùng icon Lucide (`code`, `layout`, `pen-tool`, `book-open`, `arrow-right`), nên dùng SVG từ `lucide-static` 1.55.0 (ISC). Icon mail/phone là Lucide `mail`/`phone`, gần giống vector trong Figma.
- **Nút "Xem dự án" của Dự án 01:** chưa có trang chi tiết, nên mở một hộp thoại xem ảnh + mô tả. Khi có trang chi tiết, đổi thành link.
- **Số điện thoại:** hiển thị đúng như Figma `+ 828127778`; link `tel:+84828127778` là giả định (mã VN). Cần xác nhận.
- **EN:** Figma không có nội dung tiếng Anh; bản dịch EN trong `src/js/i18n.js` do dev viết, nên duyệt lại.
- Thêm nhẹ: header dính có nền mờ khi cuộn, scroll-spy, reveal khi cuộn, hover card/nút, quầng sáng vàng rất nhạt sau ảnh hero. Tất cả tắt theo `prefers-reduced-motion`.
