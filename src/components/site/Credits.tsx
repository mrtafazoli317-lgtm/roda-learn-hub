import { ExternalLink, Globe, Phone, Send, Sparkles } from "lucide-react";

const ITEMS = [
  {
    icon: Send,
    label: "تلگرام",
    value: "@GGMMD81",
    href: "https://t.me/GGMMD81",
  },
  {
    icon: Phone,
    label: "شماره تماس",
    value: "۰۹۹۰۴۱۴۰۰۲۴",
    href: "tel:+989904140024",
  },
  {
    icon: Globe,
    label: "وب‌سایت مجموعه",
    value: "rovix-studio",
    href: "https://rovix-studio-craft.lovable.app/",
  },
];

export function Credits() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="credits-title">
      <div className="surface-card relative overflow-hidden p-6 sm:p-10">
        <div className="soft-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-right">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary-deep">
              <Sparkles className="size-4" /> طراح و برنامه‌نویس
            </span>
            <h2 id="credits-title" className="mt-4 text-2xl font-black text-primary-deep sm:text-3xl">
              محمد تفضلی
            </h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">
              بهترین برای طراحی و برنامه‌نویسی
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-2xl">
            {ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-deep">
                  <item.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1 text-right">
                  <span className="block text-[11px] text-muted-foreground">{item.label}</span>
                  <span dir="ltr" className="block truncate text-sm font-bold text-primary-deep">
                    {item.value}
                  </span>
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
