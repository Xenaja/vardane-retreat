/* Шапка и липкая полоса действия. Полоса живёт от конца первого
   экрана до формы: у самой формы она мешала бы её же кнопке. */
export function initScroll() {
  const hd = document.getElementById('hd');
  const bar = document.getElementById('bar');
  const hero = document.querySelector('.hero');
  const form = document.getElementById('form');
  let ticking = false;

  const frame = () => {
    ticking = false;
    const y = window.pageYOffset || document.documentElement.scrollTop;
    if (hd) hd.classList.toggle('is-scrolled', y > 24);
    if (bar && hero && form) {
      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const formNear = form.getBoundingClientRect().top < window.innerHeight * 0.9;
      bar.classList.toggle('is-shown', pastHero && !formNear);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  };

  frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}
