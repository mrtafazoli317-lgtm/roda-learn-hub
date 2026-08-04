import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-primary-deep">رودا</p>
          <p className="mt-1 text-sm text-muted-foreground">دایرکتوری و سناریو</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
            برند آموزشی رودا؛ آموزش مهارت‌های اداری، دیجیتال و مدیریت محتوا به زبان ساده و کاربردی.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-primary-deep">بخش‌ها</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/packages" className="hover:text-primary">
                پکیج‌های آموزشی
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
          <ul className="space-y-2 text-sm text-muted-foreground">
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
