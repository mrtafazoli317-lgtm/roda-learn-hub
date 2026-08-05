import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";

const FIELDS: { key: string; label: string; type: "text" | "textarea" | "image" }[] = [
  { key: "logo_url", label: "لوگوی سایت", type: "image" },
  { key: "site_name", label: "نام برند", type: "text" },
  { key: "hero_title", label: "تیتر اصلی صفحه نخست", type: "text" },
  { key: "hero_subtitle", label: "زیرعنوان صفحه نخست", type: "textarea" },
  { key: "product_title", label: "نام دوره", type: "text" },
  { key: "product_subtitle", label: "شعار دوره", type: "text" },
  { key: "product_description", label: "توضیح دوره", type: "textarea" },
  { key: "product_image_url", label: "تصویر دوره", type: "image" },
  { key: "product_price", label: "قیمت دوره", type: "text" },
  { key: "product_old_price", label: "قیمت قبل از تخفیف", type: "text" },
  { key: "product_purchase_url", label: "لینک ثبت‌نام/خرید", type: "text" },
  { key: "product_benefits", label: "مزیت‌ها (هر خط یک مورد)", type: "textarea" },
  { key: "product_modules", label: "سرفصل‌ها (هر خط یک مورد)", type: "textarea" },
  { key: "product_outcomes", label: "دستاوردها (هر خط یک مورد)", type: "textarea" },
  { key: "about_text", label: "متن درباره ما", type: "textarea" },
  { key: "telegram_url", label: "لینک تلگرام", type: "text" },
  { key: "instagram_url", label: "لینک اینستاگرام", type: "text" },
  { key: "contact_email", label: "ایمیل تماس", type: "text" },
  { key: "footer_note", label: "متن پاورقی", type: "text" },
];


export function SettingsManager() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""])) as Record<
        string,
        string
      >;
    },
  });

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تنظیمات ذخیره شد");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: () => toast.error("ذخیره ناموفق بود"),
  });

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <div className="surface-card space-y-5 p-6">
      <h2 className="text-lg font-bold text-primary-deep">محتوای سایت و لوگو</h2>

      {FIELDS.map((f) =>
        f.type === "image" ? (
          <ImageField
            key={f.key}
            label={f.label}
            value={values[f.key] ?? ""}
            onChange={(v) => set(f.key, v)}
          />
        ) : (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                id={f.key}
                rows={3}
                value={values[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ) : (
              <Input
                id={f.key}
                value={values[f.key] ?? ""}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </div>
        ),
      )}

      <Button className="rounded-xl" disabled={save.isPending} onClick={() => save.mutate()}>
        ذخیره تنظیمات
      </Button>
    </div>
  );
}
