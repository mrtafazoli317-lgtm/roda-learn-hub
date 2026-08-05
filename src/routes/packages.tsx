import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/site/Hero";
import { settingsQuery } from "@/lib/content";
import {
  ProductCta,
  ProductFaq,
  ProductModules,
  ProductOutcomes,
  ProductOverview,
} from "@/components/site/Product";
import rodaLogo from "@/assets/roda-logo.png.asset.json";

const SITE_URL = "https://roda-learn-hub.lovable.app";
const TITLE = "دوره جامع آموزش ادمینی | رودا";
const DESC =
  "سرفصل‌ها، دستاوردها و شرایط ثبت‌نام دوره جامع آموزش ادمینی رودا؛ آموزش پروژه‌محور مدیریت پیج و تولید محتوا.";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${SITE_URL}/packages` },
      { property: "og:image", content: `${SITE_URL}${rodaLogo.url}` },
      { name: "twitter:image", content: `${SITE_URL}${rodaLogo.url}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/packages` }],
  }),
  component: Packages,
});

function Packages() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <>
      <Hero
        eyebrow="دوره ادمینی"
        title={settings?.["product_title"] || "دوره جامع آموزش ادمینی"}
        subtitle={settings?.["product_subtitle"] || "مهارت‌های واقعی بازار کار، بدون حاشیه"}
        compact
      >
        <ProductCta dark />
      </Hero>

      <ProductOverview />
      <ProductModules />
      <ProductOutcomes />
      <ProductFaq />

      <section className="mx-auto max-w-3xl px-4 pb-10 text-center sm:px-6">
        <div className="surface-card p-8">
          <h2 className="text-xl font-black text-primary-deep">آماده شروع هستید؟</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            همین امروز مسیر ادمین‌شدن حرفه‌ای را با رودا شروع کنید.
          </p>
          <div className="mt-6">
            <ProductCta />
          </div>
        </div>
      </section>
    </>
  );
}
