import { expect, spyOn, test } from "bun:test";
import { isKnownMissingProjectMedia, isProjectMediaAvailable } from "./project-media";

test("absent local media is skipped by the build inventory", () => {
  expect(isKnownMissingProjectMedia("/cases/kvartira/preview.mp4", new Set())).toBe(true);
});

test("a registered local image still receives MIME validation", () => {
  const src = "/cases/kvartira/before.webp";
  expect(isKnownMissingProjectMedia(src, new Set([src]))).toBe(false);
});

test("missing project media is rejected even when the app returns an HTML fallback", async () => {
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
    new Response("", { status: 200, headers: { "content-type": "text/html" } }),
  );
  try {
    expect(await isProjectMediaAvailable("/cases/kvartira/before.webp")).toBe(false);
  } finally {
    fetchMock.mockRestore();
  }
});

test("a real project image is accepted", async () => {
  const fetchMock = spyOn(globalThis, "fetch").mockResolvedValue(
    new Response("", { status: 200, headers: { "content-type": "image/webp" } }),
  );
  try {
    expect(await isProjectMediaAvailable("/cases/kvartira/before.webp")).toBe(true);
  } finally {
    fetchMock.mockRestore();
  }
});