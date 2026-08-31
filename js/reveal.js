/* Появление блоков. Класс .is-pre вешает скрипт и только тем элементам,
   что реально ниже первого экрана: разметка остаётся видимой для печати,
   скриншота, фоновой вкладки и поисковых ботов.
   Плюс безусловный таймер-страховка — в прототипе страница уже оставалась
   пустой в нестандартных контейнерах прокрутки. */
export function initReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visible = document.visibilityState === 'visible';
  if (reduced || !visible || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-motion');

  const els = Array.from(document.querySelectorAll('.rv'));
  const edge = window.innerHeight * 1.2;
  const hidden = els.filter((el) => el.getBoundingClientRect().top > edge);
  if (!hidden.length) return;

  hidden.forEach((el) => el.classList.add('is-pre'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pre');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

  hidden.forEach((el) => io.observe(el));

  const showAll = () => hidden.forEach((el) => el.classList.remove('is-pre'));
  window.addEventListener('beforeprint', showAll);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') showAll();
  });
  setTimeout(showAll, 1400);
}
