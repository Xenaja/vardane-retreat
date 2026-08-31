#!/usr/bin/env bash
# Публикация лендинга. Прогоняет шлюз качества, затем пушит в GitHub Pages.
# Использование: ./deploy.sh "текст коммита"
set -euo pipefail
cd "$(dirname "$0")"

MSG="${1:-update landing}"
SRC="index.html privacy.html css js"

echo "── шлюз перед сдачей ───────────────────────────────"
fail=0

if grep -rn 'data-pending' $SRC 2>/dev/null; then
  echo "НЕ СДАВАТЬ: остались незакрытые данные (data-pending)"; fail=1
fi
if grep -rn 'data-env="dev"' $SRC 2>/dev/null; then
  echo "НЕ СДАВАТЬ: dev-режим не снят"; fail=1
fi
# из шаблонного списка убрано слово placeholder: атрибут placeholder="…"
# и CSS-псевдоэлемент ::placeholder — это вёрстка поля, а не заглушка контента
if grep -rniE 'lorem|\+7 000|000-00-00|уточня|заглушка|TODO|example\.com' $SRC 2>/dev/null; then
  echo "НЕ СДАВАТЬ: в разметке остались плейсхолдеры"; fail=1
fi
if grep -rn 'style="' index.html privacy.html 2>/dev/null; then
  echo "НЕ СДАВАТЬ: инлайновые стили — правило проекта их запрещает"; fail=1
fi

# домен обязателен: без него canonical/og/sitemap не выставлены
if ! grep -q 'rel="canonical"' index.html; then
  echo "ВНИМАНИЕ: canonical не выставлен — домен ещё не выбран (PENDING D-01)"
fi

[ "$fail" -eq 0 ] || { echo "── шлюз не пройден ──"; exit 1; }
echo "шлюз пройден"

if [ ! -d .git ]; then
  echo "Репозиторий не инициализирован. Сначала: git init && git remote add origin <url>"
  exit 1
fi

git add -A
git commit -m "$MSG"
git push
echo "готово: изменения ушли в GitHub Pages"
