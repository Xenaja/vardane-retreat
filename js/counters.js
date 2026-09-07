/* Отсчёт крупных цифр при появлении карточки.
   В разметке стоят конечные значения — без JS, у ботов и в печати
   цифры видны сразу. Обнуляем только перед самим отсчётом. */

// «40 000 ₽» → префикс '', число 40000, суффикс ' ₽', разделитель ' '.
// Даты вроде «09.10» не трогаем: там точка, отсчитывать нечего.
function parseValue(text) {
  if (text.includes('.')) return null;
  // число обязано кончаться цифрой, иначе пробел перед «₽» уходит внутрь
  // числа и «40 000 ₽» превращается в «40 000₽»
  const m = text.match(/^(\D*?)(\d[\d\s\u00A0]*\d|\d)(.*)$/);
  if (!m) return null;
  const raw = m[2];
  const value = Number(raw.replace(/[\s\u00A0]/g, ''));
  if (!Number.isFinite(value) || value === 0) return null;
  const sep = (raw.match(/[\s\u00A0]/) || [null])[0];
  return { prefix: m[1], value, suffix: m[3], sep };
}

// разделитель разрядов берём тот же, что стоял в разметке:
// toLocaleString возвращает неразрывный пробел, а в тексте обычный
const format = (n, p) => {
  const body = p.sep ? n.toLocaleString('ru-RU').replace(/[\s\u00A0]/g, p.sep) : String(n);
  return p.prefix + body + p.suffix;
};

export function initCounters() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || document.visibilityState !== 'visible' || !('IntersectionObserver' in window)) return;

  const items = new Map();
  document.querySelectorAll('.num-card b').forEach((el) => {
    const parsed = parseValue(el.textContent.trim());
    if (parsed) items.set(el, parsed);
  });
  if (!items.size) return;

  const run = (el, parsed) => {
    const dur = 900;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(parsed.value * eased), parsed);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const parsed = items.get(entry.target);
      if (parsed) run(entry.target, parsed);
    });
  }, { threshold: 0.4 });

  items.forEach((_, el) => io.observe(el));
}
