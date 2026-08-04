import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/site/Hero";
import { settingsQuery } from "@/lib/content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "درباره رودا | برند آموزشی مهارت‌های کاربردی" },
      {
        name: "description",
        content: "معرفی برند آموزشی رودا و مسیر آموزشی آن در مهارت‌های اداری، دیجیتال و محتوا.",
      },
      { property: "og:title", content: "درباره رودا" },
      { property: "og:description", content: "معرفی برند آموزشی رودا و سازنده آن." },
    ],
  }),
  component: About,
});

function About() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <>
      <Hero eyebrow="درباره ما" compact />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">درباره رودا</h1>
        <p className="mt-5 text-sm leading-8 text-muted-foreground sm:text-base">
          {settings?.["about_text"]}
        </p>
        <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
          رودا با هدف ساده‌سازی یادگیری مهارت‌های کاربردی شکل گرفت. تمرکز ما بر آموزش‌هایی است که
          مستقیماً در محیط کار قابل استفاده باشند: از مکاتبات اداری و نظم اطلاعاتی تا ابزارهای
          دیجیتال، تولید محتوا و مدیریت شبکه‌های اجتماعی.
        </p>
        <h2 className="mt-10 text-lg font-bold text-primary-deep">سازنده رودا</h2>
        <p className="mt-3 text-sm leading-8 text-muted-foreground sm:text-base">
          رودا توسط تیمی کوچک و متمرکز اداره می‌شود که سال‌ها در حوزه آموزش، تولید محتوا و
          مهارت‌های اداری فعالیت کرده است. هر پکیج و هر مقاله پیش از انتشار بازبینی می‌شود تا
          کاربردی و قابل اجرا باشد.
        </p>
      </section>
    </>
  );
}
