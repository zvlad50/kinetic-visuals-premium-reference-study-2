# План деплоя — Kinetic Visuals Studio

**Дата:** 18.10.2026
**Статус:** консервативный план; сайт не опубликован, публикация не выполнялась.

---

## 1. Текущее состояние проекта

- **Проект:** Kinetic Visuals Studio, project id `d99cfe33-6890-4c8f-82e6-2570fb556a28`.
- **Стек:** TanStack Start / React, `@lovable.dev/vite-tanstack-config`, Nitro уже включён через Lovable config. Проект не пересоздавать, стек не менять.
- **Read-only состояние Git в `/dev-server` (проверено 18.10.2026):**
  - worktree чистый (нет незакоммиченных изменений);
  - ветка `edit/edt-8911aae4-6bbe-4bb5-b6a0-b22ffc2a3c4f`;
  - `origin` и `secondary` — внутренний `git.private.lovable-gcp.code.storage` (хранилище Lovable, для этого проекта);
  - GitHub-remote отсутствует.
- Ручной git не используется: изменения сохраняются платформенным commit.

## 2. Подключение GitHub Sync (шаг владельца)

GitHub native sync ещё не подключён. Подключение выполняется только в интерфейсе Lovable:

1. Открыть `https://lovable.dev/projects/d99cfe33-6890-4c8f-82e6-2570fb556a28`.
2. Project settings → Git → GitHub → Add account / Install & Authorize.
3. По возможности выбрать только нужный GitHub account и наименее широкий app access (least privilege).
4. Нажать Connect.

После подключения Lovable создаёт **новый приватный репозиторий** и включает двусторонний sync.

Ограничения:
- Существующий репозиторий подключить нельзя — всегда создаётся новый.
- Не переписывать исходники в новый Lovable project.
- Не менять remote вручную.
- Не удалять репозиторий после подключения (удаление останавливает sync).
- Подключение/отключение доступно только workspace/project owner или admin.

## 3. GitHub API tools — текущее состояние

- В GitHub API tools авторизован аккаунт `zvlad50`; просмотренные доступные репозитории **не содержат** `Kinetic Visuals Studio` — sync ещё не создал репозиторий.
- Native Lovable Git Sync — правильный путь для исходников и `docs/`.
- Figma design boards останутся в Figma; на GitHub попадёт handoff link из `docs/figma-handoff.md`.

## 4. Vercel — текущее состояние и blocker

- Vercel account-check: `get_auth_user` возвращает Hobby account `zvlad50-5370`, default team ID `team_Zu9hxpXfno6ppuGuYwqdzyiX`.
- Project listing для этого team получил `403 Not authorized ... re-authenticate to this scope`; teams/projects search пусты в текущем MCP scope.
- **Blocker:** из-за отсутствия авторизации в нужном scope импорт репозитория через Vercel MCP сейчас недоступен. Не повторять API-вызовы без изменения авторизации.
- Владелец может обойти blocker двумя способами: переподключить Vercel integration/scope или импортировать repository через браузерный dashboard (https://vercel.com/new).

## 5. Оптимальный сценарий деплоя

1. После подключения GitHub Sync открыть `https://vercel.com/new` и **Import Project** из нового приватного GitHub репозитория.
2. Официальный Vercel changelog (09 Jul 2026) заявляет zero-config поддержку Lovable apps с auto-detect TanStack Start/Nitro — ручная конфигурация сборки не требуется.
3. Начать с **PREVIEW deployment**: проверить build logs и реальные страницы, не подключать домен и не продвигать в production, пока preview не пройдёт.

## 6. Что проверить после preview

- Маршруты: `/`, `/cases/kvartira`, `/cases/loft`, `/cases/dom` и соответствующие `/tour` маршруты.
- Assets requests (нет 404 по медиа и шрифтам).
- SSR и клиентская навигация.
- Шрифты (Cormorant Garamond, Montserrat).
- `robots.txt`, `noindex,nofollow` на demo cases/tours.
- Мобильные эмулированные viewports.
- Отсутствие 404 и консольных ошибок.

Ограничения проверки:
- Внешний текущий Lovable preview URL снаружи показывает экран входа Lovable, поэтому он **не доказывает содержимое сайта** (см. `docs/qa-report.md` и `docs/premium-reference-study.md`).
- Физические Android/iPhone и production Lighthouse — **NOT RUN**.
- Локальные Chromium-проверки охватывают только проверенные маршруты и состояния.

## 7. SEO-ограничения (сохранить на всех этапах)

- Сохранить `public/robots.txt` без изменений.
- Сохранить `noindex,nofollow` на demo cases и tours.
- Не добавлять canonical без утверждённого домена.
- Не публиковать материалы кейсов, пока нет реальных лицензированных медиа.
- **Preview deploy не равен снятию SEO-ограничений.**

## 8. Production — отдельное решение владельца

После PASS preview: отдельное решение владельца перед переключением в `production` и/или подключением домена. Никаких расходов за домен, DNS, платные ресурсы или смену домена без явного одобрения владельца.

## 9. Источники

- https://docs.lovable.dev/integrations/github
- https://vercel.com/changelog/you-can-now-deploy-lovable-apps-to-vercel

Связанные документы: `docs/qa-report.md`, `docs/media-inventory.md`, `docs/premium-reference-study.md`, `docs/figma-handoff.md`.

---

## 10. Сводная таблица шагов

| # | Шаг | Статус | Следующий шаг: кто |
|---|-----|--------|--------------------|
| 1 | Read-only проверка Git-состояния в `/dev-server` | PASS (18.10.2026) | — |
| 2 | Подключение GitHub Sync в Lovable UI | NOT RUN | Owner |
| 3 | Проверка наличия репозитория через GitHub API | BLOCKED — repo ещё не создан, повторить после шага 2 | Assistant |
| 4 | Импорт проекта в Vercel через MCP | BLOCKED — 403 auth scope, требует переподключения Vercel integration | Owner (или Assistant после переподключения) |
| 5 | Импорт проекта в Vercel через браузерный dashboard (`vercel.com/new`) | NOT RUN | Owner |
| 6 | Preview deployment и проверка build logs | NOT RUN | Owner / Assistant |
| 7 | Проверка маршрутов, SSR, шрифтов, robots/noindex на preview | NOT RUN | Assistant |
| 8 | Проверка мобильных эмулированных viewports на preview | NOT RUN | Assistant |
| 9 | Физические Android/iPhone тесты | NOT RUN | Owner |
| 10 | Production Lighthouse | NOT RUN | Assistant (после preview) |
| 11 | Решение владельца о production и домене | NOT RUN — без явного одобрения никаких расходов и смены домена | Owner |