import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoPlaceholder from "@/assets/logo-placeholder.png";
import { settingsQuery } from "@/lib/content";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "خانه" },
  { to: "/packages", label: "پکیج‌های آموزشی" },
  { to: "/articles", label: "مقالات" },
  { to: "/about", label: "درباره رودا" },
  { to: "/contact", label: "تماس" },
] as const;

export function Header() {
  const { data: settings } = useQuery(settingsQuery);
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const logo = settings?.["logo_url"] || logoPlaceholder;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="نشان رودا"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-contain"
          />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-primary-deep">
              {settings?.["brand_title"] || "رودا"}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {settings?.["brand_subtitle"] || "دایرکتوری و سناریو"}
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
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
            >
              مدیریت
            </Link>
          )}
          <Button asChild size="sm" className="rounded-xl">
            <Link to={user ? "/profile" : "/auth"}>{user ? "پروفایل" : "ورود / ثبت‌نام"}</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="منو"
          className="rounded-lg p-2 text-primary-deep transition-colors hover:bg-muted lg:hidden"
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
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary-deep"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary"
              >
                مدیریت
              </Link>
            )}
            <Link
              to={user ? "/profile" : "/auth"}
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              {user ? "پروفایل" : "ورود / ثبت‌نام"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
