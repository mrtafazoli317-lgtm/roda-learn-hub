import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/content";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export function MessagesManager() {
  const { data } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-primary-deep">پیام‌های دریافتی</h2>
      {(data ?? []).map((m) => (
        <div key={m.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-primary-deep">{m.name}</p>
            <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
          </div>
          <p dir="ltr" className="mt-1 text-start text-xs text-muted-foreground">
            {m.email}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground">{m.message}</p>
        </div>
      ))}
      {(data?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">پیامی دریافت نشده است.</p>
      )}
    </div>
  );
}
