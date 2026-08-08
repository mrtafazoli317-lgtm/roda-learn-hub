import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

type MediaItem = { path: string; url: string };

async function listMedia(): Promise<MediaItem[]> {
  const folders = new Set<string>();
  const { data: roots, error } = await supabase.storage.from("media").list("", { limit: 100 });
  if (error) throw error;
  (roots ?? []).forEach((r) => {
    if (!r.id) folders.add(r.name);
  });

  const paths: string[] = [];
  for (const folder of folders) {
    const { data } = await supabase.storage
      .from("media")
      .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    (data ?? []).forEach((f) => f.id && paths.push(`${folder}/${f.name}`));
  }
  (roots ?? []).forEach((r) => r.id && paths.push(r.name));

  if (!paths.length) return [];
  const { data: signed } = await supabase.storage.from("media").createSignedUrls(paths, TEN_YEARS);
  return (signed ?? [])
    .filter((s) => s.signedUrl)
    .map((s, i) => ({ path: paths[i]!, url: s.signedUrl! }));
}

export function MediaManager() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["admin", "media"], queryFn: listMedia });

  const remove = useMutation({
    mutationFn: async (path: string) => {
      const { error } = await supabase.storage.from("media").remove([path]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تصویر حذف شد");
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (e: Error) => toast.error(e.message || "حذف ناموفق بود"),
  });

  const items = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary-deep">کتابخانه رسانه</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            همه تصویرها در فضای ذخیره‌سازی امن (باکت media) نگهداری می‌شوند.
          </p>
        </div>
        <Button
          className="rounded-xl"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          بارگذاری تصویر
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (!files.length) return;
            setBusy(true);
            try {
              for (const f of files) await uploadImage(f);
              toast.success("بارگذاری انجام شد");
              qc.invalidateQueries({ queryKey: ["admin", "media"] });
            } catch (err) {
              toast.error((err as Error).message || "بارگذاری ناموفق بود");
            } finally {
              setBusy(false);
            }
          }}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">در حال بارگذاری…</p>}
      {!isLoading && items.length === 0 && (
        <p className="text-sm text-muted-foreground">هنوز تصویری بارگذاری نشده است.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.path} className="overflow-hidden rounded-xl border border-border bg-card">
            <img
              src={m.url}
              alt={m.path}
              loading="lazy"
              className="h-32 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-2 p-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg"
                onClick={() => {
                  navigator.clipboard.writeText(m.url);
                  toast.success("لینک تصویر کپی شد");
                }}
              >
                <Copy className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg text-destructive"
                onClick={() => {
                  if (window.confirm("این تصویر حذف شود؟")) remove.mutate(m.path);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
