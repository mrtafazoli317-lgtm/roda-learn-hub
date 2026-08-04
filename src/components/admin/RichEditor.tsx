import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bold, Heading2, Image as ImageIcon, Italic, Link2, List, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { Label } from "@/components/ui/label";

/**
 * Very small rich-text editor built on contentEditable — no extra dependency.
 * Produces simple HTML that is sanitized again before it is rendered publicly.
 */
export function RichEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    // only sync when the editor is not focused (avoids caret jumps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  }

  async function insertImage(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      exec("insertHTML", `<img src="${url}" alt="" loading="lazy" />`);
      toast.success("تصویر به مقاله اضافه شد");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "آپلود ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  const tools = [
    { icon: Bold, title: "درشت", run: () => exec("bold") },
    { icon: Italic, title: "مورب", run: () => exec("italic") },
    { icon: Heading2, title: "تیتر", run: () => exec("formatBlock", "<h2>") },
    { icon: List, title: "فهرست", run: () => exec("insertUnorderedList") },
    {
      icon: Link2,
      title: "لینک",
      run: () => {
        const url = window.prompt("آدرس لینک:");
        if (url) exec("createLink", url);
      },
    },
  ];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-xl border border-input">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 p-2">
          {tools.map((t) => (
            <button
              key={t.title}
              type="button"
              title={t.title}
              onClick={t.run}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
            >
              <t.icon className="size-4" />
            </button>
          ))}
          <button
            type="button"
            title="افزودن تصویر"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => insertImage(e.target.files?.[0])}
          />
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          className="article-body min-h-56 bg-background p-4 text-sm outline-none"
        />
      </div>
    </div>
  );
}
