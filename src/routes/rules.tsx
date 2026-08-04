import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "قوانین و مقررات | رودا" },
      { name: "description", content: "شرایط استفاده از خدمات و محتوای آموزشی رودا." },
      { property: "og:title", content: "قوانین و مقررات | رودا" },
      { property: "og:description", content: "شرایط استفاده از خدمات آموزشی رودا." },
    ],
  }),
  component: Rules,
});

const items = [
  {
    t: "۱. پذیرش قوانین",
    d: "استفاده از وب‌سایت رودا به معنای پذیرش کامل این قوانین است. در صورت عدم موافقت، لطفاً از خدمات سایت استفاده نکنید.",
  },
  {
    t: "۲. حساب کاربری",
    d: "کاربر مسئول حفظ اطلاعات ورود خود است. هرگونه فعالیت انجام‌شده با حساب کاربری بر عهده صاحب حساب است.",
  },
  {
    t: "۳. مالکیت محتوا",
    d: "تمامی مقالات، پکیج‌های آموزشی و طراحی سایت متعلق به برند رودا است. بازنشر بدون ذکر منبع و اجازه کتبی مجاز نیست.",
  },
  {
    t: "۴. پکیج‌های آموزشی",
    d: "اطلاعات پکیج‌ها شامل عنوان، توضیحات و قیمت جهت اطلاع‌رسانی ارائه می‌شود و ممکن است به‌روزرسانی شود.",
  },
  {
    t: "۵. تغییر قوانین",
    d: "رودا می‌تواند این قوانین را در هر زمان به‌روزرسانی کند. نسخه منتشرشده در این صفحه معتبر است.",
  },
];

function Rules() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">قوانین و مقررات</h1>
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
