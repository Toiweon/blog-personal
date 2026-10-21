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

  /* ---- edades de las mascotas, calculadas de sus cumpleaños ---- */
  const BIRTH_DOG = new Date(2015, 7, 21);  /* 21 de agosto de 2015 (enero = 0) */
  const BIRTH_CAT = new Date(2025, 10, 25); /* 25 de noviembre de 2025 */

  function fullYears(birth, today) {
    let y = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) y--;
    return y;
  }

  function fullMonths(birth, today) {
    let m = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (today.getDate() < birth.getDate()) m--;
    return m;
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  function updateAges() {
    const today = new Date();

    /* el perro siempre en años */
    const dogY = fullYears(BIRTH_DOG, today);
    const dogEn = plural(dogY, '1 year old', dogY + ' years old');
    const dogEs = plural(dogY, '1 año', dogY + ' años');

    /* la gata en meses hasta cumplir el año, y después en años */
    const catM = fullMonths(BIRTH_CAT, today);
    let catEn, catEs;
    if (catM < 12) {
      catEn = plural(catM, '1 month old', catM + ' months old');
      catEs = plural(catM, '1 mes', catM + ' meses');
    } else {
      const catY = fullYears(BIRTH_CAT, today);
      catEn = plural(catY, '1 year old', catY + ' years old');
      catEs = plural(catY, '1 año', catY + ' años');
    }

    const ages = { dog: [dogEn, dogEs], cat: [catEn, catEs] };
    document.querySelectorAll('[data-age]').forEach(function (el) {
      const v = ages[el.dataset.age];
      if (v) { el.dataset.en = v[0]; el.dataset.es = v[1]; }
    });
  }
  updateAges();

  applyLang(lang);
})();
