import { useQuery } from "@tanstack/react-query";
import { Instagram, Mail, MessageCircle, Radio, Send } from "lucide-react";
import { settingsQuery } from "@/lib/content";

type Item = {
  key: string;
  label: string;
  handle: string;
  href: string;
  icon: typeof Send;
};

/** Builds the contact/social list purely from CMS settings (empty ones are hidden). */
export function useSocialLinks(): Item[] {
  const { data: s } = useQuery(settingsQuery);
  const get = (k: string) => (s?.[k] ?? "").trim();
  const handle = (k: string) => get(k).replace(/^@/, "");

  const items: Item[] = [];

  const tgUser = handle("telegram_username");
  const tgUrl = get("telegram_url") || (tgUser ? `https://t.me/${tgUser}` : "");
  if (tgUrl)
    items.push({
      key: "telegram",
      label: "تلگرام",
      handle: tgUser ? `@${tgUser}` : tgUrl,
      href: tgUrl,
      icon: Send,
    });

  const igUser = handle("instagram_username");
  const igUrl = get("instagram_url") || (igUser ? `https://instagram.com/${igUser}` : "");
  if (igUrl)
    items.push({
      key: "instagram",
      label: "اینستاگرام",
      handle: igUser ? `@${igUser}` : igUrl,
      href: igUrl,
      icon: Instagram,
    });

  const rbUser = handle("rubika_username");
  const rbUrl = get("rubika_url") || (rbUser ? `https://rubika.ir/${rbUser}` : "");
  if (rbUrl)
    items.push({
      key: "rubika",
      label: "روبیکا",
      handle: rbUser ? `@${rbUser}` : rbUrl,
      href: rbUrl,
      icon: MessageCircle,
    });

  const channel = get("rubika_channel_url");
  if (channel)
    items.push({
      key: "rubika-channel",
      label: "کانال روبیکا",
      handle: channel.replace(/^https?:\/\//, ""),
      href: channel,
      icon: Radio,
    });

  const email = get("contact_email");
  if (email)
    items.push({
      key: "email",
      label: "ایمیل",
      handle: email,
      href: `mailto:${email}`,
      icon: Mail,
    });

  return items;
}

/** Compact icon row (footer, mobile menu). */
export function SocialIcons({ className = "" }: { className?: string }) {
  const items = useSocialLinks();
  if (!items.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((i) => (
        <a
          key={i.key}
          href={i.href}
          target={i.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={`${i.label} رودا`}
          title={i.handle}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-deep transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <i.icon className="size-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

/** Detailed cards with handles (contact page). */
export function SocialCards() {
  const items = useSocialLinks();
  if (!items.length) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i.key}>
          <a
            href={i.href}
            target={i.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-deep">
              <i.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-primary-deep">{i.label}</span>
              <span dir="ltr" className="block truncate text-xs text-muted-foreground">
                {i.handle}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
