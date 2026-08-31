/* Появление. Класс .is-pre вешается скриптом и только тем блокам,
   что реально ниже вьюпорта: разметка остаётся видимой для печати,
   скриншота, фоновой вкладки и ботов. */
export function initReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visible = document.visibilityState === 'visible';
  if (reduced || !visible || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-motion');

  const els = Array.from(document.querySelectorAll('.rail, .rv'));
  const edge = window.innerHeight * 0.92;
  const hidden = els.filter((el) => el.getBoundingClientRect().top > edge);
  if (!hidden.length) return;

  hidden.forEach((el) => el.classList.add('is-pre'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pre');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

  hidden.forEach((el) => io.observe(el));

  const showAll = () => hidden.forEach((el) => el.classList.remove('is-pre'));
  window.addEventListener('beforeprint', showAll);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') showAll();
  });
  // страховка: если наблюдатель не отработал, через 3 с показываем всё
  setTimeout(showAll, 3000);
}
