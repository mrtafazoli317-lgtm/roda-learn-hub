import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/site/Hero";
import { PackageCard } from "@/components/site/Cards";
import { packagesQuery } from "@/lib/content";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "پکیج‌های آموزشی رودا" },
      {
        name: "description",
        content: "فهرست پکیج‌های آموزشی رودا در حوزه مهارت اداری، مهارت دیجیتال و مدیریت محتوا.",
      },
      { property: "og:title", content: "پکیج‌های آموزشی رودا" },
      { property: "og:description", content: "پکیج‌های آموزشی کاربردی برای مهارت‌های شغلی." },
    ],
  }),
  component: Packages,
});

function Packages() {
  const { data, isLoading } = useQuery(packagesQuery());

  return (
    <>
      <Hero eyebrow="پکیج‌های آموزشی" compact />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">پکیج‌های آموزشی</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          آموزش‌های ساختاریافته رودا برای رشد مهارت‌های کاری شما.
        </p>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">در حال بارگذاری…</p>
        ) : (data?.length ?? 0) === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">هنوز پکیجی منتشر نشده است.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data!.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
