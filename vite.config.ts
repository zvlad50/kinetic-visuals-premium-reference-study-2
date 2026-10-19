// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, readdirSync } from "node:fs";
import { resolve, relative, sep } from "node:path";

// Build-time only: never bundle filesystem access into browser or Worker code.
const publicRoot = resolve("public");
const casesRoot = resolve(publicRoot, "cases");
const projectMediaPaths = existsSync(casesRoot)
  ? readdirSync(casesRoot, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(webp|png|jpe?g|avif|mp4|webm)$/i.test(entry.name))
      .map(
        (entry) =>
          `/${relative(publicRoot, resolve(entry.parentPath, entry.name)).split(sep).join("/")}`,
      )
  : [];

export default defineConfig({
  vite: { define: { __PROJECT_MEDIA_PATHS__: JSON.stringify(projectMediaPaths) } },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});