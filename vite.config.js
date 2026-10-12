import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Site là một trang duy nhất (đúng theo Figma). Khi thêm trang mới,
// khai báo thêm entry trong build.rollupOptions.input, ví dụ:
//   about: resolve(import.meta.dirname, 'pages/about.html')
export default defineConfig({
  // Đặt BASE_PATH=/thu-muc-con/ khi deploy vào thư mục con.
  base: process.env.BASE_PATH || '/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
});
