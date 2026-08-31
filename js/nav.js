/* Мобильная навигация: бургер, блокировка скролла, Esc, возврат фокуса. */
export function initNav() {
  const burger = document.getElementById('burger');
  const panel = document.getElementById('navPanel');
  if (!burger || !panel) return;

  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      burger.focus();
    }
  });

  // панель — только для узких экранов; на широком её быть не должно
  const wide = window.matchMedia('(min-width: 1024px)');
  wide.addEventListener('change', () => { if (wide.matches) setOpen(false); });
}
