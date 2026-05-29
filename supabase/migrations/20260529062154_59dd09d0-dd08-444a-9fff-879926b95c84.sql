-- Move has_role out of the API-exposed public schema so signed-in users
-- cannot call it directly via PostgREST, while keeping RLS policies working.

CREATE SCHEMA IF NOT EXISTS private;

-- Recreate policies to reference the new schema-qualified function.
DROP POLICY IF EXISTS "Admins update events" ON public.events;
DROP POLICY IF EXISTS "Anyone views approved events" ON public.events;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users view own rsvps or admins all" ON public.rsvps;

-- Move the function to the private schema.
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;

-- Lock down execute: only authenticated may call (needed for RLS evaluation),
-- and explicitly revoke from anon / public.
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO service_role;

-- Recreate policies using private.has_role.
CREATE POLICY "Admins update events"
ON public.events
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Anyone views approved events"
ON public.events
FOR SELECT
USING (
  (status = 'approved'::public.event_status)
  OR (auth.uid() = submitted_by)
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Users view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id)
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Users view own rsvps or admins all"
ON public.rsvps
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id)
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);
