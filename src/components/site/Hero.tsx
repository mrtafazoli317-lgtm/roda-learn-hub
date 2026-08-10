import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/content";
import rodaLogo from "@/assets/roda-logo.png.asset.json";

const Scanner = lazy(() => import("@/components/Scanner"));

export function Hero({
  eyebrow,
  title,
  subtitle,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  const { data: settings } = useQuery(settingsQuery);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    // Identical behaviour on phone and desktop — only reduced-motion users opt out.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setTimeout(() => setShowEffect(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="hero-surface relative isolate overflow-hidden">
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
              brightness={0.9}
              contrast={1.15}
              opacity={0.75}
              mouseInteraction
            />
          </Suspense>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background" />

      <div
        className={`mx-auto max-w-4xl px-4 text-center sm:px-6 ${compact ? "py-16 sm:py-20" : "py-24 sm:py-32"}`}
      >
        <SmartImage
          src={settings?.["logo_url"] || rodaLogo.url}
          alt="نشان برند رودا"
          width={128}
          height={128}
          className="float-slow mx-auto h-24 w-24 object-contain drop-shadow-[0_18px_40px_rgba(150,80,255,0.55)] sm:h-32 sm:w-32"
          fallback={
            <p className="mx-auto text-4xl font-black text-white sm:text-5xl">رودا</p>
          }
        />


        {eyebrow && (
          <p className="rise-in mt-6 inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
            {eyebrow}
          </p>
        )}

        <h1 className="rise-in mt-6 text-3xl font-black leading-[1.7] text-white sm:text-5xl">
          {title || settings?.["hero_title"] || "آموزش جامع ادمینی، از صفر تا درآمد"}
        </h1>
        <p className="rise-in mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/70 sm:text-base">
          {subtitle || settings?.["hero_subtitle"] || "تنها محصول رودا؛ یک دوره کامل و کاربردی."}
        </p>

        {children && <div className="rise-in mt-9">{children}</div>}
      </div>
    </section>
  );
}
