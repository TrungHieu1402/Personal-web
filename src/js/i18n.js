// Song ngữ VN / EN. Nội dung tiếng Việt là bản gốc trong HTML (tốt cho SEO);
// bản tiếng Anh được thay vào khi người dùng bấm "EN" và được ghi nhớ trong trình duyệt.

const EN = {
  skip: 'Skip to content',
  homeLabel: 'Back to top',
  logoAlt: 'Black turtle logo',
  navLabel: 'Main navigation',
  langLabel: 'Language',
  footerNavLabel: 'Footer links',
  close: 'Close',
  'nav.projects': 'Projects',
  'nav.skills': 'Skills',
  'nav.experience': 'Experience',
  'nav.contact': 'Contact',
  'hero.meta': 'Code • Design • Share',
  'hero.title1': 'Building digital experiences.',
  'hero.title2': 'Sharing what I learn.',
  'hero.desc':
    'I love programming and sharing what I know about web development. Explore my projects, tutorials and the lessons I picked up along the way.',
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
  'skills.title': 'Bridging code and design.',
  'skills.desc': 'From building interfaces to visual design and sharing web knowledge.',
  'skills.s1': 'Building user interfaces, polishing the experience and handing over clean code.',
  'skills.s2': 'From idea to prototype, focused on user flow and a lean feel.',
  'skills.s3': 'Visuals, icons and visual systems supporting projects and shared content.',
  'skills.s4': 'Articles, tutorials and project stories told briefly and clearly.',
  'projects.title': 'A corner of my work.',
  'projects.desc': 'Available project images. Names, roles and detailed descriptions are coming soon.',
  'projects.featured': 'Featured project',
  'projects.p1': 'Project 01',
  'projects.p2': 'Project 02',
  'projects.p1Alt': 'Illustration for Project 01',
  'projects.p2Alt': 'Illustration for Project 02',
  'projects.tbd': 'Project details are being updated: name, role and scope of work.',
  'exp.title': 'My working journey.',
  'exp.desc': 'Roles in interface development and graphic design.',
  'exp.r1': 'Front-end developer & Graphic designer at VNNIC',
  'exp.d1': 'Front-end development and graphic design at VNNIC. Detailed description coming soon.',
  'exp.r2': 'Freelance Front-end developer & Graphic designer',
  'exp.d2': 'Freelance front-end development and graphic design. Detailed description coming soon.',
  'contact.title': "Let's build something new.",
  'contact.desc': 'Have an idea or a project to discuss? Get in touch.',
  'contact.summary':
    'Full Stack software engineer with 8+ years of experience designing and building web solutions across front-end and back-end technologies.',
  'contact.cta': "Let's work together",
  'footer.brand': 'Code & design',
  'footer.tagline': 'Building projects. Sharing knowledge.',
};

const META = {
  vi: {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? '',
  },
  en: {
    title: 'Portfolio — Code & Design',
    description:
      'Front-end development, UI/UX and graphic design portfolio. Projects, skills, experience and contact details.',
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
