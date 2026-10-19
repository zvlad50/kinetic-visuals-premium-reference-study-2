import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { MediaFrame } from "@/components/media-frame";
import { Button } from "@/components/ui/button";
import { getCaseBySlug } from "@/data/cases";

export const Route = createFileRoute("/cases/$slug/")({
  loader: ({ params }) => {
    const item = getCaseBySlug(params.slug);
    if (!item) {
      throw notFound();
    }
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Кейс"} — Kinetic Visuals` },
      {
        name: "description",
        content: loaderData?.text ?? "Демонстрационный проект анимированного сайта для интерьера.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Кейс"} — Kinetic Visuals` },
      {
        property: "og:description",
        content: loaderData?.text ?? "Страница демонстрационного проекта.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CasePage,
});

function CasePage() {
  const item = Route.useLoaderData();
  const [mode, setMode] = useState<"before" | "after">("after");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 md:px-12 lg:px-16">
        <Link to="/" className="inline-flex min-h-11 items-center text-lg font-medium">
          Kinetic Visuals<span className="text-primary">.</span>
        </Link>
        <Button asChild variant="editorial" className="min-h-11">
          <Link to="/">← Портфолио</Link>
        </Button>
      </header>
      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-14 md:px-12 md:pb-28 md:pt-20 lg:px-16">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span>{item.tag}</span>
          <span>{item.status}</span>
        </div>
        <h1 className="mt-7 max-w-5xl font-display text-6xl font-medium leading-none md:text-8xl">
          {item.title}
        </h1>
        <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">{item.text}</p>
        <div className="mt-12 md:mt-16">
          <div
            className="mb-5 flex gap-7 border-b border-line"
            role="group"
            aria-label="Вид материалов проекта"
          >
            <Button
              variant="editorial"
              aria-pressed={mode === "before"}
              onClick={() => setMode("before")}
              className={`min-h-11 border-b pb-4 ${mode === "before" ? "border-primary" : "border-transparent text-muted-foreground"}`}
            >
              Исходное фото
            </Button>
            <Button
              variant="editorial"
              aria-pressed={mode === "after"}
              onClick={() => setMode("after")}
              className={`min-h-11 border-b pb-4 ${mode === "after" ? "border-primary" : "border-transparent text-muted-foreground"}`}
            >
              Оживлённое
            </Button>
          </div>
          <MediaFrame
            label={mode === "before" ? "Исходное фото" : "Оживлённое видео"}
            title={item.title}
            kind={mode === "before" ? "image" : "video"}
            src={mode === "before" ? item.beforeImage : item.afterVideo}
            poster={item.beforeImage}
            alt={`Исходное фото проекта ${item.title}`}
            controls={mode === "after"}
            className="aspect-[4/3] w-full md:aspect-[1248/560]"
          />
        </div>
        <div className="mt-12 grid gap-12 border-t border-line pt-8 md:mt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <section>
            <h2 className="font-display text-4xl font-medium">Что применено</h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              {["Проход по объекту", "Оживлённые комнаты", "Единый свет и стиль"].map((text) => (
                <li key={text} className="border-b border-line pb-4">
                  {text}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-4xl font-medium">О проекте</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-5 border-b border-line pb-4">
                <dt className="text-muted-foreground">Тип объекта</dt>
                <dd className="text-right">{item.tag}</dd>
              </div>
              <div className="flex justify-between gap-5 border-b border-line pb-4">
                <dt className="text-muted-foreground">Статус</dt>
                <dd className="text-right">{item.status}</dd>
              </div>
            </dl>
          </section>
        </div>
        <div className="mt-12 border-b border-line pb-6">
          <Button asChild variant="editorial" className="min-h-11">
            <Link to="/cases/$slug/tour" params={{ slug: item.slug }}>
              {item.frameCount > 0 ? "Открыть проход по объекту →" : "Посмотреть демо-тур →"}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}