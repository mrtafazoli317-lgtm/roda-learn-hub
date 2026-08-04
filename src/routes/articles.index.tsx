import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Hero } from "@/components/site/Hero";
import { ArticleCard } from "@/components/site/Cards";
import { articlesQuery } from "@/lib/content";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "مقالات آموزشی رودا" },
      {
        name: "description",
        content:
          "مقالات رودا درباره مهارت اداری، مدیریت شبکه‌های اجتماعی، بازاریابی دیجیتال و تولید محتوا.",
      },
      { property: "og:title", content: "مقالات آموزشی رودا" },
      { property: "og:description", content: "نوشته‌های کاربردی درباره مهارت‌های اداری و دیجیتال." },
    ],
  }),
  component: Articles,
});

function Articles() {
  const { data, isLoading } = useQuery(articlesQuery());
  const [cat, setCat] = useState<string>("همه");

  const categories = ["همه", ...Array.from(new Set((data ?? []).map((a) => a.category)))];
  const list = (data ?? []).filter((a) => cat === "همه" || a.category === cat);

  return (
    <>
      <Hero eyebrow="مقالات" compact />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">مقالات</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          دانش کاربردی درباره مهارت اداری، دیجیتال و مدیریت محتوا.
        </p>

        {categories.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  cat === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary-soft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">در حال بارگذاری…</p>
        ) : list.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">مقاله‌ای یافت نشد.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
