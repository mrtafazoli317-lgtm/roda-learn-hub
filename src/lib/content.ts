import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_url: string | null;
  category: string;
  content: string;
  published: boolean;
  created_at: string;
};

export type Package = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price: string;
  purchase_url: string | null;
  published: boolean;
  sort_order: number;
};

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  staleTime: 5 * 60 * 1000,
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<string, string>;
  },
});

export const articlesQuery = (limit?: number) =>
  queryOptions({
    queryKey: ["articles", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("id,slug,title,summary,cover_url,category,created_at,published")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });

export const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as Article | null;
    },
  });

export const packagesQuery = (limit?: number) =>
  queryOptions({
    queryKey: ["packages", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("packages")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Package[];
    },
  });

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(iso));
  } catch {
    return "";
  }
}
