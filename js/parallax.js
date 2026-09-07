/* Мягкий сдвиг кадра в полосах-перебивках при прокрутке.
   Кадр заранее увеличен, поэтому сдвиг не оголяет края.
   На узких экранах выключен: там полоса низкая, эффект не читается,
   а лишние вычисления на скролле телефону ни к чему. */
const SHIFT = 26;   // максимальный сдвиг в каждую сторону, px
const SCALE = 1.12;

export function initParallax() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.matchMedia('(min-width: 640px)').matches) return;

  const shots = Array.from(document.querySelectorAll('.bleed img'));
  if (!shots.length) return;

  let ticking = false;
  const frame = () => {
    ticking = false;
    const h = window.innerHeight;
    shots.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      // -1 когда полоса входит снизу, +1 когда уходит вверх
      const progress = ((r.top + r.height / 2) - h / 2) / (h / 2 + r.height / 2);
      img.style.transform = `translate3d(0, ${(progress * SHIFT).toFixed(1)}px, 0) scale(${SCALE})`;
    });
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
