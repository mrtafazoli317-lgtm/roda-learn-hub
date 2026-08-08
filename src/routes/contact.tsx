import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/ContactForm";
import { SocialCards } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس با رودا" },
      { name: "description", content: "ارسال پیام به تیم آموزشی رودا از طریق فرم تماس." },
      { property: "og:title", content: "تماس با رودا" },
      { property: "og:description", content: "فرم تماس با تیم آموزشی رودا." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">تماس با رودا</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        سؤال، پیشنهاد یا درخواست همکاری دارید؟ از راه‌های زیر با ما در ارتباط باشید.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="surface-card p-6 sm:p-7">
          <h2 className="mb-4 text-base font-black text-primary-deep">راه‌های ارتباطی</h2>
          <SocialCards />
        </div>
        <div className="surface-card p-6 sm:p-8">
          <h2 className="mb-4 text-base font-black text-primary-deep">ارسال پیام</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

