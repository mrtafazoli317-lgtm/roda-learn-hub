import { useQuery } from "@tanstack/react-query";
import { Database, HardDrive, KeyRound, Radio, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PROJECT_URL = import.meta.env["VITE_SUPABASE_URL"] as string;
const PROJECT_ID = import.meta.env["VITE_SUPABASE_PROJECT_ID"] as string;


function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span dir="ltr" className="max-w-full truncate text-sm font-semibold text-primary-deep">
        {value}
      </span>
    </div>
  );
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-bold ${ok ? "text-primary" : "text-destructive"}`}
    >
      {ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
      {label}
    </span>
  );
}

export function SystemInfo() {
  const { data: dbOk } = useQuery({
    queryKey: ["system", "db"],
    queryFn: async () => {
      const { error } = await supabase.from("site_settings").select("key").limit(1);
      return !error;
    },
  });

  const { data: session } = useQuery({
    queryKey: ["system", "auth"],
    queryFn: async () => (await supabase.auth.getSession()).data.session,
  });

  const { data: storageOk } = useQuery({
    queryKey: ["system", "storage"],
    queryFn: async () => {
      const { error } = await supabase.storage.from("media").list("", { limit: 1 });
      return !error;
    },
  });

  const tables = [
    "site_settings — تنظیمات سایت، سئو و شبکه‌های اجتماعی",
    "articles — مقالات و تصویر شاخص",
    "packages — اطلاعات دوره",
    "faq — پرسش‌های متداول",
    "contact_messages — پیام‌های فرم تماس",
    "support_messages — گفتگوهای پشتیبانی",
    "profiles / user_roles — کاربران و نقش‌ها",
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card p-6">
        <h2 className="text-lg font-bold text-primary-deep">اطلاعات سیستم</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          محل دقیق ذخیره‌سازی داده‌های سایت.
        </p>
        <div className="mt-4">
          <Row label="نام پروژه بک‌اند" value={PROJECT_ID || "—"} />
          <Row label="آدرس پروژه" value={PROJECT_URL || "—"} />
          <Row label="باکت‌های ذخیره‌سازی" value="media (خصوصی، لینک امضاشده)" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: Database, title: "پایگاه داده", value: "Postgres (Lovable Cloud)", ok: !!dbOk, status: dbOk ? "فعال" : "در دسترس نیست" },
          { icon: HardDrive, title: "ذخیره‌سازی فایل", value: "Cloud Storage — باکت media", ok: !!storageOk, status: storageOk ? "فعال" : "در دسترس نیست" },
          { icon: KeyRound, title: "احراز هویت", value: "ایمیل/رمز عبور + بازیابی رمز", ok: !!session, status: session ? "ورود انجام شده" : "بدون نشست فعال" },
          { icon: Radio, title: "به‌روزرسانی لحظه‌ای", value: "Realtime روی محتوای سایت", ok: true, status: "فعال" },
        ].map((c) => (
          <div key={c.title} className="surface-card p-5">
            <div className="flex items-center gap-2">
              <c.icon className="size-5 text-primary" />
              <h3 className="text-sm font-black text-primary-deep">{c.title}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.value}</p>
            <div className="mt-3">
              <Status ok={c.ok} label={c.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card p-6">
        <h3 className="text-sm font-black text-primary-deep">جدول‌های داده</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {tables.map((t) => (
            <li key={t} dir="ltr" className="text-right">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
