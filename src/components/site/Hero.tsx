import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import logoPlaceholder from "@/assets/logo-placeholder.png";
import { settingsQuery } from "@/lib/content";

const Scanner = lazy(() => import("@/components/Scanner"));

export function Hero({
  eyebrow,
  children,
  compact = false,
}: {
  eyebrow?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  const { data: settings } = useQuery(settingsQuery);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    // lazy-load the WebGL effect only on capable devices, after first paint
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lowPower || reduced) return;
    const id = window.setTimeout(() => setShowEffect(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="hero-surface relative isolate overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {showEffect && (
          <Suspense fallback={null}>
            <Scanner
              className="h-full w-full"
              color1="#6e4df2"
              color2="#ff27f8"
              color3="#FFFFFF"
              speed={0.35}
              sweepSpeed={0.2}
              sweepWidth={1.8}
              glow={0.18}
              scanDirection="vertical"
              brightness={0.8}
              contrast={1.1}
              opacity={0.35}
              mouseInteraction
            />
          </Suspense>
        )}
      </div>

      <div
        className={`mx-auto max-w-6xl px-4 text-center sm:px-6 ${compact ? "py-14 sm:py-16" : "py-20 sm:py-28"}`}
      >
        <img
          src={settings?.["logo_url"] || logoPlaceholder}
          alt="نشان برند رودا"
          width={96}
          height={96}
          className="mx-auto h-20 w-20 rounded-2xl bg-background/70 object-contain p-2 shadow-[var(--shadow-soft)] sm:h-24 sm:w-24"
        />

        {eyebrow && (
          <p className="rise-in mt-6 inline-block rounded-full bg-background/70 px-4 py-1.5 text-xs font-semibold text-primary">
            {eyebrow}
          </p>
        )}

        <h1 className="rise-in mt-5 text-5xl font-extrabold tracking-tight text-primary-deep sm:text-6xl">
          {settings?.["brand_title"] || "رودا"}
        </h1>
        <p className="rise-in mt-3 text-base font-medium text-primary sm:text-lg">
          {settings?.["brand_subtitle"] || "دایرکتوری و سناریو"}
        </p>

        {children && <div className="rise-in mt-8">{children}</div>}
      </div>
    </section>
  );
}
