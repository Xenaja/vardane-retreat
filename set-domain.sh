#!/usr/bin/env bash
# Переезд на свой адрес: подставляет домен во все абсолютные ссылки
# и кладёт CNAME. Запускать ТОЛЬКО после того, как DNS-запись
# разошлась — файл CNAME включает custom domain в Pages, и до
# готовности DNS сайт будет недоступен.
# Использование: ./set-domain.sh kundalini.fest-sun.ru
set -euo pipefail
cd "$(dirname "$0")"

DOMAIN="${1:-}"
[ -n "$DOMAIN" ] || { echo "Укажите домен: ./set-domain.sh kundalini.fest-sun.ru"; exit 1; }
DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%/}"

OLD="https://xenaja.github.io/vardane-retreat"
NEW="https://$DOMAIN"

echo "── подстановка адреса ──────────────────────────────"
echo "было:  $OLD/"
echo "стало: $NEW/"
for f in index.html privacy.html robots.txt sitemap.xml; do
  before=$(grep -c "xenaja.github.io/vardane-retreat" "$f" || true)
  sed -i "s#$OLD#$NEW#g" "$f"
  after=$(grep -c "xenaja.github.io/vardane-retreat" "$f" || true)
  echo "  $f: заменено $before, осталось $after"
done

# без CNAME Pages отдаёт домен как чужой
echo "$DOMAIN" > CNAME
echo "  CNAME: $DOMAIN"
echo
echo "Дальше: git push, затем Custom domain в настройках Pages,"
echo "Enforce HTTPS и https://$DOMAIN в ALLOW_ORIGIN воркера."
