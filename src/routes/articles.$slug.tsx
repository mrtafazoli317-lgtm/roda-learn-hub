import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { articleQuery, articlesQuery, formatDate } from "@/lib/content";
import { toArticleHtml } from "@/lib/sanitize";
import { ArticleCard } from "@/components/site/Cards";

export const Route = createFileRoute("/articles/$slug")({
  component: ArticleDetail,
});

function ArticleDetail() {
  const { slug } = Route.useParams();
  const { data: article, isLoading } = useQuery(articleQuery(slug));
  const { data: all } = useQuery(articlesQuery());

  const html = useMemo(() => (article ? toArticleHtml(article.content) : ""), [article]);

  const related = (all ?? [])
    .filter((a) => a.slug !== slug && (!article || a.category === article.category))
    .slice(0, 3);
  const fallback = (all ?? []).filter((a) => a.slug !== slug).slice(0, 3);
  const relatedList = related.length ? related : fallback;

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-sm text-muted-foreground">در حال بارگذاری…</div>;
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-primary-deep">مقاله پیدا نشد</h1>
        <Link to="/articles" className="mt-4 inline-block text-sm text-primary hover:underline">
          بازگشت به مقالات
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary-deep">
        {article.category}
      </span>
      <h1 className="mt-4 text-2xl font-extrabold leading-relaxed text-primary-deep sm:text-3xl">
        {article.title}
      </h1>
      <p className="mt-2 text-xs text-muted-foreground">{formatDate(article.created_at)}</p>

      {article.cover_url && (
        <img
          src={article.cover_url}
          alt={article.title}
          className="mt-6 w-full rounded-2xl object-cover"
        />
      )}

      {article.summary && (
        <p className="mt-6 rounded-2xl bg-muted p-5 text-sm leading-8 text-muted-foreground">
          {article.summary}
        </p>
      )}

      <div
        className="article-body mt-6 text-sm text-foreground/90 sm:text-base"
        // Content is authored by the site admin and passed through an allow-list sanitizer.
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {relatedList.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 text-xl font-extrabold text-primary-deep">موضوعات مشابه</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedList.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
