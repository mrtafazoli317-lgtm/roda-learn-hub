import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("تصویر آپلود شد");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "آپلود ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-20 w-20 rounded-xl border border-border object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -left-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
              aria-label="حذف تصویر"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
            <ImagePlus className="size-5" />
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : "انتخاب تصویر"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      <Input
        dir="ltr"
        placeholder="یا آدرس تصویر را وارد کنید"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
