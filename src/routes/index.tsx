import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/site/Hero";
import { ArticleCard, SectionHead } from "@/components/site/Cards";
import { articlesQuery, settingsQuery } from "@/lib/content";
import { ContactForm } from "@/components/site/ContactForm";
import {
  ProductCta,
  ProductDetails,
  ProductFaq,
  ProductModules,
  ProductOutcomes,
  ProductOverview,
  TrustStrip,
} from "@/components/site/Product";
import rodaLogo from "@/assets/roda-logo.png.asset.json";

const SITE_URL = "https://roda-learn-hub.lovable.app";
const TITLE = "رودا | دوره آموزشی دایرکتوری و پاسخگویی حرفه‌ای";
const DESC =
  "دوره آموزشی دایرکتوری رودا؛ آموزش پاسخگویی حرفه‌ای، روانشناسی مشتری و فروش در دایرکت به‌همراه نمونه مکالمه، چک‌لیست و پشتیبانی یک‌ساله.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}${rodaLogo.url}` },
      { name: "twitter:image", content: `${SITE_URL}${rodaLogo.url}` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "دوره جامع آموزش ادمینی رودا",
          description: DESC,
          inLanguage: "fa-IR",
          provider: { "@type": "Organization", name: "رودا", sameAs: SITE_URL },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: articles } = useQuery(articlesQuery(3));

  return (
    <>
      <Hero eyebrow="تنها محصول رودا • دوره آموزشی دایرکتوری">
        <ProductCta dark />
      </Hero>

      <TrustStrip />

      <ProductOverview />
      <ProductModules />
      <ProductDetails />
      <ProductOutcomes />

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-black text-primary-deep sm:text-3xl">درباره رودا</h2>
        <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
          {settings?.["about_text"] ||
            "رودا یک برند آموزشی مدرن است که روی آموزش تخصصی دایرکتوری و پاسخگویی حرفه‌ای تمرکز دارد."}
        </p>
      </section>

      <ProductFaq />


      {(articles ?? []).length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <SectionHead
            title="آخرین مقالات"
            desc="نوشته‌هایی درباره ادمینی، محتوا و مهارت دیجیتال"
            href="/articles"
            linkLabel="همه مقالات"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(articles ?? []).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
        <div className="surface-card p-6 sm:p-8">
          <h2 className="text-xl font-black text-primary-deep">ارتباط با رودا</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            پیام خود را بنویسید؛ در اولین فرصت پاسخ می‌دهیم.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
