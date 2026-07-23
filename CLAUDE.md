# sipiteno.com — граблі та правила

## Деплой
- Vercel prebuilt: `vercel deploy --prebuilt --prod --archive=tgz`
- Git author мусить бути team member: `sales@sipiteno.com` (інакше Vercel блокує деплой)

## Критичні граблі (НЕ повторювати)
- **НІКОЛИ manualChunks** у vite/rollup конфізі — двічі давав білий екран
- **НІКОЛИ /ux.css** у index.html SPA — ламає сторінку
- Форми йдуть на `/api/contact` — після деплою перевір, що endpoint не 404 (був катастрофічний брейк 07-23)
- robots.txt був 404 — перевіряй, що віддається 200

## Верифікація
- Це SPA — curl 200 НЕ доводить, що сторінка жива. Скріншот у браузері (375px і 1280px) обов'язково
- 827-сторінковий pSEO-флот у dist/ має template-артефакти ("Poland or India" ×336) — правки через injector по dist/, не bare-regen
