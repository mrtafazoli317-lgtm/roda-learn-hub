import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { settingsQuery } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { id: string; body: string; from_admin: boolean; created_at: string };

export function SupportChat() {
  const { user } = useAuth();
  const { data: settings } = useQuery(settingsQuery);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const userId = user?.id;

  useEffect(() => {
    if (!open || !userId) return;
    let active = true;

    supabase
      .from("support_messages")
      .select("id,body,from_admin,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (active) setMessages((data ?? []) as Msg[]);
      });

    const channel = supabase
      .channel(`support-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages", filter: `user_id=eq.${userId}` },
        (payload) => setMessages((m) => [...m, payload.new as Msg]),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [open, userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  const send = async () => {
    const body = text.trim();
    if (!body || !userId) return;
    setSending(true);
    const { error } = await supabase
      .from("support_messages")
      .insert({ user_id: userId, body, from_admin: false });
    setSending(false);
    if (!error) setText("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "بستن پشتیبانی" : "گفتگو با پشتیبانی"}
        className="brand-button fixed bottom-5 left-5 z-50 grid size-14 place-items-center rounded-full shadow-lg"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-5 z-50 flex max-h-[70vh] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="border-b border-border bg-primary-soft px-4 py-3">
            <p className="text-sm font-bold text-primary-deep">پشتیبانی رودا</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {settings?.["support_intro"] || "سلام! آماده پاسخگویی هستیم."}
            </p>
          </div>

          {!user ? (
            <div className="p-5 text-center">
              <p className="text-sm text-muted-foreground">
                برای گفتگو با پشتیبانی ابتدا وارد حساب خود شوید.
              </p>
              <Button asChild className="brand-button mt-4 rounded-xl" onClick={() => setOpen(false)}>
                <Link to="/auth">ورود / ثبت‌نام</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {messages.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    اولین پیام خود را بنویسید.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-6 ${
                      m.from_admin
                        ? "bg-muted text-foreground"
                        : "ms-auto bg-primary text-primary-foreground"
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form
                className="flex items-center gap-2 border-t border-border p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="پیام شما…"
                  aria-label="متن پیام"
                  className="h-11"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label="ارسال پیام"
                  disabled={sending || !text.trim()}
                  className="brand-button size-11 shrink-0 rounded-xl"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
