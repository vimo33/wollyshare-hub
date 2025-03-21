
-- Create a function to list invitations that bypasses RLS
CREATE OR REPLACE FUNCTION public.list_invitations()
RETURNS SETOF invitations
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Only return invitations if the user is an admin
  SELECT i.* FROM public.invitations i
  WHERE EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE admin_profiles.id = auth.uid()
  )
  ORDER BY i.created_at DESC;
$$;
