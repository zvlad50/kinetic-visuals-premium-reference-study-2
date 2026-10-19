import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MediaFrame } from "@/components/media-frame";

export const Route = createFileRoute("/services/architectural-motion")({
  head: () => ({
    meta: [
      {
        title: "Архитектурный моушн для девелоперов — Kinetic Visuals",
      },
      {
        name: "description",
        content:
          "Оживление архитектурных фотографий и визуализаций: короткие кинематографичные ролики для презентации домов и квартир в продаже. Фасады, интерьеры, мини-презентации объектов.",
      },
      {
        property: "og:title",
        content: "Архитектурный моушн для девелоперов — Kinetic Visuals",
      },
      {
        property: "og:description",
        content:
          "Превращаем статичные фото и рендеры объектов в короткие кинематографичные движения камеры — без искажения архитектуры.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchitecturalMotion,
});

const benefits = [
  {
    title: "Объект оживает до показа",
    text: "Покупатель видит дом или квартиру в движении ещё до визита — на сайте, в объявлении или в презентации отдела продаж.",
  },
  {
    title: "Работаем с тем, что есть",
    text: "Достаточно готовых фотографий или визуализаций объекта. Не требуется новая съёмка или полный 3D-продакшн.",
  },
  {
    title: "Короткий формат",
    text: "Ролики длиной в секунды, а не минуты: их удобно встроить в карточку объекта, листинг или слайд.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Вы присылаете изображения",
    text: "Фотографии или визуализации объекта: фасад, интерьеры, ключевые ракурсы.",
  },
  {
    number: "02",
    title: "Определяем движение камеры",
    text: "Вместе выбираем направление: подход к фасаду, раскрытие комнаты, последовательность кадров.",
  },
  {
    number: "03",
    title: "Смотрите и забираете ролики",
    text: "Показываем результат, вносим правки и отдаём короткие клипы в нужных форматах.",
  },
];

const useCases = [
  {
    title: "Фасад и подход к дому",
    text: "Плавное движение камеры к зданию или вдоль фасада — первое впечатление от объекта на сайте девелопера.",
  },
  {
    title: "Раскрытие интерьера",
    text: "Камера входит в комнату и показывает глубину пространства: планировка читается без единого слова.",
  },
  {
    title: "Мини-презентация объекта",
    text: "Несколько коротких сцен, собранных в одну последовательность для листинга, сайта или презентации отдела продаж.",
  },
];

const fidelityPoints = [
  "Сохраняем архитектуру: расположение окон, фасад, геометрию комнат.",
  "Мебель и материалы остаются такими, как на исходных изображениях.",
  "Движение камеры добавляет объём, но не меняет сам объект.",
  "Оживлённые кадры помечаются как визуализация — без введения покупателя в заблуждение.",
];

function ArchitecturalMotion() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 lg:px-16">
          <Link
            to="/"
            aria-label="Kinetic Visuals — главная"
            className="inline-flex min-h-11 items-center text-lg font-medium"
          >
            Kinetic Visuals<span className="text-primary">.</span>
          </Link>
          <Button asChild variant="editorial" className="min-h-11">
            <Link to="/">
              <ArrowLeft className="mr-3" /> Портфолио
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-6 pb-14 pt-14 md:px-12 md:pb-20 md:pt-20 lg:px-16 lg:pt-24">
        <p className="max-w-sm text-xs leading-6 text-muted-foreground">
          Услуга для девелоперов и отделов продаж недвижимости
        </p>
        <h1 className="mt-7 max-w-[1050px] font-display text-[44px] font-medium leading-[1.02] sm:text-[64px] lg:text-[88px]">
          Архитектурный моушн:
          <br />
          дома и квартиры в движении
        </h1>
        <div className="mt-9 flex flex-col justify-between gap-6 md:mt-12 md:flex-row md:items-end">
          <Button
            asChild
            variant="editorial"
            className="min-h-11 self-start border-b border-primary pb-3 md:self-auto"
          >
            <Link to="/" hash="contacts">
              Обсудить проект <ArrowUpRight className="ml-5" />
            </Link>
          </Button>
          <p className="max-w-[430px] text-sm leading-7 text-muted-foreground">
            Превращаем статичные фотографии и визуализации объектов в короткие кинематографичные
            ролики — для сайта девелопера, карточки объекта или презентации.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12 md:pb-28 lg:px-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-6">
          <h2 className="text-sm font-medium">Как это выглядит</h2>
          <p className="text-xs text-muted-foreground">
            Иллюстративные заглушки — не реальные работы
          </p>
        </div>
        <div className="grid items-start gap-x-12 gap-y-16 md:grid-cols-12">
          <figure className="md:col-span-7">
            <MediaFrame label="Фасад · движение камеры" kind="video" className="aspect-[4/3]" />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Иллюстративный плейсхолдер: подход камеры к фасаду жилого дома.
            </figcaption>
          </figure>
          <figure className="md:col-span-5 md:pt-32">
            <MediaFrame
              label="Интерьер · раскрытие комнаты"
              kind="video"
              className="aspect-[4/5]"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Иллюстративный плейсхолдер: камера входит в комнату и показывает глубину.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24 lg:px-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-baseline">
            <h2 className="font-display text-5xl font-medium md:text-6xl">Зачем это девелоперу</h2>
            <p className="text-xs text-muted-foreground">Презентация объектов в продаже</p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="border-t border-line pb-9 pt-5">
                <h3 className="font-display text-3xl font-medium">{benefit.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24 lg:px-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-baseline">
            <h2 className="font-display text-5xl font-medium md:text-6xl">Три шага</h2>
            <p className="text-xs text-muted-foreground">От исходных кадров до готовых роликов</p>
          </div>
          <ol className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {workflow.map((step) => (
              <li key={step.number} className="border-t border-line pb-9 pt-5">
                <span className="text-xs text-primary">{step.number}</span>
                <h3 className="mt-6 font-display text-3xl font-medium">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-16">
          <h2 className="font-display text-5xl font-medium md:text-6xl">Сценарии применения</h2>
          <div>
            {useCases.map((useCase) => (
              <article
                key={useCase.title}
                className="grid gap-4 border-t border-line py-7 first:border-t-0 first:pt-0 md:grid-cols-2 md:gap-8"
              >
                <h3 className="font-display text-3xl font-medium">{useCase.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{useCase.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-16">
          <h2 className="font-display text-5xl font-medium md:text-6xl">Верность объекту</h2>
          <ul>
            {fidelityPoints.map((point) => (
              <li
                key={point}
                className="border-t border-line py-5 text-sm leading-7 text-muted-foreground first:border-t-0 first:pt-0"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24 lg:px-16">
          <p className="text-xs text-muted-foreground">Обсудить проект</p>
          <h2 className="mt-6 max-w-3xl font-display text-5xl font-medium leading-none md:text-7xl">
            Покажите объект в движении
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-muted-foreground">
            Пришлите фотографии или визуализации объекта — предложим направление движения камеры и
            формат роликов под вашу задачу.
          </p>
          <Button
            asChild
            variant="editorial"
            className="mt-10 min-h-11 border-b border-primary pb-3"
          >
            <Link to="/" hash="contacts">
              Перейти к контактам <ArrowUpRight className="ml-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-6 py-8 md:flex-row md:px-12 lg:px-16">
          <p className="text-sm">Kinetic Visuals</p>
          <p className="max-w-lg text-xs leading-6 text-muted-foreground">
            Оживлённые фотографии и рендеры помечаются как визуализация и не заменяют реальные
            материалы объекта.
          </p>
        </div>
      </footer>
    </main>
  );
}