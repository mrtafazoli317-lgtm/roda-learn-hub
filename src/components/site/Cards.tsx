import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { formatDate, type Article, type Package } from "@/lib/content";
import { Button } from "@/components/ui/button";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="surface-card group flex flex-col overflow-hidden"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-primary-soft">
        {article.cover_url ? (
          <img
            src={article.cover_url}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-black text-primary/25">
            رودا
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary-deep">
          {article.category}
        </span>
        <h3 className="mt-3 text-base font-bold text-primary-deep">{article.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-7 text-muted-foreground">
          {article.summary}
        </p>
        <span className="mt-4 text-xs text-muted-foreground">{formatDate(article.created_at)}</span>
      </div>
    </Link>
  );
}

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="surface-card flex flex-col overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden bg-primary-soft">
        {pkg.image_url ? (
          <img
            src={pkg.image_url}
            alt={pkg.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-black text-primary/25">
            رودا
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-primary-deep">{pkg.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{pkg.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-primary">{pkg.price || "—"}</span>
          <Button asChild={!!pkg.purchase_url} size="sm" className="rounded-xl">
            {pkg.purchase_url ? (
              <a href={pkg.purchase_url} target="_blank" rel="noreferrer">
                تهیه پکیج
                <ArrowLeft className="size-4" />
              </a>
            ) : (
              <span>
                تهیه پکیج
                <ArrowLeft className="size-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function SectionHead({
  title,
  desc,
  href,
  linkLabel,
}: {
  title: string;
  desc?: string;
  href?: "/articles" | "/packages";
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">{title}</h2>
        {desc && <p className="mt-2 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {href && (
        <Link to={href} className="text-sm font-semibold text-primary hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
