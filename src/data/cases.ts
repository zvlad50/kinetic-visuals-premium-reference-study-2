export type CaseRoom = {
  name: string;
};

export type PortfolioCase = {
  slug: string;
  tag: string;
  title: string;
  text: string;
  meta: string;
  status: string;
  previewVideo: string;
  beforeImage: string;
  afterVideo: string;
  frameCount: number;
  rooms: CaseRoom[];
};

export const cases: PortfolioCase[] = [
  {
    slug: "kvartira",
    tag: "Квартира",
    title: "Квартира в новостройке",
    text: "Спокойный проход по светлой квартире с акцентом на планировку, объём и материалы.",
    meta: "Интерьер · проход по комнатам · единый свет",
    status: "Демонстрационный проект",
    previewVideo: "/cases/kvartira/preview.mp4",
    beforeImage: "/cases/kvartira/before.webp",
    afterVideo: "/cases/kvartira/after.mp4",
    frameCount: 0,
    rooms: [
      { name: "Вход" },
      { name: "Гостиная" },
      { name: "Кухня" },
      { name: "Спальня" },
      { name: "Терраса" },
    ],
  },
  {
    slug: "loft",
    tag: "Дизайн интерьера",
    title: "Лофт-студия дизайнера",
    text: "Камерная сцена с мягким движением камеры, фактурными деталями и ощущением глубины.",
    meta: "Лофт · анимированные зоны · атмосферный свет",
    status: "Демонстрационный проект",
    previewVideo: "/cases/loft/preview.mp4",
    beforeImage: "/cases/loft/before.webp",
    afterVideo: "/cases/loft/after.mp4",
    frameCount: 0,
    rooms: [
      { name: "Вход" },
      { name: "Гостиная" },
      { name: "Кухня" },
      { name: "Спальня" },
      { name: "Терраса" },
    ],
  },
  {
    slug: "dom",
    tag: "Загородный дом",
    title: "Загородный дом",
    text: "Неспешный маршрут по дому с переходом от входной зоны к открытому виду на террасу.",
    meta: "Дом · маршрут по объекту · дневной свет",
    status: "Демонстрационный проект",
    previewVideo: "/cases/dom/preview.mp4",
    beforeImage: "/cases/dom/before.webp",
    afterVideo: "/cases/dom/after.mp4",
    frameCount: 0,
    rooms: [
      { name: "Вход" },
      { name: "Гостиная" },
      { name: "Кухня" },
      { name: "Спальня" },
      { name: "Терраса" },
    ],
  },
];

export function getCaseBySlug(slug: string) {
  return cases.find((item) => item.slug === slug);
}