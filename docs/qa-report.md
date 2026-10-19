# Технический QA — Kinetic Visuals

Аудит выполнен 18 октября 2026 в существующем проекте `d99cfe33-6890-4c8f-82e6-2570fb556a28`. Сайт не опубликован; утверждённого домена нет. Стек, дизайн и robots сохранены. Платные сервисы не подключались.

## Инвентаризация до исправлений

- Контентные маршруты: `/`, `/cases/kvartira`, `/cases/loft`, `/cases/dom`, `/cases/kvartira/tour`, `/cases/loft/tour`, `/cases/dom/tour`.
- Вложенный layout `/cases/$slug` рендерит Outlet, а не отдельную страницу.
- Главная: wordmark → `/`; четыре ссылки-якоря `#cases`, `#process`, `#services`, `#contacts`; кнопка меню; четыре ссылки мобильного меню; «Смотреть проекты»; три ссылки-превью, три ссылки-заголовка, три ссылки-стрелки к кейсам.
- Каждый кейс: wordmark и «Портфолио» → `/`; два переключателя «Исходное фото» / «Оживлённое»; ссылка на свой тур.
- Каждый пустой тур: «Портфолио» → `/`; две ссылки возврата к своему кейсу. Рейка комнат и прогресс появляются только при подключённых кадрах.
- Условное медиоуправление: видео с native controls, дополнительная кнопка воспроизведения; preview autoplay при доступном файле. Сейчас файлы отсутствуют.
- Страница 404: «На главную». React-ошибка: «Повторить» и «На главную».
- Форм, регистрации, модальных диалогов, отправки и настроенных внешних контактов нет.

## Объём фактической проверки

Chromium headless, Playwright; мобильные режимы с touch/is_mobile — **эмуляция**, не физические Android/iPhone.

Размеры: desktop **1440×1800**, tablet **768×1800**, Android-like **360×800, 412×915**, iPhone-like **390×844, 393×852**. Каждый из семи контентных маршрутов проверен на каждом размере, до и после исправлений (42 комбинации). Дополнительно `/unknown-qa`, `/cases/unknown-qa`, `/cases/unknown-qa/tour` на всех шести размерах — всего 60 загрузок в одном полном проходе, не считая кликов и reload.

### PASS после исправлений

- Все ссылки главной (wordmark, desktop/mobile якоря, «Смотреть проекты», все три превью, заголовки, стрелки) фактически нажаты; назначение существует.
- Для каждого кейса: оба переключателя нажаты; проверено aria-pressed; вход в тур и обе ссылки возврата; wordmark и «Портфолио»; назад через историю браузера.
- На каждом viewport перезагружены вложенные `/cases/kvartira` и `/cases/kvartira/tour`; другие вложенные маршруты открыты напрямую.
- Меню открывается/закрывается, мобильные ссылки закрывают его, Space/Enter работают; Esc закрывает и возвращает фокус. Resize закрывает меню при переходе на desktop (правило проверено в коде, отдельный resize-сценарий не запускался).
- Все 60 страниц: нет horizontal overflow, обрезки проверенных h1/h2/h3/p/button, пересечений ссылок/кнопок, безымянных контролов и битых img. Все видимые активные элементы имеют высоту не меньше 44 px.
- Tab/Shift+Tab, Enter/Space, видимый outline фокуса; один main и один h1 на каждой странице, включая 404; lang=ru, viewport. Автоматический axe-core на 7 маршрутах + 404, шесть размеров: **48 комбинаций, 0 violations** для WCAG 2 A/AA, 2.1 AA и best practices. Это не гарантия всей ручной доступности.
- Reduced motion: вычисленный scroll-behavior=auto; видео не запускается автоматически при reduce (проверено правило в коде; реальных видео для проверки воспроизведения нет).
- В итоговом полном обходе **0 pageerror/uncaught exceptions, 0 requestfailed**, нет 404-запросов проектных медиа. Единственные HTTP 404/сообщения console error относятся к намеренно проверенным неизвестным URL; это ожидаемо, не сломанные ссылки.
- Пустой тур честно сообщает «Материалы для интерактивного прохода пока не подключены». Инструментирование requestAnimationFrame после загрузки: **0 новых вызовов за 1 секунду простоя**.
- Favicon: HTTP 200, ICO 256×256. Форм и отправки нет — N/A.
- Аварийный SSR HTML отдельно показан через Playwright route interception на 360×800: reload и возврат нажаты, main есть, axe 0 violations. Это проверка HTML-фолбэка, **не искусственное падение настоящего сервера**.

## Подтверждённые дефекты и исправления

| До | После |
|---|---|
| Меню не закрывалось по Esc на пяти узких размерах | Закрытие и возврат фокуса; PASS повторного обхода |
| Wordmark 28 px и некоторые заголовки-ссылки 43 px высотой | min-height 44 px; PASS измерений |
| У 404 и React error отсутствовал main | Семантический main; PASS 404; React error проверен в исходнике, не вызывался |
| Повторные HEAD к отсутствующим media: baseline 1180 aborted requests, 1284 HTTP 404 (включая ожидаемые 404-маршруты) | Build-time инвентаризация public/cases; заведомо отсутствующие файлы не запрашиваются; MIME-проверка реальных сохранена; итог 0 requestfailed |
| Пустые/reduced-motion туры поддерживали бесконечный RAF | Нет animation loop без кадров; плавное подтягивание останавливается при достижении цели; 0 RAF/сек в пустом состоянии |
| Поиск ближайшего загруженного кадра сортировал массив | Линейный выбор без сортировки |
| Native video controls дублировались постоянной кнопкой Play; autoplay игнорировал reduced motion | Оставлены native controls; autoplay выключен при reduce; реальное воспроизведение NOT RUN — нет медиа |
| Poster проверялся позже mount видео | Src/poster проверяются совместно перед mount; fallback сохранён |
| Lighthouse нашёл mismatch имени превью-ссылки и видимого текста заглушки | Доступное имя теперь включает реальный видимый текст; финальный аудит mismatch=PASS |
| SSR emergency HTML светлый, без main, border-box и гарантированных targets | Тёмные семантические токены, main, 44 px, focus-visible; симуляция PASS. System font оставлен намеренно как независимый аварийный fallback |
| Lint: 155 ошибок форматирования, 9 предупреждений | Форматирование без изменения данных; 0 ошибок, 6 прежних React-refresh предупреждений UI-шаблона. Реестр изменён только добавлением завершающего перевода строки, поля/значения неизменны |

Также подсказка будущего непустого тура центрируется сверху только с xl, чтобы не пересекать верхние кнопки на промежуточной ширине. Непустой тур на реальных кадрах **не проверен**: отсутствуют исходники; текущий реестр не изменялся ради демонстрации.

## Команды и результаты

- `python3 /tmp/browser/kinetic-qa/audit.py before` — исходный полный обход, дефекты зафиксированы.
- `python3 /tmp/browser/kinetic-qa/audit.py after` — итоговый полный обход, 60 route/viewport комбинаций и клики; PASS, 0 exceptions/failed requests.
- `python3 /tmp/browser/kinetic-qa/extended.py` — axe, performance instrumentation и два Lighthouse запуска; PASS исполнения.
- `python3 /tmp/browser/kinetic-qa/error_check.py` — симулированный SSR fallback, кнопки, axe, favicon; PASS.
- `bun run lint` — исходно exit 1; итог **exit 0**, 0 errors, 6 nonblocking предупреждений react-refresh в badge/button/form/navigation-menu/sidebar/toggle. Не меняли UI-архитектуру ради удаления предупреждений.
- `bun test src/lib/project-media.test.js` — исходно 2/2 PASS, итог **4/4 PASS**; добавлены правила known-absent и known-present local media; HTML fallback отвергается, image/webp принимается.
- `bunx prettier --write …` — применён только к прочитанным и затронутым исходникам; реестр получил только финальный newline.
- Production build и TypeScript — **PASS автоматической проверки среды**, последняя запись `build OK` после изменений. Отдельные `bun run build`, `tsc`/`tsgo` вручную **NOT RUN**: среда запускает build/typecheck автоматически и запрещает дублировать их вручную. В package.json нет отдельного typecheck/test script; lint есть, тесты выполнены напрямую через Bun. Поэтому не утверждаем, что ручная команда build запускалась.

Скрипты, исходные browser/Lighthouse JSON и screenshots проверки сохранены в `/tmp/browser/kinetic-qa/`; это временные материалы QA, не опубликованные ассеты и не часть портфолио.

## Lighthouse 13.5.0 — реальное измерение

Локальные бесплатные инструменты установлены отдельно в `/tmp/kinetic-qa-tools`, без изменения dependencies проекта. Команды через запущенный Playwright Chromium с remote debugging:

```text
node /tmp/kinetic-qa-tools/node_modules/lighthouse/cli/index.js http://localhost:8080/ --port=9222 --output=json --output-path=/tmp/browser/kinetic-qa/lighthouse-desktop.json --only-categories=performance,accessibility,best-practices,seo --quiet --preset=desktop
node /tmp/kinetic-qa-tools/node_modules/lighthouse/cli/index.js http://localhost:8080/ --port=9222 --output=json --output-path=/tmp/browser/kinetic-qa/lighthouse-mobile.json --only-categories=performance,accessibility,best-practices,seo --quiet
```

| Режим, главная | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Desktop | 97 | 100 | 100 | 100 | 0.83 с | 0.93 с | 107 мс | 0.00156 |
| Mobile simulated | 74 | 100 | 100 | 100 | 2.71 с | 2.71 с | 723 мс | 0.01700 |

Это **dev-server**, не опубликованный production URL и не тест физического устройства. Большой dev payload ~10.68 MiB, неминифицированный JS (~8.34 MiB потенциальной экономии), dev runtime и блокирующий Google Fonts CSS снижают mobile Performance. Не удаляли корректные шрифты и не перестраивали сайт ради score. CLS мал; у media stage задан aspect-ratio, до видимости media не монтируется, preload=none сохранён. После будущей публикации нужно повторить Lighthouse на production; текущие баллы не обещают будущие 100/100. Lighthouse для кейсов/туров NOT RUN; их доступность/навигация/размеры проверены Playwright+axe.

## SEO

- PASS: у каждого контентного leaf-маршрута свой title/description/og:title/og:description, og:type и twitter:card; home без noindex; один h1, русский lang.
- `public/robots.txt` **не изменён**: Allow `/`, Disallow `/cases/` для перечисленных crawlers и wildcard. Все шесть demo case/tour routes сохраняют `noindex, nofollow`.
- Canonical, sitemap и og:url не добавлялись: нет подтверждённого публичного домена, preview canonical запрещён владельцем. Sitemap отсутствует, private/placeholder кейсы в него не включены. После утверждения домена: отдельная задача на self-canonical публичных leaf routes и sitemap только публичного готового контента.
- OG/Twitter image отсутствуют намеренно: нет реального проектного изображения. Никаких placeholder/social image из конкурентов. Structured data с бизнес-фактами не добавляли.
- Перед снятием case noindex: получить разрешение владельца; подключить реальные материалы с правами, завершить и проверить сравнение/тур, заменить недостоверные состояния фактическим контентом; согласованно обновить route metadata и robots. Пока ограничения не снимать.
- Indexable home после будущего релиза не означает гарантированную индексацию поисковиками. Published HTTP/crawler проверка NOT RUN — сайт не опубликован.

## Контраст

WCAG sRGB расчёт выбранных токенов: foreground/background **15.59:1**; secondary/background **7.27:1**; secondary/surface **6.77:1**; bronze/background и background/bronze **8.30:1**. Основные тексты и кнопки превышают 4.5:1; axe/Lighthouse color contrast не выявили нарушений в существующих состояниях.

## Ограничения / NOT RUN

- Физические Android/iPhone, Safari/WebKit и Firefox, screen-reader ручной прогон — **не выполнялись**; нужны устройства/дополнительный ручной аудит.
- Реальное воспроизведение preview/after, pause/seek native controls, сравнение изображений, scroll canvas/rooms на реальных кадрах — **не выполнялись**: все 9 media paths и frames отсутствуют, frameCount=0. Никаких тестовых/stock файлов не подставляли.
- React error boundary «Повторить» не вызван искусственной поломкой приложения; аварийный HTML проверен отдельно симуляцией. Обычная навигация не дала ошибок.
- Формы, отправка и auth — N/A, отсутствуют. Контакты ненастроены, вместо фиктивного CTA честный текст.
- Ручной production build/typecheck command — NOT RUN по ограничению среды; автоматическая проверка PASS.

Нужны собственные фото/видео/кадры с лицензиями, реальные контактные URL и утверждённый домен для следующего production QA. Цены — только если владелец решит их публиковать. Инвентарь: `docs/media-inventory.md`; черновые оригинальные сценарии: `docs/video-scripts.md`; структура: `public/cases/README.md`.

## Итоговое завершение без повторного полного аудита

- **PASS:** повторно выполнены `bun run lint` (exit 0, 6 предупреждений) и `bun test src/lib/project-media.test.js` (4/4).
- **PASS:** проверены наличие трёх отчётов, все файлы `public/`, обе leaf-настройки `noindex, nofollow`, отсутствие canonical в маршрутах. Сохранённый результат Playwright повторно прочитан: 60 проверок маршрутов/размеров, 0 pageerror, 0 requestfailed.
- **NOT RUN повторно:** exhaustive Playwright/Lighthouse, ручной build/typecheck; используются фактические результаты предыдущего прохода выше. На итоговой проверке текущий build log не содержал новых записей; новый запуск сборки не заявляется.
- **PASS:** в доступных итоговых проверках новых подтверждённых функциональных дефектов не обнаружено. **Ограничение:** mobile Performance 74 измерен только на dev-среде и не подтверждает production-результат.
- **NOT RUN:** ручные Git-команды (`commit`, `add`) не выполнялись. Изменения сохранены платформенным commit автоматически.
- Сайт не опубликован. Дизайн, шрифты, маршруты и стек при завершении не менялись.

## Визуальный проход отсутствующих медиа — 18.10.2026

Запись добавлена 18.10.2026 после 11:15 UTC и относится **только** к этому проходу. Все результаты полного аудита выше сохранены без изменений и не переоцениваются; повторного exhaustive audit не выполнялось.

Commit: `fbfe04d9816e9bd0b52cd88a4569525d216a7fc7` («Добавил линейную геометрию», 11:11:32 UTC). Состав подтверждён читающей командой `git show --stat`: изменены `src/components/media-frame.tsx`, `src/routes/cases.$slug.index.tsx` и `docs/premium-reference-study.md`; других кодовых файлов в этом commit нет.

- `src/components/media-frame.tsx` — статичный декоративный inline SVG (слабая линейная перспектива) и ясная подпись пустого медиаплейсхолдера.
- `src/routes/cases.$slug.index.tsx` — передаёт название кейса в пустое медиа и меняет действие пустого тура на «Посмотреть демо-тур →»; при наличии кадров действие остаётся прежним.

| Проверка этого прохода | Статус | Фактический результат |
|---|---|---|
| `bun run lint` | **PASS** | exit 0; 0 errors, 6 nonblocking предупреждений `react-refresh/only-export-components` (те же UI-файлы шаблона) |
| `bun test src/lib/project-media.test.js` | **PASS** | 4/4, 0 fail |
| Chromium `http://localhost:8080`, 1280×1800 и 360×800, `prefers-reduced-motion: reduce` | **PASS**, в проверенном объёме | Открыты главная и кейс; SVG декоративный помечен `aria-hidden`; горизонтального переполнения нет; переключатели медиа подтверждены по `aria-pressed`; CTA «Посмотреть демо-тур →» ведёт в тур с честным сообщением об отсутствии материалов |
| Ошибки и запросы к медиа кейсов | **PASS**, в этих сценариях | 0 `pageerror`; 0 запросов к `.webp`/`.mp4` кейсов |
| Автоматическая сборка платформы | **PASS** | Зафиксированная запись `2026-10-18T11:10:52Z`, `build OK` |
| Ручной build / typecheck | **NOT RUN** | Не дублировал автоматическую сборку среды |
| Lighthouse | **NOT RUN** | Новых измерений в этом проходе не было |
| Физические Android/iPhone | **NOT RUN** | Использована **эмуляция размеров окна Chromium**, не физические устройства |

## Внешняя проверка preview-адреса — BLOCKED

Внешние неаутентифицированные запросы через Firecrawl к `https://id-preview--d99cfe33-6890-4c8f-82e6-2570fb556a28.lovable.app/` и к `/cases/kvartira` вернули **HTTP 200**, но `title` страницы — `Login`, а содержимое — экран входа/согласия Lovable вместо сайта.

- **BLOCKED / NOT RUN** как проверка содержимого сайта: HTTP 200 в данном случае **не является** подтверждением работы витрины.
- Внутренняя проверка на `http://localhost:8080` остаётся единственным свидетельством и только для реально пройденных маршрутов и состояний (scope-limited).
- Публичный production-сайт и проверка поисковым роботом — **NOT RUN**: сайт не опубликован, утверждённого домена нет.

Роботы, `noindex, nofollow` на кейсах и турах, маршруты и аудитория публикации не изменялись. Сайт не опубликован; изменения сохраняет платформа, ручные git-команды не выполнялись.
## Проверка после подключения GitHub Sync — 18.10.2026, 13:30 UTC

Commit в песочнице: `77b5054`. Код не менялся.

| Проверка | Результат |
|---|---|
| `bun run lint` | PASS — 0 errors, 6 warnings (react-refresh) |
| `bun test src/lib/project-media.test.js` | PASS — 4/4 (запуск через `vitest` неприменим: файл использует `bun:test`) |
| Chromium localhost, 1280×1800 и 360×800, reduced motion | PASS — `/`, `/services/architectural-motion`, `/cases/kvartira`, `/cases/loft`, `/cases/dom`, `/cases/kvartira/tour` → 200; `/cases/nope` → 404; горизонтального переполнения, JS-ошибок и сломанных изображений нет; запросов к отсутствующим медиа нет |
| noindex | PASS — все `/cases/*` (включая тур и 404) `noindex, nofollow`; `/` и услуга без robots meta |
| robots.txt | PASS — `Disallow: /cases/` для всех агентов; `sitemap.xml` отсутствует (404) |
| Секреты | PASS — tracked `.env`/ключей и типовых токенов не найдено |
| Медиа | `public/cases/` содержит только README; реальных медиа нет |
| Backend | Не подключён (нет `src/integrations`, нет зависимостей Supabase) |
| GitHub Sync | DONE по подтверждению владельца; ассистентом не проверялся |
| Внешний preview, production, crawler, физические устройства, Lighthouse | NOT RUN |

## Production build, ссылки, доступность и токены — 18.10.2026, ~13:35 UTC

Сайт не публиковался; домен/DNS, robots и noindex не менялись.

| Проверка (команда) | Результат |
|---|---|
| `bun run build` (`vite build`) | PASS — exit 0, Nitro-сборка в `dist/` |
| `bun test` | PASS — 4/4 (единственный тестовый файл проекта) |
| `bun run lint` | PASS — 0 errors, 6 warnings (react-refresh) |
| Chromium 1280×1800: 8 маршрутов (`/`, услуга, 3 кейса, 3 тура) | PASS — по 1 `<main>`, 1 `<h1>`, `lang="ru"`, 0 ссылок/кнопок без имени, 0 `<img>` без alt |
| Все внутренние ссылки (8 уникальных путей) | PASS — HTTP 200; якоря `#cases`, `#process`, `#services`, `#contacts` существуют |
| Консоль, все маршруты | PASS — 0 errors/warnings, 0 pageerror |
| Мобильное меню 360×800 | PASS — `aria-label="Открыть меню"`, `aria-expanded` false→true по клику, false по Escape |
| CTA/контакты | Раздел «Контакты» честно сообщает «Контактные данные пока не опубликованы»; mailto/tel ссылок нет — реальные контакты нужны от владельца |
| Палитра Figma vs CSS | PASS — все 6 hex (#12100E, #1B1815, #322C26, #EFE8DC, #A89F92, #D4A35A) пересчитаны в oklch и совпадают с `--background`, `--surface`, `--line`, `--foreground`, `--muted-foreground`, `--primary` до 4 знаков; правка палитры не потребовалась |
| Spacing | Добавлены `--space-1…6` = 8/16/24/32/48/64 px в `:root`; в разметке пока не применены (визуал не менялся) |
| Автоматизированный axe/Lighthouse, экранные читалки, физические устройства, production/crawler | NOT RUN |