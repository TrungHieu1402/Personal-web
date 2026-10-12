import '../css/main.css';
import { initI18n } from './i18n.js';
import { initStickyHeader, initScrollSpy } from './navigation.js';
import { initReveal } from './animations.js';

function initProjectDialog() {
  const dialog = document.getElementById('project-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  let opener = null;
  document.querySelectorAll('[data-open-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      opener = btn;
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
  // Bấm ra ngoài (vào backdrop) để đóng
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
}

function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

window.__appReady = true;
initI18n();
initStickyHeader();
initScrollSpy();
initReveal();
initProjectDialog();
initYear();
