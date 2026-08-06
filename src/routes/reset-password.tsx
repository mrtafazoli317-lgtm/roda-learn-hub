import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "بازیابی رمز عبور | رودا" },
      { name: "description", content: "تعیین رمز عبور جدید برای حساب کاربری رودا." },
      { property: "og:title", content: "بازیابی رمز عبور | رودا" },
      { property: "og:description", content: "تعیین رمز عبور جدید حساب رودا." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("رمز عبور حداقل ۶ کاراکتر باشد");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("تغییر رمز عبور ناموفق بود. لینک بازیابی را دوباره درخواست کنید.");
      return;
    }
    toast.success("رمز عبور شما تغییر کرد");
    navigate({ to: "/profile", replace: true });
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-center text-2xl font-extrabold text-primary-deep">رمز عبور جدید</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        رمز عبور تازه‌ای برای حساب خود انتخاب کنید.
      </p>

      <form onSubmit={submit} className="surface-card mt-8 space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="new-pass">رمز عبور جدید</Label>
          <Input
            id="new-pass"
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full rounded-xl">
          {busy ? "..." : "ثبت رمز جدید"}
        </Button>
      </form>
    </section>
  );
}
