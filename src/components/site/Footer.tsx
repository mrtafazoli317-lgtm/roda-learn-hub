import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Mail } from "lucide-react";
import { settingsQuery } from "@/lib/content";
import { SocialIcons } from "@/components/site/SocialLinks";
import rodaLogo from "@/assets/roda-logo.png.asset.json";

export function Footer() {
  const { data: settings } = useQuery(settingsQuery);

  const address =
    settings?.["contact_address"] ||
    "فارس، شیراز، بخش مرکزی، محله سردخانه، کوچه ۱۷ نیرو، کوچه ۱ فرصت شیرازی، آراد، پلاک ۲۰، طبقه ۲، واحد ۹";
  const postalCode = settings?.["contact_postal_code"] || "۷۱۵۷۸۱۱۴۸۱";
  const phone = settings?.["contact_phone"] || "۰۷۱۳۷۲۰۹۲۱۵";
  const mobile = settings?.["contact_mobile"] || "۰۹۳۰۰۱۷۹۰۶۹";
  const email = settings?.["contact_email"] || "roda.directory@gmail.com";

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
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

          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noopener noreferrer"
            href="https://trustseal.enamad.ir/?id=7353195&Code=TiuGteVQ1ZURhfBznQyLvuiFZ6KJsMDT"
            className="mt-5 inline-block"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=7353195&Code=TiuGteVQ1ZURhfBznQyLvuiFZ6KJsMDT"
              alt="نماد اعتماد الکترونیکی"
              style={{ cursor: "pointer" }}
            />
          </a>
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

        <div>
          <p className="mb-3 text-sm font-bold text-primary-deep">نشانی و تماس</p>
          <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>
                {address}
                <span className="mt-1 block text-xs">کدپستی: {postalCode}</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${phone}`} className="hover:text-primary" dir="ltr">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${mobile}`} className="hover:text-primary" dir="ltr">
                {mobile}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${email}`} className="hover:text-primary" dir="ltr">
                {email}
              </a>
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
