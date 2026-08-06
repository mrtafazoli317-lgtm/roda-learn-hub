import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = {
  id: string;
  user_id: string;
  body: string;
  from_admin: boolean;
  resolved: boolean;
  created_at: string;
};

export function ChatManager() {
  const qc = useQueryClient();
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");

  const { data: messages } = useQuery({
    queryKey: ["admin", "support"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select("id,user_id,body,from_admin,resolved,created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Msg[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-support")
      .on("postgres_changes", { event: "*", schema: "public", table: "support_messages" }, () => {
        qc.invalidateQueries({ queryKey: ["admin", "support"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  const threads = useMemo(() => {
    const map = new Map<string, Msg[]>();
    (messages ?? []).forEach((m) => {
      map.set(m.user_id, [...(map.get(m.user_id) ?? []), m]);
    });
    return [...map.entries()].filter(([id, list]) =>
      search ? list.some((m) => m.body.includes(search)) || id.includes(search) : true,
    );
  }, [messages, search]);

  const current = activeUser ? (messages ?? []).filter((m) => m.user_id === activeUser) : [];

  const send = async () => {
    const body = reply.trim();
    if (!body || !activeUser) return;
    const { error } = await supabase
      .from("support_messages")
      .insert({ user_id: activeUser, body, from_admin: true });
    if (error) toast.error("ارسال ناموفق بود");
    else setReply("");
  };

  const toggleResolved = async (resolved: boolean) => {
    if (!activeUser) return;
    const { error } = await supabase
      .from("support_messages")
      .update({ resolved })
      .eq("user_id", activeUser);
    if (error) toast.error("تغییر وضعیت ناموفق بود");
    else toast.success(resolved ? "گفتگو حل‌شده شد" : "گفتگو باز شد");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="surface-card space-y-3 p-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در پیام‌ها"
          aria-label="جستجو در پیام‌ها"
        />
        <div className="space-y-2">
          {threads.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">گفتگویی وجود ندارد.</p>
          )}
          {threads.map(([id, list]) => {
            const last = list[list.length - 1];
            const open = list.some((m) => !m.resolved);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveUser(id)}
                className={`w-full rounded-xl border p-3 text-start text-xs transition-colors ${
                  activeUser === id ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-bold text-primary-deep">{id.slice(0, 8)}…</span>
                  <span className={open ? "text-primary" : "text-muted-foreground"}>
                    {open ? "باز" : "حل‌شده"}
                  </span>
                </span>
                <span className="mt-1 block truncate text-muted-foreground">{last?.body}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="surface-card flex min-h-[24rem] flex-col p-4">
        {!activeUser ? (
          <p className="m-auto text-sm text-muted-foreground">یک گفتگو را انتخاب کنید.</p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-primary-deep">گفتگو با کاربر {activeUser.slice(0, 8)}…</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toggleResolved(true)}>
                  حل شد
                </Button>
                <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => toggleResolved(false)}>
                  بازگشایی
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {current.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-6 ${
                    m.from_admin ? "ms-auto bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {m.body}
                </div>
              ))}
            </div>

            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="پاسخ شما…"
                aria-label="متن پاسخ"
              />
              <Button type="submit" className="brand-button rounded-xl" disabled={!reply.trim()}>
                ارسال
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
