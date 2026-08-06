-- 1) Site settings for the single course
INSERT INTO public.site_settings (key, value) VALUES
('site_name','رودا'),
('site_tagline','دایرکتوری و سناریو'),
('hero_title','دوره آموزشی دایرکتوری؛ از پاسخگویی حرفه‌ای تا فروش در دایرکت'),
('hero_subtitle','تنها محصول رودا؛ یک دوره کامل و کاربردی برای تبدیل‌شدن به دایرکتور حرفه‌ای.'),
('product_title','دوره آموزشی دایرکتوری'),
('product_subtitle','از پاسخگویی حرفه‌ای تا فروش در دایرکت'),
('product_description','در این دوره یاد می‌گیرید چطور دایرکت پیج را حرفه‌ای مدیریت کنید، تیپ شخصیتی مشتری را بشناسید، مکالمه را هدایت کنید و مخاطب را به خریدار تبدیل کنید. آموزش کاملاً کاربردی، همراه با نمونه مکالمه، چک‌لیست و تمرین.'),
('product_modules','🟣 آشنایی با دایرکتوری
🟤 تیپ‌های شخصیتی مشتری‌ها
🟢 مراحل دایرکتوری (بخش اول)
🟠 مراحل دایرکتوری (بخش دوم)
🔵 مهارت‌های ارتباطی و فروش
🔴 مسیر تبدیل شدن به یک دایرکتور حرفه‌ای'),
('product_content','آموزش صوتی (حدود ۱۴ تا ۱۵ ساعت)
جزوه آموزشی PDF (حدود ۱۵۰ صفحه)
نمونه مثال‌ها و مکالمه‌های آموزشی
چک‌لیست‌های کاربردی
تمرین پایان هر درس
۳۰ تا ۵۰ نمونه مکالمه آماده'),
('product_after_sales','آپدیت رایگان دوره
یک سال پشتیبانی رایگان'),
('product_audience','ادمین‌های پاسخگویی
صاحبان پیج اینستاگرام
فروشندگان آنلاین
علاقه‌مندان ورود به شغل دایرکتوری
علاقه‌مندان فروش حرفه‌ای در دایرکت
افراد دارای فن بیان مناسب'),
('product_benefits','آموزش کاملاً کاربردی و پروژه‌محور
مناسب شروع از صفر، بدون پیش‌نیاز فنی
نمونه مکالمه‌های واقعی و آماده
یک سال پشتیبانی و آپدیت رایگان'),
('product_outcomes','مدیریت حرفه‌ای دایرکت و پاسخگویی سریع
شناخت تیپ شخصیتی مشتری و هدایت مکالمه
تبدیل مخاطب به خریدار و افزایش فروش
ورود به بازار کار دایرکتوری با مهارت واقعی'),
('cta_primary_label','ثبت‌نام در دوره'),
('cta_secondary_label','جزئیات دوره'),
('about_text','رودا یک برند آموزشی مدرن است که روی آموزش تخصصی دایرکتوری و پاسخگویی حرفه‌ای تمرکز دارد.'),
('footer_note','رودا؛ جایی که دایرکت به فروش تبدیل می‌شود.'),
('rubika_url',''),
('seo_title','رودا | دوره آموزشی دایرکتوری و پاسخگویی حرفه‌ای'),
('seo_description','دوره آموزشی دایرکتوری رودا؛ آموزش پاسخگویی حرفه‌ای، روانشناسی مشتری و فروش در دایرکت به‌همراه نمونه مکالمه، چک‌لیست و پشتیبانی یک‌ساله.'),
('seo_keywords','دایرکتوری, ادمین اینستاگرام, فروش در دایرکت, پاسخگویی به مشتری, آموزش ادمینی'),
('seo_og_image',''),
('support_intro','سلام! تیم پشتیبانی رودا آماده پاسخگویی است.'),
('product_image_url','/__l5e/assets-v1/8e84f219-1c02-44e7-aa34-5ab8df6fda19/roda-course.jpg')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 2) FAQ
DELETE FROM public.faq;
INSERT INTO public.faq (question, answer, sort_order) VALUES
('دوره برای چه کسانی مناسب است؟','ادمین‌های پاسخگویی، صاحبان پیج اینستاگرام، فروشندگان آنلاین و هر کسی که می‌خواهد در دایرکت حرفه‌ای بفروشد.',1),
('محتوای دوره چگونه ارائه می‌شود؟','آموزش صوتی حدود ۱۴ تا ۱۵ ساعت به‌همراه جزوه PDF حدود ۱۵۰ صفحه، چک‌لیست و تمرین.',2),
('آیا پشتیبانی دارد؟','بله، یک سال پشتیبانی رایگان و آپدیت رایگان دوره ارائه می‌شود.',3),
('پیش‌نیاز فنی لازم است؟','خیر، دوره از صفر شروع می‌شود و نیاز به دانش فنی خاصی ندارد.',4),
('بعد از خرید چطور به دوره دسترسی دارم؟','پس از ثبت‌نام لینک دسترسی برای شما ارسال می‌شود و دسترسی دائمی خواهید داشت.',5);

-- 3) Articles (8)
DELETE FROM public.articles;
INSERT INTO public.articles (slug, title, summary, category, content) VALUES
('directory-basics','دایرکتوری چیست و چرا مهم است؟','آشنایی با شغل دایرکتوری، وظایف یک دایرکتور حرفه‌ای و نقش آن در فروش کسب‌وکارهای اینستاگرامی.','دایرکتوری','<h2>دایرکتوری یعنی چه؟</h2><p>دایرکتوری یعنی مدیریت حرفه‌ای گفتگوهای دایرکت؛ از خوش‌آمدگویی تا بستن فروش. دایرکتور کسی است که مکالمه را هدایت می‌کند و مخاطب را به خریدار تبدیل می‌کند.</p><h3>وظایف اصلی</h3><ul><li>پاسخگویی سریع و منظم</li><li>شناخت نیاز مشتری</li><li>ارائه پیشنهاد درست در زمان درست</li></ul><p>در دوره آموزشی دایرکتوری رودا این مهارت‌ها گام‌به‌گام آموزش داده می‌شود.</p>'),
('direct-sales-scripts','۷ اصل فروش حرفه‌ای در دایرکت','اصولی که نرخ تبدیل گفتگوهای دایرکت شما را چند برابر می‌کند.','فروش','<h2>فروش در دایرکت یک مهارت است</h2><p>فروش در دایرکت با فروش حضوری فرق دارد؛ لحن، سرعت پاسخ و ساختار پیام تعیین‌کننده‌اند.</p><h3>اصول کلیدی</h3><ul><li>پاسخ در کمترین زمان</li><li>پرسیدن سؤال به‌جای توضیح طولانی</li><li>ارائه قیمت همراه با ارزش</li><li>پیگیری منظم</li></ul>'),
('customer-psychology','روانشناسی مشتری در دایرکت','چطور تیپ شخصیتی مخاطب را تشخیص دهیم و متناسب با آن پاسخ بدهیم.','ارتباط با مشتری','<h2>هر مشتری یک تیپ دارد</h2><p>برخی مشتری‌ها تحلیل‌گرند و جزئیات می‌خواهند، برخی سریع تصمیم می‌گیرند. شناخت این تیپ‌ها مسیر مکالمه را مشخص می‌کند.</p><h3>چهار تیپ رایج</h3><ul><li>تحلیل‌گر</li><li>تصمیم‌گیر سریع</li><li>مردد</li><li>قیمت‌محور</li></ul>'),
('communication-skills','مهارت‌های ارتباطی که هر ادمین باید بلد باشد','فن بیان نوشتاری، همدلی و مدیریت اعتراض در گفتگوی دایرکت.','ارتباط با مشتری','<h2>ارتباط مؤثر، پایه فروش</h2><p>لحن محترمانه و شفاف، اعتماد می‌سازد. همدلی کوتاه پیش از ارائه راه‌حل، اثر زیادی روی نتیجه دارد.</p><h3>تمرین پیشنهادی</h3><p>هر روز پنج پاسخ آماده بنویسید و آن‌ها را بازنویسی کنید تا کوتاه‌تر و روشن‌تر شوند.</p>'),
('instagram-admin-guide','راهنمای کامل ادمینی اینستاگرام','از تنظیم پاسخ‌های آماده تا برنامه‌ریزی محتوا و گزارش‌گیری.','ادمینی','<h2>ادمین حرفه‌ای چه می‌کند؟</h2><p>ادمین حرفه‌ای فقط پاسخ نمی‌دهد؛ نظم می‌سازد. پاسخ‌های آماده، تقویم محتوا و گزارش هفتگی سه ابزار اصلی اوست.</p><h3>ابزارها</h3><ul><li>پاسخ سریع اینستاگرام</li><li>چک‌لیست روزانه</li><li>گزارش نرخ پاسخ</li></ul>'),
('customer-support-playbook','پاسخگویی به مشتری؛ چک‌لیست عملی','ساختاری ساده برای پاسخگویی سریع، مؤدبانه و فروش‌محور.','ادمینی','<h2>ساختار یک پاسخ خوب</h2><ul><li>سلام و نام مشتری</li><li>تأیید درخواست</li><li>پاسخ روشن</li><li>یک سؤال برای ادامه گفتگو</li></ul><p>این ساختار ساده، نرخ ادامه مکالمه را به‌شکل محسوسی بالا می‌برد.</p>'),
('increase-sales','چطور فروش پیج را بدون تبلیغات بیشتر کنیم؟','بهینه‌سازی مسیر مخاطب از پست تا دایرکت و بستن فروش.','فروش','<h2>فروش بیشتر با همان مخاطب</h2><p>پیش از بودجه تبلیغات، مسیر فعلی را بهینه کنید: کال‌تواکشن روشن، پاسخ سریع و پیشنهاد شفاف.</p><h3>سه اقدام سریع</h3><ul><li>زمان پاسخ را زیر ۱۰ دقیقه برسانید</li><li>یک پیشنهاد ویژه ثابت داشته باشید</li><li>گفتگوهای بی‌پاسخ را پیگیری کنید</li></ul>'),
('lead-to-buyer','تبدیل مخاطب به خریدار در ۵ گام','مسیر عملی هدایت یک گفتگوی ساده تا خرید نهایی.','مدیریت','<h2>پنج گام تبدیل</h2><ol><li>شناخت نیاز</li><li>ایجاد اعتماد</li><li>ارائه راه‌حل</li><li>پاسخ به اعتراض</li><li>بستن فروش</li></ol><p>هر گام تمرین و نمونه مکالمه مخصوص خود را دارد که در دوره ارائه شده است.</p>');

-- 4) Support chat
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  from_admin boolean NOT NULL DEFAULT false,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own support messages" ON public.support_messages
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "users send own support messages" ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND from_admin = false
    AND char_length(body) BETWEEN 1 AND 2000
  );

CREATE POLICY "admins send support replies" ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND char_length(body) BETWEEN 1 AND 2000);

CREATE POLICY "admins update support messages" ON public.support_messages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete support messages" ON public.support_messages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX support_messages_user_created_idx ON public.support_messages (user_id, created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;