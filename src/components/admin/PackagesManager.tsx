import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/ImageField";
import type { Package } from "@/lib/content";

const empty = {
  id: "",
  title: "",
  description: "",
  image_url: "",
  price: "",
  purchase_url: "",
  published: true,
  sort_order: 0,
};

type Draft = typeof empty;

export function PackagesManager() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: list } = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Package[];
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      if (!d.title.trim()) throw new Error("عنوان پکیج الزامی است");
      const payload = {
        title: d.title.trim(),
        description: d.description.trim(),
        image_url: d.image_url || null,
        price: d.price.trim(),
        purchase_url: d.purchase_url.trim() || null,
        published: d.published,
        sort_order: Number(d.sort_order) || 0,
      };
      const res = d.id
        ? await supabase.from("packages").update(payload).eq("id", d.id)
        : await supabase.from("packages").insert(payload);
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      toast.success("پکیج ذخیره شد");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "packages"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e: Error) => toast.error(e.message || "ذخیره ناموفق بود"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("پکیج حذف شد");
      qc.invalidateQueries({ queryKey: ["admin", "packages"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
  });

  if (draft) {
    return (
      <div className="surface-card space-y-5 p-6">
        <h2 className="text-lg font-bold text-primary-deep">
          {draft.id ? "ویرایش پکیج" : "پکیج جدید"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>قیمت</Label>
            <Input
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              placeholder="مثلاً ۴۹۰٬۰۰۰ تومان"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>توضیحات</Label>
          <Textarea
            rows={4}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </div>

        <ImageField
          label="تصویر پکیج"
          value={draft.image_url}
          onChange={(v) => setDraft({ ...draft, image_url: v })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>لینک تهیه (اختیاری)</Label>
            <Input
              dir="ltr"
              value={draft.purchase_url}
              onChange={(e) => setDraft({ ...draft, purchase_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>ترتیب نمایش</Label>
            <Input
              type="number"
              dir="ltr"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="pkg-pub"
            checked={draft.published}
            onCheckedChange={(v) => setDraft({ ...draft, published: v })}
          />
          <Label htmlFor="pkg-pub">نمایش در سایت</Label>
        </div>

        <div className="flex gap-3">
          <Button className="rounded-xl" disabled={save.isPending} onClick={() => save.mutate(draft)}>
            ذخیره پکیج
          </Button>
          <Button variant="ghost" className="rounded-xl" onClick={() => setDraft(null)}>
            انصراف
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary-deep">پکیج‌های آموزشی</h2>
        <Button className="rounded-xl" onClick={() => setDraft({ ...empty })}>
          <Plus className="size-4" />
          پکیج جدید
        </Button>
      </div>

      <div className="space-y-3">
        {(list ?? []).map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="text-sm font-bold text-primary-deep">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.price || "بدون قیمت"} · {p.published ? "نمایش داده می‌شود" : "مخفی"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={() =>
                  setDraft({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    image_url: p.image_url ?? "",
                    price: p.price,
                    purchase_url: p.purchase_url ?? "",
                    published: p.published,
                    sort_order: p.sort_order,
                  })
                }
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg text-destructive"
                onClick={() => {
                  if (window.confirm("این پکیج حذف شود؟")) remove.mutate(p.id);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {(list?.length ?? 0) === 0 && (
          <p className="text-sm text-muted-foreground">هنوز پکیجی ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
