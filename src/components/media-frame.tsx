import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isProjectMediaAvailable } from "@/lib/project-media";

type MediaFrameProps = {
  label: string;
  title?: string;
  kind?: "video" | "image" | "placeholder";
  src?: string;
  poster?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
  controls?: boolean;
};

export function MediaFrame({
  label,
  title,
  kind = "placeholder",
  src,
  poster,
  alt = "Материалы проекта",
  className,
  children,
  controls = false,
}: MediaFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [availableSrc, setAvailableSrc] = useState<string>();
  const [availablePoster, setAvailablePoster] = useState<string>();
  const [hasError, setHasError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const canLoad = isVisible && availableSrc === src && Boolean(src) && !hasError;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause();
  }, [reducedMotion]);

  useEffect(() => {
    setAvailableSrc(undefined);
    setAvailablePoster(undefined);
    setHasError(false);
    if (!isVisible || !src || kind === "placeholder") return;
    const controller = new AbortController();
    void Promise.all([
      isProjectMediaAvailable(src, controller.signal),
      poster ? isProjectMediaAvailable(poster, controller.signal) : Promise.resolve(false),
    ]).then(([available, posterExists]) => {
      if (controller.signal.aborted) return;
      if (posterExists) setAvailablePoster(poster);
      if (available) setAvailableSrc(src);
    });
    return () => controller.abort();
  }, [isVisible, src, poster, kind]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-sm bg-surface text-foreground", className)}
    >
      {kind === "image" && canLoad ? (
        <img
          src={availableSrc}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : null}
      {kind === "video" && canLoad ? (
        <video
          ref={videoRef}
          aria-label={label}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          autoPlay={!controls && !reducedMotion}
          playsInline
          preload="none"
          poster={availablePoster}
          controls={controls}
          onError={() => setHasError(true)}
        >
          <source src={availableSrc} type="video/mp4" />
        </video>
      ) : null}
      {!canLoad ? (
        <div className="pointer-events-none absolute inset-0">
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            className="absolute inset-0 h-full w-full text-muted-foreground opacity-[0.14]"
          >
            <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
              <path d="M0 0 610 150H860L1000 0M0 600 610 390H860L1000 600M610 150V390M860 150V390" />
              <path d="M0 160 610 210M0 420 610 330M1000 160 860 210M1000 420 860 330" />
              <path d="M380 0 665 150M760 0 790 150M380 600 665 390M760 600 790 390" />
            </g>
          </svg>
          <div className="absolute bottom-5 left-5 right-5 z-10 md:bottom-8 md:left-8 md:right-8">
            <p className="font-display text-2xl font-medium leading-tight text-foreground md:text-4xl">
              {title ?? label}
            </p>
            <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
              Демонстрационный кейс · исходные медиа не подключены
            </p>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}