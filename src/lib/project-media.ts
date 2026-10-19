declare const __PROJECT_MEDIA_PATHS__: string[];
const localPaths =
  typeof __PROJECT_MEDIA_PATHS__ === "undefined" ? null : new Set(__PROJECT_MEDIA_PATHS__);

export function isKnownMissingProjectMedia(src: string, paths: ReadonlySet<string> | null) {
  return paths !== null && src.startsWith("/cases/") && !paths.has(src);
}

/** Known-absent local files never trigger 404 probes; other URLs still require MIME validation. */
export async function isProjectMediaAvailable(src: string, signal?: AbortSignal) {
  if (isKnownMissingProjectMedia(src, localPaths)) return false;
  try {
    const response = await fetch(src, { method: "HEAD", signal: signal ?? null });
    const type = response.headers.get("content-type") ?? "";
    return response.ok && (type.startsWith("image/") || type.startsWith("video/"));
  } catch {
    return false;
  }
}