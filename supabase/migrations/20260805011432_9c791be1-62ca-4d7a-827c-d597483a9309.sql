CREATE TABLE public.faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faq TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faq TO authenticated;
GRANT ALL ON public.faq TO service_role;

ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon read published faq" ON public.faq FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth read faq" ON public.faq FOR SELECT TO authenticated USING (published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins manage faq" ON public.faq FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER faq_updated BEFORE UPDATE ON public.faq FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.faq (question, answer, sort_order) VALUES
('دوره آموزش ادمینی برای چه کسانی مناسب است؟', 'برای هر کسی که می‌خواهد به‌عنوان ادمین شبکه‌های اجتماعی یا ادمین کسب‌وکار وارد بازار کار شود؛ حتی بدون تجربه قبلی.', 1),
('آیا دوره پیش‌نیاز دارد؟', 'خیر. آموزش از صفر شروع می‌شود و تنها به یک گوشی یا لپ‌تاپ و اینترنت نیاز دارید.', 2),
('دسترسی به دوره چقدر است؟', 'دسترسی دائمی است و به‌روزرسانی‌های بعدی هم رایگان در اختیار شما قرار می‌گیرد.', 3),
('بعد از خرید چطور پشتیبانی می‌شوم؟', 'از طریق تلگرام و فرم تماس سایت پاسخ سؤالات شما داده می‌شود.', 4);

INSERT INTO public.site_settings (key, value) VALUES
('site_name', 'رودا'),
('brand_title', 'رودا'),
('brand_subtitle', 'آموزش حرفه‌ای ادمینی'),
('hero_title', 'آموزش جامع ادمینی، از صفر تا درآمد'),
('hero_subtitle', 'تنها محصول رودا؛ یک دوره کامل و کاربردی برای تبدیل‌شدن به ادمین حرفه‌ای شبکه‌های اجتماعی و کسب‌وکارها.'),
('product_title', 'دوره جامع آموزش ادمینی'),
('product_subtitle', 'مهارت‌های واقعی بازار کار، بدون حاشیه'),
('product_description', 'در این دوره از پایه یاد می‌گیرید که چطور صفحه‌ها و کسب‌وکارها را مدیریت کنید، محتوا بسازید، با مشتری ارتباط بگیرید و از مهارت ادمینی درآمد بسازید.'),
('product_price', '۱٬۹۰۰٬۰۰۰ تومان'),
('product_old_price', ''),
('product_purchase_url', ''),
('product_image_url', ''),
('product_benefits', E'ورود سریع به بازار کار ادمینی\nآموزش کاملاً پروژه‌محور و کاربردی\nدسترسی دائمی و به‌روزرسانی رایگان\nپشتیبانی مستقیم و پاسخ به سؤالات'),
('product_outcomes', E'مدیریت حرفه‌ای صفحات اینستاگرام و تلگرام\nتولید محتوای جذاب و تقویم محتوایی\nارتباط مؤثر با مشتری و پاسخ‌گویی\nقیمت‌گذاری خدمات و جذب کارفرما'),
('product_modules', E'آشنایی با شغل ادمینی و بازار کار\nاصول مدیریت صفحه و ابزارهای روزانه\nتولید محتوا و طراحی سریع\nکپشن‌نویسی و تقویم محتوا\nارتباط با مشتری و مدیریت پیام‌ها\nقیمت‌گذاری، رزومه و جذب کارفرما'),
('telegram_url', ''),
('instagram_url', ''),
('contact_email', ''),
('footer_note', 'برند آموزشی رودا؛ آموزش تخصصی ادمینی به زبان ساده و کاربردی.'),
('about_text', 'رودا یک برند آموزشی مدرن است که روی یک هدف تمرکز دارد: تربیت ادمین‌های حرفه‌ای برای بازار کار امروز.')
ON CONFLICT (key) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faq;