import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "نام را وارد کنید").max(100, "نام طولانی است"),
  email: z.string().trim().email("ایمیل معتبر نیست").max(255),
  message: z.string().trim().min(1, "متن پیام را بنویسید").max(2000, "متن پیام طولانی است"),
});

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSending(false);
    if (error) {
      toast.error("ارسال پیام ناموفق بود، دوباره تلاش کنید");
      return;
    }
    toast.success("پیام شما ارسال شد");
    setValues({ name: "", email: "", message: "" });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">نام و نام خانوادگی</Label>
          <Input
            id="name"
            value={values.name}
            maxLength={100}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="نام شما"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            value={values.email}
            maxLength={255}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">پیام</Label>
        <Textarea
          id="message"
          rows={5}
          maxLength={2000}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          placeholder="متن پیام شما..."
        />
      </div>
      <Button type="submit" disabled={sending} className="w-full rounded-xl sm:w-auto">
        {sending ? "در حال ارسال..." : "ارسال پیام"}
      </Button>
    </form>
  );
}
