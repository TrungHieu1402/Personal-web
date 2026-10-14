// Song ngữ VN / EN. Nội dung tiếng Việt là bản gốc trong HTML (tốt cho SEO);
// bản tiếng Anh được thay vào khi người dùng bấm "EN" và được ghi nhớ trong trình duyệt.

const EN = {
  // Chung / trợ năng
  skip: 'Skip to content',
  homeLabel: 'Back to top',
  logoAlt: 'Black turtle logo',
  navLabel: 'Main navigation',
  langLabel: 'Language',
  footerNavLabel: 'Footer links',
  close: 'Close',
  toTop: 'Scroll to top',

  // Điều hướng
  'nav.skills': 'Skills',
  'nav.projects': 'Projects',
  'nav.experience': 'Experience',
  'nav.contact': 'Contact',

  // Hero
  'hero.meta': 'Code • Design • Share',
  'hero.title1': "Hi, I'm Hiếu!",
  'hero.title2': 'Software engineer & AI',
  'hero.desc': 'I like turning lines of code into something useful — and letting AI help me get there a little faster. :)',
  'hero.ctaProjects': 'View projects',
  'hero.ctaContact': 'Contact',
  'hero.tagsLabel': 'Focus areas',
  'hero.portraitAlt': 'Portrait of the portfolio author',
  'hero.aboutTag': 'About me',
  'hero.caption': 'Code & design',
  'hero.m1k': 'Expertise',
  'hero.m1v': 'Programming & knowledge sharing',
  'hero.m2k': 'Design',
  'hero.m3k': 'Sharing',
  'hero.m3v': 'Tutorials & web development',

  // Kỹ năng
  'skills.title': 'Code with logic, design with inspiration.',
  'skills.desc': "The skill tree I've unlocked after plenty of grinding",
  'skills.s1': 'Building user interfaces, polishing the experience and handing over clean code.',
  'skills.s2': 'From idea to prototype, focused on user flow and a lean feel.',
  'skills.s3': 'Visuals, icons and visual systems supporting projects and shared content.',
  'skills.s4': 'Designing, building and optimizing CMS platforms.',
  'skills.s5': 'Applying AI to web development',

  // Dự án
  'projects.title': 'Code written, projects built.',
  'projects.desc': "I'm still updating this section...",
  'projects.featured': 'Featured project',
  'projects.p1': 'Project 01',
  'projects.p2': 'Project 02',
  'projects.p1Alt': 'Illustration for Project 01',
  'projects.p2Alt': 'Illustration for Project 02',
  'projects.tbd': 'Project details are being updated: name, role and scope of work.',

  // Kinh nghiệm
  'exp.title': 'From lines of code to ideas that take shape.',
  'exp.desc':
    "A journey through front-end, graphic design and CMS. Some days I'm battling CSS, some days I'm puzzling over layouts, and some days I'm building entire systems so everything runs smoothly.",
  'exp.vnnicAlt': 'VNNIC logo',
  'exp.present': 'Present',
  'exp.r1': 'Front-end Developer, Graphic Designer & CMS Developer at VNNIC',
  'exp.d1': 'Developed web interfaces, created graphic designs and built a content management system (CMS) platform at VNNIC.',
  'exp.r2': 'Freelance Front-end Developer, Graphic Designer & CMS Developer',
  'exp.d2': 'Developing user interfaces, creating graphic designs and building CMS platforms for client projects.',

  // Liên hệ
  'contact.title': "You bring the idea, I'll bring the code.",
  'contact.desc': 'Always ready to listen — and to actually understand',
  'contact.summary':
    'Software engineer with 3+ years of experience building and developing web solutions, focused on user interfaces, content management systems (CMS) and applying new technologies.',
  'contact.cta': "Let's work together",

  // Footer
  'footer.brand': 'Code & design',
  'footer.tagline': 'Building projects. Sharing knowledge.',
};

const META = {
  vi: {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? '',
  },
  en: {
    title: 'HieuTT — Code & Design',
    description:
      'Portfolio covering CMS platform development, front-end development, UI/UX and graphic design. Browse projects, skills, experience and contact details.',
  },
};

const STORAGE_KEY = 'portfolio-lang';
const original = new Map(); // phần tử -> { text, attrs }

function snapshot() {
  document.querySelectorAll('[data-i18n], [data-i18n-attr]').forEach((el) => {
    const attrs = {};
    (el.dataset.i18nAttr || '').split(',').filter(Boolean).forEach((pair) => {
      const [attr] = pair.split(':');
      attrs[attr] = el.getAttribute(attr);
    });
    original.set(el, { text: el.dataset.i18n ? el.textContent : null, attrs });
  });
}

function apply(lang) {
  original.forEach((orig, el) => {
    if (el.dataset.i18n) {
      el.textContent = lang === 'en' ? (EN[el.dataset.i18n] ?? orig.text) : orig.text;
    }
    (el.dataset.i18nAttr || '').split(',').filter(Boolean).forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, lang === 'en' ? (EN[key] ?? orig.attrs[attr]) : orig.attrs[attr]);
    });
  });

  document.documentElement.lang = lang;
  document.title = META[lang].title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', META[lang].description);
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function initI18n() {
  snapshot();
  const stored = readStored();
  if (stored === 'en') apply('en');

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang === 'en' ? 'en' : 'vi';
      apply(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* chế độ riêng tư: bỏ qua */
      }
    });
  });
}
