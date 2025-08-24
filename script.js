// Глобальные переменные
const root = document.documentElement;

// NAV blob logic
const nav = document.querySelector('.nav');
const blob = document.getElementById('blob');
const buttons = Array.from(document.querySelectorAll('.nav-btn'));

function placeBlob(el) {
  const rect = el.getBoundingClientRect();
  const parentRect = nav.getBoundingClientRect();
  const left = rect.left - parentRect.left + (rect.width - 90) / 2;
  blob.style.transform = `translateX(${left}px)`;
  blob.style.width = Math.max(rect.width - 10, 90) + 'px';
}

// initialize
let activeBtn = buttons[0];
window.addEventListener('load', () => placeBlob(activeBtn));
window.addEventListener('resize', () => placeBlob(activeBtn));

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeBtn = btn;
    placeBlob(btn);
    switchPanel(btn.dataset.target);
  });
});

// получить панели (те же id'ы, что у тебя)
const panels = {
  home: document.getElementById('home-panel'),
  services: document.getElementById('services-panel'),
  about: document.getElementById('about-panel')
};

// current panel state
let currentPanel = panels.home;

// Устанавливаем начальную видимую панель
function initPanels() {
  Object.values(panels).forEach(p => p.classList.remove('active'));
  currentPanel.classList.add('active');
  
  // устанавливаем начальную высоту для home панели
  const panelsContainer = document.querySelector('.panels');
  panelsContainer.classList.remove('services-active', 'about-active');
}
initPanels();

// Простая функция переключения
function switchPanel(target) {
  if (!panels[target]) return;
  if (currentPanel === panels[target]) return;

  // убрать active у старой — она плавно исчезнет
  currentPanel.classList.remove('active');

  // показать новую
  const newPanel = panels[target];
  newPanel.classList.add('active');

  // обновляем ссылку
  currentPanel = newPanel;

  // обновляем высоту контейнера panels
  const panelsContainer = document.querySelector('.panels');
  panelsContainer.classList.remove('services-active', 'about-active');
  
  if (target === 'services') {
    panelsContainer.classList.add('services-active');
  } else if (target === 'about') {
    panelsContainer.classList.add('about-active');
  }
}

// subtle 3D tilt on mouse move over glass
const glass = document.getElementById('glass');
glass.addEventListener('mousemove', (e) => {
  const r = glass.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dx = (e.clientX - cx) / r.width;
  const dy = (e.clientY - cy) / r.height;
  const rx = (-dy) * 6; // tilt X
  const ry = dx * 10;   // tilt Y
  glass.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
});

glass.addEventListener('mouseleave', () => {
  glass.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
});

// small parallax on avatar
const avatar = document.getElementById('avatar');
glass.addEventListener('mousemove', (e) => {
  const r = glass.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  avatar.style.transform = `translate3d(${px * 8}px, ${py * 8}px, 0) scale(1.02)`;
});

glass.addEventListener('mouseleave', () => {
  avatar.style.transform = 'translate3d(0,0,0)';
});

// small keyboard accessibility: left/right change
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const idx = buttons.indexOf(activeBtn);
    const next = e.key === 'ArrowRight' ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
    buttons[next].click();
  }
});

// Helpful hint: if you don't have an avatar yet, use a placeholder image
document.getElementById('avatar').addEventListener('error', () => {
  avatar.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, Arial" font-size="28" fill="#999">No avatar</text></svg>');
});

// Переключатель темы
const themeToggle = document.getElementById('theme-toggle');

// Загружаем сохраненную тему
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeToggle.setAttribute('data-theme', savedTheme);

// Функция переключения темы
function toggleTheme() {
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Плавно меняем тему
  root.setAttribute('data-theme', newTheme);
  themeToggle.setAttribute('data-theme', newTheme);
  
  // Сохраняем в localStorage
  localStorage.setItem('theme', newTheme);
  
  // Добавляем класс для анимации
  document.body.classList.add('theme-transitioning');
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 400);
}

// Обработчик клика
themeToggle.addEventListener('click', toggleTheme);

// Добавляем CSS для плавного перехода
const style = document.createElement('style');
style.textContent = `
  body.theme-transitioning * {
    transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease !important;
  }
`;
document.head.appendChild(style);

// Переключатель языка
const languageToggle = document.getElementById('language-toggle');

// Загружаем сохраненный язык
const savedLang = localStorage.getItem('language') || 'en';
root.setAttribute('data-lang', savedLang);
languageToggle.setAttribute('data-lang', savedLang);

// Переводы
const translations = {
  en: {
    title: "Minimal Bio — Mirror Glass",
    name: "ColdPierce",
    role: "Web Developer • Designer",
    home: "Home",
    services: "Services",
    about: "About me",
    bio: "Minimalist bio. I build crisp interfaces and focus on timeless, usable design.",
    uiDesign: "UI/UX Design",
    uiDesc: "Design systems, product interfaces, and micro-interactions.",
    frontend: "Frontend Development",
    frontendDesc: "React, vanilla JS, performant markup and animation.",
    branding: "Branding",
    brandingDesc: "Minimal identity, logo and visual direction.",
    aboutText1: "I am a developer and designer who loves building minimal interfaces and smooth experiences. I prefer subtlety, clarity and motion that feels natural.",
    aboutText2: "Based remotely — available for freelance and collaboration.",
    footer: "© 2024 ColdPierce. Made with ❤️"
  },
  ru: {
    title: "Минимальная Биография — Зеркальное Стекло",
    name: "ColdPierce",
    role: "Веб-разработчик • Дизайнер",
    home: "Главная",
    services: "Услуги",
    about: "Обо мне",
    bio: "Минималистичная биография. Я создаю четкие интерфейсы и фокусируюсь на вневременном, удобном дизайне.",
    uiDesign: "UI/UX Дизайн",
    uiDesc: "Системы дизайна, интерфейсы продуктов и микро-взаимодействия.",
    frontend: "Frontend Разработка",
    frontendDesc: "React, vanilla JS, производительная разметка и анимация.",
    branding: "Брендинг",
    brandingDesc: "Минималистичная идентичность, логотип и визуальное направление.",
    aboutText1: "Я разработчик и дизайнер, который любит создавать минималистичные интерфейсы и плавные впечатления. Я предпочитаю тонкость, ясность и движение, которое кажется естественным.",
    aboutText2: "Работаю удаленно — доступен для фриланса и сотрудничества.",
    footer: "© 2024 ColdPierce. Сделано с ❤️"
  }
};

// Функция переключения языка
function toggleLanguage() {
  const currentLang = root.getAttribute('data-lang');
  const newLang = currentLang === 'en' ? 'ru' : 'en';
  
  // Плавно меняем язык
  root.setAttribute('data-lang', newLang);
  languageToggle.setAttribute('data-lang', newLang);
  
  // Сохраняем в localStorage
  localStorage.setItem('language', newLang);
  
  // Применяем переводы с анимацией
  applyTranslations(newLang);
  
  // Добавляем класс для анимации
  document.body.classList.add('lang-transitioning');
  setTimeout(() => {
    document.body.classList.remove('lang-transitioning');
  }, 400);
}

// Применение переводов
function applyTranslations(lang) {
  const t = translations[lang];
  
  // Заголовок страницы
  document.title = t.title;
  
  // Имя и роль
  document.getElementById('name').textContent = t.name;
  document.getElementById('role').textContent = t.role;
  
  // Кнопки навигации
  document.querySelector('[data-target="home"]').textContent = t.home;
  document.querySelector('[data-target="services"]').textContent = t.services;
  document.querySelector('[data-target="about"]').textContent = t.about;
  
  // Биография
  document.querySelector('#home-panel p').textContent = t.bio;
  
  // Услуги
  const serviceElements = document.querySelectorAll('.service');
  serviceElements[0].querySelector('h4').textContent = t.uiDesign;
  serviceElements[0].querySelector('p').textContent = t.uiDesc;
  serviceElements[1].querySelector('h4').textContent = t.frontend;
  serviceElements[1].querySelector('p').textContent = t.frontendDesc;
  serviceElements[2].querySelector('h4').textContent = t.branding;
  serviceElements[2].querySelector('p').textContent = t.brandingDesc;
  
  // Обо мне
  const aboutElements = document.querySelectorAll('.about p');
  aboutElements[0].textContent = t.aboutText1;
  aboutElements[1].textContent = t.aboutText2;
  
  // Футер
  document.querySelector('.footer-left').textContent = t.footer;
}

// Применяем переводы при загрузке
applyTranslations(savedLang);

// Обработчик клика для переключателя языка
languageToggle.addEventListener('click', toggleLanguage);

// Добавляем CSS для плавного перехода языка
const langStyle = document.createElement('style');
langStyle.textContent = `
  body.lang-transitioning * {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  [data-lang="ru"] .name {
    font-size: 26px;
  }
  
  [data-lang="ru"] .role {
    font-size: 13px;
  }
  
  [data-lang="ru"] .nav button {
    font-size: 14px;
    padding: 10px 16px;
  }
`;
document.head.appendChild(langStyle);

