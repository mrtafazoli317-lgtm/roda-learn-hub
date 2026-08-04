
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP POLICY "public read published articles" ON public.articles;
CREATE POLICY "anon read published articles" ON public.articles FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth read articles" ON public.articles FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(),'admin'));

DROP POLICY "public read published packages" ON public.packages;
CREATE POLICY "anon read published packages" ON public.packages FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth read packages" ON public.packages FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(),'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
