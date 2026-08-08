import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { PackagesManager } from "@/components/admin/PackagesManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { FaqManager } from "@/components/admin/FaqManager";
import { ChatManager } from "@/components/admin/ChatManager";
import { MediaManager } from "@/components/admin/MediaManager";
import { SystemInfo } from "@/components/admin/SystemInfo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت | رودا" },
      { name: "description", content: "مدیریت مقالات، پکیج‌ها و محتوای سایت رودا." },
      { property: "og:title", content: "پنل مدیریت | رودا" },
      { property: "og:description", content: "مدیریت محتوای سایت رودا." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) return null;

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="text-xl font-bold text-primary-deep">دسترسی مجاز نیست</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          این بخش تنها برای مدیران سایت در دسترس است.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">پنل مدیریت رودا</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        مقالات، پکیج‌ها، محتوای صفحات و لوگوی سایت را از اینجا مدیریت کنید.
      </p>

      <Tabs defaultValue="articles" className="mt-8">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="articles">مقالات</TabsTrigger>
          <TabsTrigger value="packages">پکیج‌ها</TabsTrigger>
          <TabsTrigger value="settings">محتوای سایت</TabsTrigger>
          <TabsTrigger value="faq">پرسش‌ها</TabsTrigger>
          <TabsTrigger value="messages">پیام‌ها</TabsTrigger>
          <TabsTrigger value="chat">پشتیبانی</TabsTrigger>
          <TabsTrigger value="media">رسانه</TabsTrigger>
          <TabsTrigger value="system">اطلاعات سیستم</TabsTrigger>
        </TabsList>
        <TabsContent value="articles" className="mt-6">
          <ArticlesManager />
        </TabsContent>
        <TabsContent value="packages" className="mt-6">
          <PackagesManager />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsManager />
        </TabsContent>
        <TabsContent value="faq" className="mt-6">
          <FaqManager />
        </TabsContent>
        <TabsContent value="messages" className="mt-6">
          <MessagesManager />
        </TabsContent>
        <TabsContent value="chat" className="mt-6">
          <ChatManager />
        </TabsContent>
        <TabsContent value="media" className="mt-6">
          <MediaManager />
        </TabsContent>
        <TabsContent value="system" className="mt-6">
          <SystemInfo />
        </TabsContent>
      </Tabs>
    </section>
  );
}
