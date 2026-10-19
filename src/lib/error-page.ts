export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Страница не загрузилась</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <style>
      :root { --background: #12100E; --foreground: #EFE8DC; --secondary: #A89F92; --divider: #322C26; --primary: #D4A35A; }
      * { box-sizing: border-box; }
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: var(--background); color: var(--foreground); display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: var(--secondary); margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0.5rem 1rem; border-radius: 4px; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      a:focus-visible, button:focus-visible { outline: 2px solid var(--primary); outline-offset: 4px; }
      .primary { background: var(--primary); color: var(--background); }
      .secondary { background: var(--background); color: var(--foreground); border-color: var(--divider); }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Страница не загрузилась</h1>
      <p>Что-то пошло не так. Можно повторить попытку или вернуться на главную.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Повторить</button>
        <a class="secondary" href="/">На главную</a>
      </div>
    </main>
  </body>
</html>`;
}