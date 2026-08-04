import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/ContactForm";

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
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-primary-deep sm:text-3xl">تماس با رودا</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        سؤال، پیشنهاد یا درخواست همکاری دارید؟ فرم زیر را تکمیل کنید.
      </p>
      <div className="surface-card mt-8 p-6 sm:p-8">
        <ContactForm />
      </div>
    </section>
  );
}
