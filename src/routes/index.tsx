import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MediaFrame } from "@/components/media-frame";
import { cases } from "@/data/cases";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kinetic Visuals — фотографии, по которым можно пройти" },
      {
        name: "description",
        content:
          "Анимированные сайты для интерьеров и недвижимости. Демонстрационные проекты Kinetic Visuals.",
      },
      { property: "og:title", content: "Kinetic Visuals — фотографии, по которым можно пройти" },
      {
        property: "og:description",
        content: "Фото, визуализации и движение камеры. Портфолио демонстрационных проектов.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navLinks = [
  { href: "#cases", label: "Проекты" },
  { href: "#process", label: "Процесс" },
  { href: "#services", label: "Услуги" },
  { href: "#contacts", label: "Контакты" },
];
const motionServiceLink = {
  to: "/services/architectural-motion" as const,
  label: "Для девелоперов",
};
const steps = [
  {
    number: "01",
    title: "Фото или планировка",
    text: "Берём готовые кадры, визуализации или основу для будущего маршрута.",
  },
  {
    number: "02",
    title: "Ключевые кадры",
    text: "Определяем точки, через которые камера должна пройти без резких скачков.",
  },
  {
    number: "03",
    title: "Оживление",
    text: "Собираем движение, свет и переходы так, чтобы объект воспринимался объёмно.",
  },
  { number: "04", title: "Сайт", text: "Собираем витрину проекта с адаптацией под телефон." },
];
const services = [
  {
    title: "Оживление фото",
    text: "Аккуратное движение камеры, света и деталей для одного изображения или визуализации.",
  },
  {
    title: "Сайт с проходом по объекту",
    text: "Витрина, где посетитель проходит по интерьеру через прокрутку страницы.",
  },
  {
    title: "Шаблон для агентства",
    text: "Единая структура и визуальный стиль для серии объектов.",
  },
];

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [isMenuOpen]);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="relative z-30 border-b border-line">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 lg:px-16">
          <Link
            to="/"
            aria-label="Kinetic Visuals — главная"
            className="inline-flex min-h-11 items-center text-lg font-medium"
          >
            Kinetic Visuals<span className="text-primary">.</span>
          </Link>
          <nav
            aria-label="Основное меню"
            className="hidden items-center gap-9 text-sm text-muted-foreground lg:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              to={motionServiceLink.to}
              className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
            >
              {motionServiceLink.label}
            </Link>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="editorial"
            size="icon"
            className="h-11 w-11 lg:hidden"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Мобильное меню"
          hidden={!isMenuOpen}
          className="absolute left-0 right-0 border-b border-line bg-background px-6 pb-5 lg:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-12 items-center border-t border-line text-sm"
            >
              {link.label}
            </a>
          ))}
          <Link
            to={motionServiceLink.to}
            onClick={() => setIsMenuOpen(false)}
            className="flex min-h-12 items-center border-t border-line text-sm"
          >
            {motionServiceLink.label}
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1440px] px-6 pb-14 pt-14 md:px-12 md:pb-20 md:pt-20 lg:px-16 lg:pt-24">
        <p className="max-w-sm text-xs leading-6 text-muted-foreground">
          Анимированные сайты для интерьеров и недвижимости
        </p>
        <h1 className="mt-7 max-w-[1050px] font-display text-[52px] font-medium leading-[0.98] sm:text-[72px] lg:text-[104px]">
          Фотографии,
          <br />
          по которым можно пройти
        </h1>
        <div className="mt-9 flex flex-col justify-between gap-6 md:mt-12 md:flex-row md:items-end">
          <Button
            asChild
            variant="editorial"
            className="min-h-11 self-start border-b border-primary pb-3 md:self-auto"
          >
            <a href="#cases">
              Смотреть проекты <ArrowDown className="ml-5" />
            </a>
          </Button>
          <p className="max-w-[430px] text-sm leading-7 text-muted-foreground">
            Превращаю фото и визуализации интерьеров в сайты, где камера движется вместе с
            прокруткой колёсика.
          </p>
        </div>
      </section>

      <section id="cases" className="mx-auto max-w-[1440px] px-6 pb-20 md:px-12 md:pb-28 lg:px-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-6">
          <h2 className="text-sm font-medium">Выбранные проекты</h2>
          <p className="text-xs text-muted-foreground">Демонстрационные проекты</p>
        </div>
        <div className="grid items-start gap-x-12 gap-y-16 md:grid-cols-12 md:gap-y-24">
          {cases.map((item, index) => (
            <article
              key={item.slug}
              className={
                index === 0
                  ? "md:col-span-12"
                  : index === 1
                    ? "md:col-span-7"
                    : "md:col-span-5 md:pt-32"
              }
            >
              <Link to="/cases/$slug" params={{ slug: item.slug }} className="group block">
                <span className="sr-only">Открыть проект: </span>
                <MediaFrame
                  label={item.title}
                  kind="video"
                  src={item.previewVideo}
                  poster={item.beforeImage}
                  className={
                    index === 0
                      ? "aspect-[16/9] md:aspect-[2.15/1]"
                      : index === 1
                        ? "aspect-[4/3]"
                        : "aspect-[4/5]"
                  }
                />
              </Link>
              <div className="mt-5 flex items-start justify-between gap-4 border-b border-line pb-5">
                <div>
                  <p className="text-xs text-muted-foreground">{item.tag}</p>
                  <h3 className="mt-2 font-display text-3xl font-medium md:text-4xl">
                    <Link
                      className="inline-flex min-h-11 items-center"
                      to="/cases/$slug"
                      params={{ slug: item.slug }}
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-xl text-xs leading-6 text-muted-foreground">
                    {item.meta}
                  </p>
                </div>
                <Button asChild variant="editorial" size="icon" className="h-11 w-11 shrink-0">
                  <Link
                    to="/cases/$slug"
                    params={{ slug: item.slug }}
                    aria-label={`Открыть кейс: ${item.title}`}
                  >
                    <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24 lg:px-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-baseline">
            <h2 className="font-display text-5xl font-medium md:text-6xl">Как это работает</h2>
            <p className="text-xs text-muted-foreground">От исходного кадра до сайта</p>
          </div>
          <ol className="mt-12 grid gap-x-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.number} className="border-t border-line pb-9 pt-5">
                <span className="text-xs text-primary">{step.number}</span>
                <h3 className="mt-6 font-display text-3xl font-medium">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="services" className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-16">
          <h2 className="font-display text-5xl font-medium md:text-6xl">Услуги</h2>
          <div>
            {services.map((service) => (
              <article
                key={service.title}
                className="grid gap-4 border-t border-line py-7 first:border-t-0 first:pt-0 md:grid-cols-2 md:gap-8"
              >
                <h3 className="font-display text-3xl font-medium">{service.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{service.text}</p>
              </article>
            ))}
            <article className="grid gap-4 border-t border-line py-7 md:grid-cols-2 md:gap-8">
              <h3 className="font-display text-3xl font-medium">
                <Link
                  to={motionServiceLink.to}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-primary"
                >
                  Архитектурный моушн для девелоперов
                </Link>
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                Короткие кинематографичные ролики из фото и визуализаций объектов в продаже: фасады,
                интерьеры, мини-презентации для сайта и листингов.{" "}
                <Link
                  to={motionServiceLink.to}
                  className="text-foreground underline decoration-line underline-offset-4 transition-colors hover:text-primary"
                >
                  Подробнее об услуге
                </Link>
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="contacts" className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24 lg:px-16">
          <p className="text-xs text-muted-foreground">Контакты</p>
          <h2 className="mt-6 max-w-3xl font-display text-5xl font-medium leading-none md:text-7xl">
            Расскажите про ваш объект
          </h2>
          <p className="mt-8 text-sm text-muted-foreground">
            Контактные данные пока не опубликованы.
          </p>
        </div>
      </section>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-6 py-8 md:flex-row md:px-12 lg:px-16">
          <p className="text-sm">Kinetic Visuals</p>
          <p className="max-w-lg text-xs leading-6 text-muted-foreground">
            Демонстрационные проекты. Оживлённые фотографии помечаются как визуализация.
          </p>
        </div>
      </footer>
    </main>
  );
}