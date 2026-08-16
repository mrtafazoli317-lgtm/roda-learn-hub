import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/**
 * Generates a random unique id. `crypto.randomUUID()` only exists in
 * "secure contexts" (valid HTTPS) — on a domain with a broken/missing SSL
 * certificate the browser hides it entirely, which crashed uploads with
 * "crypto.randomUUID is not a function". This falls back to
 * `crypto.getRandomValues` (much more widely supported) and finally to
 * Math.random so uploads never depend on that one API being present.
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

/** Uploads an image to the media library and returns a long-lived URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("فقط فایل تصویری مجاز است");
  if (file.size > 5 * 1024 * 1024) throw new Error("حجم تصویر باید کمتر از ۵ مگابایت باشد");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${new Date().getFullYear()}/${generateId()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS);
  if (signErr || !data?.signedUrl) throw signErr ?? new Error("ساخت لینک تصویر ناموفق بود");

  return data.signedUrl;
}
