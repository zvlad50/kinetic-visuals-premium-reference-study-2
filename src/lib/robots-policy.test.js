import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
const groups = robots
  .trim()
  .split(/\n\s*\n/)
  .map((block) => {
    const directives = block.split("\n").map((line) => line.split(/:\s*/, 2));
    return {
      agent: directives.find(([key]) => key.toLowerCase() === "user-agent")?.[1],
      disallows: directives
        .filter(([key]) => key.toLowerCase() === "disallow")
        .map(([, value]) => value),
      allows: directives.filter(([key]) => key.toLowerCase() === "allow").map(([, value]) => value),
    };
  });

test("all crawlers are blocked site-wide, including existing specific bot groups", () => {
  expect(groups.some((group) => group.agent === "*")).toBe(true);
  for (const agent of ["*", "Googlebot", "Bingbot", "Twitterbot", "facebookexternalhit"]) {
    const group = groups.find((entry) => entry.agent === agent);
    expect(group).toBeDefined();
    for (const path of [
      "/",
      "/services/architectural-motion",
      "/cases/kvartira",
      "/cases/dom/tour",
    ]) {
      expect(group?.disallows.some((prefix) => path.startsWith(prefix))).toBe(true);
      expect(group?.allows.some((prefix) => path.startsWith(prefix))).toBe(false);
    }
  }
});