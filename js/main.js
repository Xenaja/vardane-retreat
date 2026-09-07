/* Точка входа. Модули подключаются здесь и только здесь.
   Аккордеоны FAQ работают на нативном <details> — скрипт им не нужен. */
import { initReveal } from './reveal.js';
import { initScroll } from './scroll.js';
import { initForm } from './form.js';
import { initCounters } from './counters.js';
import { initParallax } from './parallax.js';

initReveal();
initScroll();
initForm();
initCounters();
initParallax();
