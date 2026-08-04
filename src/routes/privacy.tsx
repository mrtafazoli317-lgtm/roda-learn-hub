import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "حریم خصوصی | رودا" },
      { name: "description", content: "سیاست حریم خصوصی و نحوه استفاده رودا از اطلاعات کاربران." },
      { property: "og:title", content: "حریم خصوصی | رودا" },
      { property: "og:description", content: "سیاست حریم خصوصی رودا." },
    ],
  }),
  component: Privacy,
});

const items = [
  {
    t: "اطلاعاتی که جمع‌آوری می‌شود",
    d: "در زمان ثبت‌نام، ایمیل و در صورت تمایل نام شما ذخیره می‌شود. در فرم تماس، نام، ایمیل و متن پیام ثبت می‌گردد.",
  },
  {
    t: "نحوه استفاده از اطلاعات",
    d: "اطلاعات تنها برای مدیریت حساب کاربری و پاسخ‌گویی به پیام‌های شما استفاده می‌شود.",
  },
  {
    t: "اشتراک‌گذاری با دیگران",
    d: "اطلاعات کاربران فروخته یا در اختیار اشخاص ثالث تبلیغاتی قرار نمی‌گیرد.",
  },
  {
    t: "امنیت",
    d: "اطلاعات روی زیرساخت ابری با دسترسی محدود نگهداری می‌شود و تنها مدیر سایت به پیام‌ها دسترسی دارد.",
  },
  {
    t: "حقوق شما",
    d: "می‌توانید حذف حساب یا اطلاعات خود را از طریق فرم تماس درخواست کنید.",
  },
];

function Privacy() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">حریم خصوصی</h1>
      <p className="mt-3 text-sm leading-8 text-muted-foreground">
        این صفحه توسط تیم رودا نگهداری می‌شود و نحوه برخورد ما با اطلاعات کاربران را توضیح می‌دهد.
      </p>
      <div className="mt-8 space-y-6">
        {items.map((i) => (
          <div key={i.t} className="surface-card p-6">
            <h2 className="text-base font-bold text-primary-deep">{i.t}</h2>
            <p className="mt-2 text-sm leading-8 text-muted-foreground">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
