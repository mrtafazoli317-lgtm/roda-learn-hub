import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود و ثبت‌نام | رودا" },
      { name: "description", content: "ورود به حساب کاربری رودا یا ساخت حساب جدید." },
      { property: "og:title", content: "ورود و ثبت‌نام | رودا" },
      { property: "og:description", content: "دسترسی به حساب کاربری رودا." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const credsSchema = z.object({
  email: z.string().trim().email("ایمیل معتبر نیست").max(255),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باشد").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/profile", replace: true });
  }, [user, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error("ایمیل یا رمز عبور اشتباه است");
      return;
    }
    toast.success("خوش آمدید");
    navigate({ to: "/profile" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      ...parsed.data,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim().slice(0, 100) },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("ثبت‌نام انجام شد. لینک تأیید به ایمیل شما ارسال شد.");
      return;
    }
    toast.success("حساب شما ساخته شد");
    navigate({ to: "/profile" });
  }

  async function forgotPassword() {
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) {
      toast.error("ابتدا ایمیل خود را وارد کنید");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) toast.error("ارسال ایمیل بازیابی ناموفق بود");
    else toast.success("لینک بازیابی رمز عبور به ایمیل شما ارسال شد");
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-center text-2xl font-extrabold text-primary-deep">حساب کاربری رودا</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        برای دسترسی به پروفایل خود وارد شوید.
      </p>

      <div className="surface-card mt-8 p-6">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">ورود</TabsTrigger>
            <TabsTrigger value="signup">ثبت‌نام</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signIn} className="mt-5 space-y-4">
              <Field label="ایمیل" id="si-email" value={email} onChange={setEmail} type="email" />
              <Field
                label="رمز عبور"
                id="si-pass"
                value={password}
                onChange={setPassword}
                type="password"
              />
              <Button type="submit" disabled={busy} className="w-full rounded-xl">
                {busy ? "..." : "ورود"}
              </Button>
              <button
                type="button"
                onClick={forgotPassword}
                className="w-full text-center text-xs font-semibold text-primary hover:underline"
              >
                رمز عبور را فراموش کرده‌اید؟
              </button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="mt-5 space-y-4">
              <Field label="نام و نام خانوادگی" id="su-name" value={fullName} onChange={setFullName} />
              <Field label="ایمیل" id="su-email" value={email} onChange={setEmail} type="email" />
              <Field
                label="رمز عبور"
                id="su-pass"
                value={password}
                onChange={setPassword}
                type="password"
              />
              <Button type="submit" disabled={busy} className="w-full rounded-xl">
                {busy ? "..." : "ساخت حساب"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        dir={type === "text" ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
