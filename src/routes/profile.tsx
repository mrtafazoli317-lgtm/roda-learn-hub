import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "پروفایل کاربری | رودا" },
      { name: "description", content: "مدیریت اطلاعات حساب کاربری شما در رودا." },
      { property: "og:title", content: "پروفایل کاربری | رودا" },
      { property: "og:description", content: "حساب کاربری رودا." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setFullName(data?.full_name ?? (user.user_metadata?.["full_name"] as string) ?? "");
      });
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fullName.trim().slice(0, 100) });
    setSaving(false);
    if (error) {
      toast.error("ذخیره نشد");
      return;
    }
    toast.success("اطلاعات ذخیره شد");
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-primary-deep">پروفایل من</h1>
      <div className="surface-card mt-8 space-y-5 p-6">
        <div className="space-y-2">
          <Label>ایمیل</Label>
          <Input value={user.email ?? ""} dir="ltr" disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">نام و نام خانوادگی</Label>
          <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={save} disabled={saving} className="rounded-xl">
            {saving ? "..." : "ذخیره"}
          </Button>
          {isAdmin && (
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/admin">ورود به پنل مدیریت</Link>
            </Button>
          )}
          <Button variant="ghost" onClick={handleSignOut} className="rounded-xl">
            خروج از حساب
          </Button>
        </div>
      </div>
    </section>
  );
}
