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
          {settings?.["about_text"] ||
            "رودا یک برند آموزشی تخصصی است که با تمرکز بر آموزش دایرکتوری، پاسخگویی حرفه‌ای و مهارت‌های ارتباط با مشتری فعالیت می‌کند."}
        </p>
        <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
          {settings?.["about_text_2"] ||
            "رودا با هدف ارائه آموزش‌های کاربردی و قابل اجرا شکل گرفته است. محتوای آموزشی این مجموعه با تمرکز بر مهارت‌هایی طراحی می‌شود که مخاطبان بتوانند از آن‌ها در محیط واقعی کار استفاده کنند؛ از مدیریت و پاسخگویی در دایرکت تا ارتباط مؤثر با مشتری و به‌کارگیری اصول حرفه‌ای در فرآیند فروش. هدف رودا، ارائه آموزش‌هایی ساختارمند، کاربردی و متناسب با نیازهای واقعی بازار است؛ به‌گونه‌ای که یادگیری مهارت‌ها صرفاً به دریافت اطلاعات محدود نشود و امکان استفاده عملی از آن‌ها نیز فراهم باشد."}
        </p>
        <h2 className="mt-10 text-lg font-bold text-primary-deep">
          {settings?.["about_founder_title"] || "سازنده رودا"}
        </h2>
        <p className="mt-3 text-sm leading-8 text-muted-foreground sm:text-base">
          {settings?.["about_founder_text"] ||
            "رودا یک مجموعه آموزشی مستقل و در حال توسعه است که فعالیت خود را با تمرکز تخصصی بر حوزه دایرکتوری و پاسخگویی حرفه‌ای آغاز کرده است. محتوای آموزشی و مقالات رودا با رویکرد کاربردی تهیه و پیش از انتشار بررسی می‌شوند تا مطالب ارائه‌شده از نظر ساختار، وضوح و قابلیت استفاده، کیفیت مناسبی داشته باشند. رودا در مسیر توسعه فعالیت‌های آموزشی خود، بر تولید محتوای تخصصی و ارائه آموزش‌های کاربردی در حوزه ارتباط با مشتری و مدیریت دایرکت تمرکز دارد."}
        </p>
      </section>
    </>
  );
}
