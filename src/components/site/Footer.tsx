import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/content";
import { SocialIcons } from "@/components/site/SocialLinks";
import rodaLogo from "@/assets/roda-logo.png.asset.json";

export function Footer() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={settings?.["logo_url"] || rodaLogo.url}
              alt="نشان رودا"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <p className="text-lg font-black text-primary-deep">
              {settings?.["site_name"] || "رودا"}
            </p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-8 text-muted-foreground">
            {settings?.["footer_note"] ||
              "برند آموزشی رودا؛ آموزش تخصصی ادمینی به زبان ساده و کاربردی."}
          </p>

          <SocialIcons className="mt-5" />
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-primary-deep">بخش‌ها</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/packages" className="hover:text-primary">
                دوره آموزشی
              </Link>
            </li>
            <li>
              <Link to="/articles" className="hover:text-primary">
                مقالات
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                درباره رودا
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                تماس با ما
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-primary-deep">قوانین</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/rules" className="hover:text-primary">
                قوانین و مقررات
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                حریم خصوصی
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} رودا — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
