import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { ArticleCard, PackageCard, SectionHead } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { articlesQuery, packagesQuery, settingsQuery } from "@/lib/content";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "رودا | پلتفرم آموزشی مهارت‌های اداری و دیجیتال" },
      {
        name: "description",
        content:
          "رودا؛ پکیج‌های آموزشی مهارت اداری، مهارت دیجیتال و مدیریت محتوا به همراه مقالات کاربردی.",
      },
      { property: "og:title", content: "رودا | پلتفرم آموزشی مهارت‌های اداری و دیجیتال" },
      {
        property: "og:description",
        content: "رودا؛ پکیج‌های آموزشی مهارت اداری، مهارت دیجیتال و مدیریت محتوا به همراه مقالات کاربردی.",
      },
    ],
  }),
  component: Index,
});

const pillars = [
  { icon: GraduationCap, title: "مهارت اداری", desc: "مکاتبات، نظم کاری و ابزارهای دفتر کار." },
  { icon: Sparkles, title: "مهارت دیجیتال", desc: "ابزارهای دیجیتال، اتوماسیون و بهره‌وری." },
  { icon: BookOpen, title: "مدیریت محتوا", desc: "تولید، برنامه‌ریزی و انتشار محتوای حرفه‌ای." },
];

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: packages } = useQuery(packagesQuery(3));
  const { data: articles } = useQuery(articlesQuery(3));

  return (
    <>
      <Hero eyebrow="پلتفرم آموزشی حرفه‌ای">
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl">
            <Link to="/packages">مشاهده پکیج‌های آموزشی</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl bg-background/70">
            <Link to="/articles">خواندن مقالات</Link>
          </Button>
        </div>
      </Hero>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">درباره رودا</h2>
          <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
            {settings?.["about_text"] ||
              "رودا یک برند آموزشی مدرن است که بر مهارت‌های اداری، مهارت‌های دیجیتال و مدیریت محتوا تمرکز دارد."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="surface-card p-6 text-center">
              <p.icon className="mx-auto size-7 text-primary" />
              <h3 className="mt-4 text-base font-bold text-primary-deep">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SectionHead
          title="پکیج‌های آموزشی"
          desc="آموزش‌های کاربردی و دسته‌بندی‌شده رودا"
          href="/packages"
          linkLabel="همه پکیج‌ها"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(packages ?? []).map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead
          title="آخرین مقالات"
          desc="نوشته‌هایی درباره مهارت اداری، دیجیتال و محتوا"
          href="/articles"
          linkLabel="همه مقالات"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(articles ?? []).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
        <div className="surface-card p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-primary-deep">ارتباط با رودا</h2>
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
