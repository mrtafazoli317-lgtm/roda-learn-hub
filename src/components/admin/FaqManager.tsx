import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Faq } from "@/lib/content";

export function FaqManager() {
  const qc = useQueryClient();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "faq"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq")
        .select("id,question,answer,sort_order,published")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Faq[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "faq"] });
    qc.invalidateQueries({ queryKey: ["faq"] });
  };

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("faq").insert({
        question,
        answer,
        sort_order: (data?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setQuestion("");
      setAnswer("");
      toast.success("پرسش اضافه شد");
      refresh();
    },
    onError: () => toast.error("ثبت ناموفق بود"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faq").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("حذف شد");
      refresh();
    },
    onError: () => toast.error("حذف ناموفق بود"),
  });

  return (
    <div className="space-y-6">
      <div className="surface-card space-y-4 p-6">
        <h2 className="text-lg font-bold text-primary-deep">افزودن پرسش پرتکرار</h2>
        <div className="space-y-2">
          <Label htmlFor="faq-q">پرسش</Label>
          <Input id="faq-q" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq-a">پاسخ</Label>
          <Textarea id="faq-a" rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>
        <Button
          className="rounded-xl"
          disabled={!question.trim() || add.isPending}
          onClick={() => add.mutate()}
        >
          <Plus className="size-4" />
          افزودن
        </Button>
      </div>

      <div className="space-y-3">
        {(data ?? []).map((f) => (
          <div key={f.id} className="surface-card flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary-deep">{f.question}</p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{f.answer}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="حذف پرسش"
              className="min-h-11 min-w-11 shrink-0 text-destructive"
              onClick={() => remove.mutate(f.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
