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
import { RichEditor } from "@/components/admin/RichEditor";
import type { Article } from "@/lib/content";

const empty = {
  id: "",
  slug: "",
  title: "",
  summary: "",
  cover_url: "",
  category: "عمومی",
  content: "",
  published: true,
};

type Draft = typeof empty;

function slugify(input: string) {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `post-${Date.now()}`
  );
}

export function ArticlesManager() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: list } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        slug: d.slug.trim() || slugify(d.title),
        title: d.title.trim(),
        summary: d.summary.trim(),
        cover_url: d.cover_url || null,
        category: d.category.trim() || "عمومی",
        content: d.content,
        published: d.published,
      };
      if (!payload.title) throw new Error("عنوان مقاله الزامی است");
      const res = d.id
        ? await supabase.from("articles").update(payload).eq("id", d.id)
        : await supabase.from("articles").insert(payload);
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      toast.success("مقاله ذخیره شد");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (e: Error) => toast.error(e.message || "ذخیره ناموفق بود"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("مقاله حذف شد");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  if (draft) {
    return (
      <div className="surface-card space-y-5 p-6">
        <h2 className="text-lg font-bold text-primary-deep">
          {draft.id ? "ویرایش مقاله" : "مقاله جدید"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>عنوان</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>دسته‌بندی</Label>
            <Input
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              placeholder="مهارت اداری، مهارت دیجیتال، ..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>نشانی اینترنتی (اختیاری)</Label>
          <Input
            dir="ltr"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            placeholder="به‌صورت خودکار ساخته می‌شود"
          />
        </div>

        <div className="space-y-2">
          <Label>خلاصه</Label>
          <Textarea
            rows={2}
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          />
        </div>

        <ImageField
          label="تصویر کاور"
          value={draft.cover_url}
          onChange={(v) => setDraft({ ...draft, cover_url: v })}
        />

        <RichEditor
          label="متن مقاله"
          value={draft.content}
          onChange={(v) => setDraft({ ...draft, content: v })}
        />

        <div className="flex items-center gap-3">
          <Switch
            checked={draft.published}
            onCheckedChange={(v) => setDraft({ ...draft, published: v })}
            id="pub"
          />
          <Label htmlFor="pub">منتشر شود</Label>
        </div>

        <div className="flex gap-3">
          <Button
            className="rounded-xl"
            disabled={save.isPending}
            onClick={() => save.mutate(draft)}
          >
            ذخیره مقاله
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
        <h2 className="text-lg font-bold text-primary-deep">مقالات</h2>
        <Button className="rounded-xl" onClick={() => setDraft({ ...empty })}>
          <Plus className="size-4" />
          مقاله جدید
        </Button>
      </div>

      <div className="space-y-3">
        {(list ?? []).map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div>
              <p className="text-sm font-bold text-primary-deep">{a.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.category} · {a.published ? "منتشرشده" : "پیش‌نویس"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={() =>
                  setDraft({
                    id: a.id,
                    slug: a.slug,
                    title: a.title,
                    summary: a.summary,
                    cover_url: a.cover_url ?? "",
                    category: a.category,
                    content: a.content,
                    published: a.published,
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
                  if (window.confirm("این مقاله حذف شود؟")) remove.mutate(a.id);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {(list?.length ?? 0) === 0 && (
          <p className="text-sm text-muted-foreground">هنوز مقاله‌ای ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
