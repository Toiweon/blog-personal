/* Este script sirve para todos los html (comprobar) (funciona: true)*/

(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector('#themeToggle');
  const langToggle = document.querySelector('#langToggle');
  const toast = document.querySelector('#toast');
  let toastTimer;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  const STRINGS = {
    en: { night: 'Dark mode', day: 'Light mode', switchTo: 'Español' },
    es: { night: 'Modo noche', day: 'Modo día', switchTo: 'English' }
  };

  /* idioma guardado (por defecto english) */
  let lang = 'en';
  try {
    const saved = localStorage.getItem('isaacLang');
    if (saved === 'en' || saved === 'es') lang = saved;
  } catch (e) {}

  function syncTheme() {
    if (!themeToggle) return;
    const dark = root.classList.contains('dark');
    const label = dark ? STRINGS[lang].day : STRINGS[lang].night;
    themeToggle.textContent = label;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('aria-pressed', String(dark));
  }

  function applyLang(next) {
    lang = next;
    root.lang = lang;
    root.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-en][data-es]').forEach(function (el) {
      el.textContent = el.dataset[lang];
    });

    if (root.dataset[lang === 'en' ? 'titleEn' : 'titleEs']) {
      document.title = root.dataset[lang === 'en' ? 'titleEn' : 'titleEs'];
    }
    if (langToggle) {
      langToggle.textContent = STRINGS[lang].switchTo;
      langToggle.setAttribute('aria-label', lang === 'en' ? 'cambiar a español' : 'switch to English');
    }

    syncTheme();
    try { localStorage.setItem('isaacLang', lang); } catch (e) {}
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      applyLang(lang === 'en' ? 'es' : 'en');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const dark = root.classList.toggle('dark');
      try { localStorage.setItem('isaacTheme', dark ? 'dark' : 'light'); } catch (e) {}
      syncTheme();
    });
  }

  /* enlaces de ejemplo que avisan hasta que pongas la dirección real */
  document.querySelectorAll('[data-placeholder]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (link.getAttribute('href') === '#') {
        event.preventDefault();
        const name = link.textContent.trim();
        notify(lang === 'en'
          ? 'Change the link for ' + name + ' in the HTML.'
          : 'Cambia el enlace de ' + name + ' en el HTML.');
      }
    });
  });

  applyLang(lang);
})();
