import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TABLES = ["site_settings", "articles", "packages", "faq"] as const;

const KEY_MAP: Record<string, string> = {
  site_settings: "site_settings",
  articles: "articles",
  packages: "packages",
  faq: "faq",
};

/**
 * Subscribes once to CMS tables so published changes appear on the site instantly.
 */
export function useRealtimeCms() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel("cms-content");

    TABLES.forEach((table) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        queryClient.invalidateQueries({ queryKey: [KEY_MAP[table]] });
        if (table === "articles") queryClient.invalidateQueries({ queryKey: ["article"] });
      });
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
