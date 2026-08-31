/* Точка входа. Модули подключаются здесь и только здесь. */
import { initNav } from './nav.js';
import { initAccordions } from './accordion.js';
import { initReveal } from './reveal.js';
import { initScroll } from './scroll.js';
import { initForm } from './form.js';

initNav();
initAccordions();
initReveal();
initScroll();
initForm();
