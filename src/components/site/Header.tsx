import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { settingsQuery } from "@/lib/content";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import rodaLogo from "@/assets/roda-logo.png.asset.json";

const nav = [
  { to: "/", label: "خانه" },
  { to: "/packages", label: "دوره آموزشی" },
  { to: "/articles", label: "مقالات" },
  { to: "/about", label: "درباره ما" },
  { to: "/contact", label: "تماس با ما" },
] as const;

export function Header() {
  const { data: settings } = useQuery(settingsQuery);
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const logo = settings?.["logo_url"] || rodaLogo.url;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-18 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="نشان رودا"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain drop-shadow-[0_6px_16px_rgba(120,60,220,0.35)]"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-lg font-black text-primary-deep">
              {settings?.["site_name"] || "رودا"}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {settings?.["site_tagline"] || "دایرکتوری و سناریو"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-primary-deep" }}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-primary-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-full px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
            >
              مدیریت
            </Link>
          )}
          <Button asChild size="sm" className="brand-button rounded-full px-5">
            <Link to={user ? "/profile" : "/auth"}>
              <Sparkles className="size-4" />
              {user ? "حساب من" : "ورود / ثبت‌نام"}
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-primary-deep transition-colors hover:bg-muted lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-primary-deep"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-primary"
              >
                مدیریت
              </Link>
            )}
            <Link
              to={user ? "/profile" : "/auth"}
              onClick={() => setOpen(false)}
              className="brand-button rounded-xl px-3 py-3 text-center text-sm font-bold"
            >
              {user ? "حساب من" : "ورود / ثبت‌نام"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
