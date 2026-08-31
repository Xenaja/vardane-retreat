/* Липкая полоса действия на телефоне: живёт от конца первого экрана
   до формы — у самой формы она перекрывала бы её же кнопку. */
export function initScroll() {
  const bar = document.getElementById('bar');
  const hero = document.querySelector('.hero');
  const form = document.getElementById('form');
  if (!bar || !hero || !form) return;
  let ticking = false;

  const frame = () => {
    ticking = false;
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const formNear = form.getBoundingClientRect().top < window.innerHeight * 0.9;
    bar.classList.toggle('is-shown', pastHero && !formNear);
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
