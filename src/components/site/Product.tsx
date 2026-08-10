import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LifeBuoy,
  MessagesSquare,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqQuery, settingsQuery, toList } from "@/lib/content";

export function ProductCta({ dark = false }: { dark?: boolean }) {
  const { data: settings } = useQuery(settingsQuery);
  const url = settings?.["product_purchase_url"];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button asChild size="lg" className="brand-button rounded-full px-8 text-base font-bold">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer">
            ثبت‌نام در دوره
            <ArrowLeft className="size-5" />
          </a>
        ) : (
          <Link to="/contact">
            ثبت‌نام در دوره
            <ArrowLeft className="size-5" />
          </Link>
        )}
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className={`rounded-full px-7 text-base font-semibold ${
          dark ? "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white" : ""
        }`}
      >
        <Link to="/packages">جزئیات دوره</Link>
      </Button>
    </div>
  );
}

export function ProductOverview() {
  const { data: settings } = useQuery(settingsQuery);
  const benefits = toList(settings?.["product_benefits"]);
  const image = settings?.["product_image_url"];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="soft-grid absolute -inset-6 -z-10 rounded-[2.5rem] opacity-70" />
          <div className="surface-card overflow-hidden">
            <SmartImage
              src={image}
              alt={settings?.["product_title"] || "دوره جامع ادمینی رودا"}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
              fallback={
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-primary-soft">
                  <GraduationCap className="size-20 text-primary/40" />
                </div>
              }
            />
          </div>

        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary-deep">
            <Sparkles className="size-4" /> تنها محصول رودا
          </span>
          <h2 className="mt-5 text-2xl font-black leading-relaxed text-primary-deep sm:text-3xl">
            {settings?.["product_title"] || "دوره جامع آموزش ادمینی"}
          </h2>
          <p className="mt-2 text-sm font-semibold text-primary">
            {settings?.["product_subtitle"] || "مهارت‌های واقعی بازار کار، بدون حاشیه"}
          </p>
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            {settings?.["product_description"]}
          </p>

          {benefits.length > 0 && (
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="leading-7">{b}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="glass-card border-primary/15 bg-primary-soft/70 px-5 py-3">
              {settings?.["product_old_price"] && (
                <span className="ms-2 text-xs text-muted-foreground line-through">
                  {settings["product_old_price"]}
                </span>
              )}
              <span className="text-lg font-black text-primary-deep">
                {settings?.["product_price"] || "—"}
              </span>
            </div>
            <ProductCta />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductModules() {
  const { data: settings } = useQuery(settingsQuery);
  const modules = toList(settings?.["product_modules"]);
  if (!modules.length) return null;

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-black text-primary-deep sm:text-3xl">سرفصل‌های دوره</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          مسیر یادگیری گام‌به‌گام، از مفاهیم پایه تا مهارت درآمدزایی.
        </p>

        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {modules.map((m, i) => (
            <li key={m} className="surface-card flex items-start gap-4 p-5">
              <span className="num grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-sm font-black text-primary-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1.5 text-sm font-semibold leading-7 text-foreground/90">{m}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProductOutcomes() {
  const { data: settings } = useQuery(settingsQuery);
  const outcomes = toList(settings?.["product_outcomes"]);
  if (!outcomes.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-black text-primary-deep sm:text-3xl">
        بعد از این دوره چه می‌توانید بکنید؟
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {outcomes.map((o) => (
          <div key={o} className="surface-card p-6">
            <Target className="size-6 text-primary" />
            <p className="mt-4 text-sm font-semibold leading-8 text-foreground/90">{o}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductFaq() {
  const { data: faq } = useQuery(faqQuery);
  if (!faq?.length) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="text-center text-2xl font-black text-primary-deep sm:text-3xl">
        پرسش‌های پرتکرار
      </h2>
      <Accordion type="single" collapsible className="mt-10">
        {faq.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-start text-sm font-bold text-primary-deep">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-8 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function ProductDetails() {
  const { data: settings } = useQuery(settingsQuery);
  const blocks = [
    {
      title: "محتوای دوره",
      icon: BookOpen,
      items: toList(settings?.["product_content"]),
    },
    {
      title: "خدمات پس از خرید",
      icon: LifeBuoy,
      items: toList(settings?.["product_after_sales"]),
    },
    {
      title: "مناسب برای",
      icon: Users,
      items: toList(settings?.["product_audience"]),
    },
  ].filter((b) => b.items.length > 0);

  if (!blocks.length) return null;

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.title} className="surface-card h-full p-6">
              <div className="flex items-center gap-2">
                <b.icon className="size-5 shrink-0 text-primary" />
                <h2 className="text-base font-black text-primary-deep">{b.title}</h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {b.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-7 text-foreground/85">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { icon: LifeBuoy, title: "پشتیبانی یک‌ساله", desc: "یک سال پاسخگویی به سؤال‌های شما" },
    { icon: Sparkles, title: "آپدیت رایگان", desc: "به‌روزرسانی محتوای دوره بدون هزینه" },
    { icon: BadgeCheck, title: "آموزش کاربردی", desc: "بدون تئوری خسته‌کننده، مبتنی بر تجربه" },
    { icon: MessagesSquare, title: "نمونه مکالمات واقعی", desc: "۳۰ تا ۵۰ مکالمه آماده و قابل استفاده" },
    { icon: GraduationCap, title: "آموزش گام‌به‌گام", desc: "از صفر، بدون پیش‌نیاز فنی" },
    { icon: Target, title: "مناسب بازار کار", desc: "مهارتی که همین امروز درآمدزاست" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i.title} className="surface-card flex items-start gap-3 p-5 transition-transform hover:-translate-y-0.5">
            <i.icon className="mt-0.5 size-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary-deep">{i.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
