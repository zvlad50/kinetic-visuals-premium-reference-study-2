<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the case registry as the sole project-content source and preserve the existing TanStack nested routes; this keeps project additions consistent across views.
- Validate media URLs with the browser-safe project-media helper before mounting image/video elements; missing assets and HTML fallbacks must never produce broken project imagery.
- Use the shared editorial Button variant and global semantic tokens for restrained navigation and actions; this keeps the portfolio consistent when theme values change.
- Centralize font loading in the root head and font families in global CSS tokens, with real weight/style faces and synthetic fonts disabled; all nested views inherit consistent typography.
- Inventory local project media at Vite configuration time and validate MIME before mounting known files; absent local assets must not generate repeated network probes. Rebuild after adding media; filesystem code stays build-time only.
- Derive public browser and app-icon fallbacks from the project favicon mark, and reference them centrally in the root head; this prevents legacy favicon and touch-icon requests from falling back to unrelated branding.