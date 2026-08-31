/* Лид-форма -> Cloudflare Worker -> Telegram.
   Воркер общий с лендингом Захаревича, заявки этого ретрита
   помечаются префиксом [тати] в поле task.
   ⚠️ Домен страницы должен быть добавлен в ALLOW_ORIGIN воркера,
   иначе браузер получит ошибку CORS (curl её не покажет). */
const ENDPOINT = 'https://sochi-retreat-lead-form.xenonline77.workers.dev';
const FALLBACK = 'Не получилось отправить. Позвоните или напишите: +7 906 976-53-53';

const isValidContact = (raw) => {
  const v = raw.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return true;
  if (/(t\.me\/|telegram\.me\/|max\.ru\/)[a-zA-Z0-9_-]{3,}/i.test(v)) return true;
  if (/^@[a-zA-Z0-9_]{4,}$/.test(v)) return true;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export function initForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const btn = form.querySelector('button[type=submit]');
  const status = document.getElementById('formStatus');

  /* Признак живого посетителя: хотя бы одно событие ввода в форме.
     Таймер «отправили быстрее двух секунд — значит бот» здесь стоял и
     оказался опасным: он молча съедал заявку у человека, который успел
     заполнить поля до срабатывания. Ввод боты подделывают реже. */
  let interacted = false;
  form.addEventListener('input', () => { interacted = true; }, { once: true });
  form.addEventListener('focusin', () => { interacted = true; }, { once: true });

  const setStatus = (msg, isErr) => {
    status.textContent = msg;
    status.classList.toggle('is-err', Boolean(isErr));
  };

  const fieldError = (input, msg) => {
    const box = document.getElementById(input.id + '-err');
    if (box) box.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };

  const checkName = () => fieldError(
    form.name,
    form.name.value.trim().length >= 2 ? '' : 'Напишите, как к вам обращаться'
  );
  const checkContact = () => fieldError(
    form.contact,
    isValidContact(form.contact.value) ? '' : 'Телефон, почта или ник в мессенджере'
  );

  form.name.addEventListener('blur', checkName);
  form.contact.addEventListener('blur', checkContact);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    // honeypot: скрытое поле заполняют только боты. Им — молчаливый успех
    if (form.company.value.trim() || !interacted) {
      setStatus('Спасибо! Заявка отправлена.');
      form.reset();
      return;
    }

    const okName = checkName();
    const okContact = checkContact();
    if (!okName || !okContact) {
      (okName ? form.contact : form.name).focus();
      return;
    }
    if (!form.consent.checked) {
      setStatus('Нужно согласие на обработку данных.', true);
      form.consent.focus();
      return;
    }

    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = 'Отправляю…';
    setStatus('');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value.trim(),
          contact: form.contact.value.trim(),
          task: '[тати] Заявка на женский ретрит в Вардане',
          page: location.href
        })
      });
      if (!res.ok) throw new Error('bad status ' + res.status);
      form.reset();
      setStatus('Спасибо! Заявка у нас. Татьяна свяжется с вами в течение дня и расскажет, как внести предоплату.');
    } catch (err) {
      console.error('lead form:', err);
      setStatus(FALLBACK, true);
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}
