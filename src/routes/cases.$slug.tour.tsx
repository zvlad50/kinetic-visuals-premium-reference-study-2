import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getCaseBySlug } from "@/data/cases";
import { isProjectMediaAvailable } from "@/lib/project-media";

export const Route = createFileRoute("/cases/$slug/tour")({
  loader: ({ params }) => {
    const item = getCaseBySlug(params.slug);
    if (!item) {
      throw notFound();
    }
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Кейс"}: проход — Kinetic Visuals` },
      {
        name: "description",
        content: "Проход по демонстрационному проекту.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Кейс"}: проход — Kinetic Visuals` },
      {
        property: "og:description",
        content: "Демонстрационный проект: проход по интерьеру при прокрутке.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TourPage,
});

function TourPage() {
  const item = Route.useLoaderData();
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const requestedFrameRef = useRef(0);
  const renderedFrameRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const hasScrollRef = useRef(false);
  const rooms = useMemo(() => item.rooms.slice(0, 5), [item.rooms]);
  const totalRooms = Math.max(rooms.length, 1);
  const [progress, setProgress] = useState(0);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [queuedFrames, setQueuedFrames] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [posterAvailable, setPosterAvailable] = useState(false);
  const [availableFrameCount, setAvailableFrameCount] = useState(item.frameCount);
  const [posterFailed, setPosterFailed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const hasFrames = item.frameCount > 0 && availableFrameCount > 0;
  const isEmpty = !hasFrames && !isLoading;
  const frameLabel = Math.min(totalRooms, activeRoomIndex + 1);
  const activeRoomName = rooms[activeRoomIndex]?.name ?? "Вход";
  const loadRatio = queuedFrames > 0 ? Math.min(1, loadedFrames / queuedFrames) : 0;

  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    let image = frameImagesRef.current.get(frameNumber);
    if (!image) {
      let nearestDistance = Infinity;
      for (const [number, candidate] of frameImagesRef.current) {
        const distance = Math.abs(number - frameNumber);
        if (distance < nearestDistance) {
          image = candidate;
          nearestDistance = distance;
        }
      }
    }
    if (!image) {
      context.clearRect(0, 0, width, height);
      return;
    }

    context.clearRect(0, 0, width, height);
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    let x = 0;
    let y = 0;

    if (imageRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
      x = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
      y = (height - drawHeight) / 2;
    }

    context.drawImage(image, x, y, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setIsReducedMotion(mediaQuery.matches);
    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);
    return () => mediaQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const node = pageRef.current;
      if (!node) {
        return;
      }

      const start = node.offsetTop;
      const distance = Math.max(1, node.offsetHeight - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      const nextRoomIndex = Math.min(totalRooms - 1, Math.floor(nextProgress * totalRooms));
      const frameProgress = isReducedMotion ? (nextRoomIndex + 0.5) / totalRooms : nextProgress;
      const nextFrame = hasFrames
        ? Math.min(
            item.frameCount,
            Math.max(1, Math.round(frameProgress * (item.frameCount - 1)) + 1),
          )
        : Math.min(totalRooms, nextRoomIndex + 1);

      requestedFrameRef.current = nextFrame;
      setProgress(nextProgress);
      setActiveRoomIndex(nextRoomIndex);
      if (!hasScrollRef.current && window.scrollY > start + 8) {
        hasScrollRef.current = true;
        setHasScrolled(true);
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [hasFrames, item.frameCount, totalRooms, isReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (isEmpty) return;
    const resizeObserver = new ResizeObserver(() => drawFrame(requestedFrameRef.current || 1));
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [drawFrame, isEmpty]);

  useEffect(() => {
    frameImagesRef.current.clear();
    setLoadedFrames(0);
    setAvailableFrameCount(item.frameCount);
    setIsLoading(item.frameCount > 0);
    setPosterAvailable(false);
    setPosterFailed(false);
    requestedFrameRef.current = 1;
    renderedFrameRef.current = 1;

    if (item.frameCount <= 0) {
      drawFrame(1);
      return;
    }

    const isNarrow = window.matchMedia("(max-width: 767px)").matches;
    const step = isNarrow ? 2 : 1;
    const primaryFrames = [...new Set([1, item.frameCount])];
    const restFrames = Array.from({ length: item.frameCount }, (_, index) => index + 1).filter(
      (frame) =>
        !primaryFrames.includes(frame) && ((frame - 1) % step === 0 || frame === item.frameCount),
    );
    const queue = [...primaryFrames, ...restFrames];
    let cancelled = false;
    const controller = new AbortController();
    setQueuedFrames(queue.length);
    if (item.beforeImage)
      void isProjectMediaAvailable(item.beforeImage, controller.signal).then((available) => {
        if (!cancelled) setPosterAvailable(available);
      });

    const loadFrame = async (frameNumber: number) => {
      const src = `/cases/${item.slug}/frames/${String(frameNumber).padStart(4, "0")}.webp`;
      if (!(await isProjectMediaAvailable(src, controller.signal)) || cancelled) return;
      await new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => {
          if (!cancelled) {
            frameImagesRef.current.set(frameNumber, image);
            setLoadedFrames((value) => value + 1);
            drawFrame(requestedFrameRef.current || 1);
          }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = src;
      });
    };

    void (async () => {
      for (const frameNumber of queue) {
        if (cancelled) {
          return;
        }
        await loadFrame(frameNumber);
      }
      if (!cancelled) {
        setAvailableFrameCount(frameImagesRef.current.size > 0 ? item.frameCount : 0);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [item.frameCount, item.slug, item.beforeImage, drawFrame]);

  useEffect(() => {
    if (!hasFrames || loadedFrames === 0) return;
    let lastDrawnFrame = -1;
    let lastLoadedCount = -1;
    const animate = () => {
      const target = requestedFrameRef.current || 1;
      if (isReducedMotion) {
        renderedFrameRef.current = target;
      } else {
        const current = renderedFrameRef.current || target;
        const next = current + (target - current) * 0.18;
        renderedFrameRef.current = Math.abs(target - next) < 0.05 ? target : next;
      }

      const frameToDraw = Math.round(renderedFrameRef.current);
      if (frameToDraw !== lastDrawnFrame || lastLoadedCount !== frameImagesRef.current.size) {
        drawFrame(frameToDraw);
        lastDrawnFrame = frameToDraw;
        lastLoadedCount = frameImagesRef.current.size;
      }
      if (!isReducedMotion && renderedFrameRef.current !== target) {
        animationRef.current = window.requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReducedMotion, progress, loadedFrames, hasFrames, drawFrame]);

  const scrollToRoom = (roomIndex: number) => {
    const node = pageRef.current;
    if (!node) {
      setActiveRoomIndex(roomIndex);
      return;
    }

    const distance = Math.max(1, node.offsetHeight - window.innerHeight);
    const nextProgress = totalRooms <= 1 ? 0 : (roomIndex + 0.5) / totalRooms;
    const top = node.offsetTop + distance * nextProgress;
    window.scrollTo({ top, behavior: isReducedMotion ? "auto" : "smooth" });
    setActiveRoomIndex(roomIndex);
    setHasScrolled(true);
  };

  return (
    <main
      ref={pageRef}
      className={`relative bg-stage text-stage-foreground ${item.frameCount > 0 && !isEmpty ? "h-[520vh]" : "min-h-svh"}`}
    >
      <section className="sticky top-0 h-svh overflow-hidden">
        {posterFailed || !posterAvailable || !hasFrames || loadedFrames > 0 ? null : (
          <img
            src={item.beforeImage}
            alt={`Исходное фото проекта ${item.title}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setPosterFailed(true)}
          />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-xl text-center">
              <p className="text-xs text-muted-foreground">Демонстрационный проект</p>
              <h1 className="mt-5 font-display text-4xl font-medium leading-tight md:text-6xl">
                {item.title}
              </h1>
              <p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
                Материалы для интерактивного прохода пока не подключены
              </p>
              <Button asChild variant="editorial" className="mt-7 min-h-11 border-b border-line">
                <Link to="/cases/$slug" params={{ slug: item.slug }}>
                  ← Вернуться к кейсу
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        <div className="absolute left-5 top-5 z-20 flex flex-col gap-2 sm:flex-row md:left-8 md:top-8">
          <Button asChild variant="editorial" className="min-h-11 bg-background/90 px-3 text-xs">
            <Link to="/" aria-label="Вернуться в портфолио">
              ← Портфолио
            </Link>
          </Button>
          <Button asChild variant="editorial" className="min-h-11 bg-background/90 px-3 text-xs">
            <Link to="/cases/$slug" params={{ slug: item.slug }} aria-label="Вернуться к кейсу">
              ← Вернуться к кейсу
            </Link>
          </Button>
        </div>

        {!isEmpty && !isReducedMotion ? (
          <div
            className={`pointer-events-none absolute left-1/2 top-32 z-10 w-[min(90vw,520px)] -translate-x-1/2 bg-background/90 px-4 py-3 text-center text-sm font-semibold text-foreground transition-opacity duration-300 xl:top-8 ${
              hasScrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            Прокрутите колёсико: камера движется вперёд и назад
          </div>
        ) : null}

        {isLoading ? (
          <div className="absolute left-0 right-0 top-0 z-30 h-px bg-line" aria-hidden="true">
            <div
              className="h-full origin-left bg-primary"
              style={{ transform: `scaleX(${loadRatio})` }}
            />
          </div>
        ) : null}

        {!isEmpty ? (
          <div className="absolute bottom-32 left-5 z-20 max-w-[calc(100%-2.5rem)] md:bottom-8 md:left-8 md:max-w-2xl">
            <p className="text-sm font-semibold uppercase text-primary">
              Кадр {frameLabel} из {totalRooms}
            </p>
            <h1 className="mt-3 font-display text-6xl font-semibold leading-none text-foreground md:text-8xl">
              {activeRoomName}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">{item.title}</p>
          </div>
        ) : null}

        {!isEmpty ? (
          <nav
            aria-label="Комнаты"
            className="absolute bottom-5 left-5 right-5 z-20 bg-background/95 p-3 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:w-52 md:-translate-y-1/2"
          >
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {rooms.map((room, index) => {
                const isActive = activeRoomIndex === index;
                return (
                  <Button
                    key={room.name}
                    type="button"
                    aria-label={`Открыть комнату: ${room.name}`}
                    onClick={() => scrollToRoom(index)}
                    variant="editorial"
                    aria-current={isActive ? "step" : undefined}
                    className={`min-h-11 shrink-0 rounded-none border-l px-4 text-left text-sm font-semibold transition-colors md:w-full md:justify-start ${
                      isActive
                        ? "border-primary text-foreground"
                        : "border-line text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="mr-3 text-xs">{String(index + 1).padStart(2, "0")}</span>
                    {room.name}
                  </Button>
                );
              })}
            </div>
          </nav>
        ) : null}

        {!isEmpty ? (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-line" aria-hidden="true">
            <div
              className="h-full origin-left bg-primary"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}