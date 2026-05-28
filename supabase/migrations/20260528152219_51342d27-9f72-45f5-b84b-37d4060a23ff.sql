
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop policy if exists "Posters publicly readable" on storage.objects;
-- Public bucket → direct GET via public URL works without an objects SELECT policy.
-- We intentionally skip a broad SELECT policy to prevent file listing.
