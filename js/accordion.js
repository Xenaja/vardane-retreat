/* Аккордеоны. Размечены раскрытыми — без JS и у поисковых ботов
   текст виден. Сворачиваем только на узком экране; то, что
   пользователь раскрыл сам, обратно не схлопываем. */
export function initAccordions() {
  const accs = Array.from(document.querySelectorAll('.acc:not(.acc--keep)'));
  if (!accs.length) return;

  const wide = window.matchMedia('(min-width: 1024px)');

  const apply = () => {
    accs.forEach((d) => {
      if (wide.matches) d.open = true;
      else if (!d.dataset.touched) d.open = false;
    });
  };

  accs.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (!wide.matches) d.dataset.touched = '1';
    });
  });

  apply();
  wide.addEventListener('change', () => {
    accs.forEach((d) => delete d.dataset.touched);
    apply();
  });
}
