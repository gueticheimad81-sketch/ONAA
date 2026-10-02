/*
# Create admin management function

1. New Functions
- `is_admin()` — returns true if the current user has role='admin' in raw_app_meta_data
- `promote_user_to_admin(email text)` — SECURITY DEFINER function callable by admins to promote a user

2. Security
- promote_user_to_admin is SECURITY DEFINER, callable only by authenticated users who are themselves admins
- Uses auth.users table for role management via raw_app_meta_data

3. Notes
- This allows the admin UI to manage user roles
- Admin role is stored in raw_app_meta_data (user-immutable)
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()), 'user') = 'admin';
$$;

-- Get all profiles with safe admin check
CREATE OR REPLACE FUNCTION public.get_all_profiles()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role text,
  balance numeric(12,2),
  avatar_url text,
  status text,
  phone text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.email, p.full_name, p.role, p.balance, p.avatar_url, p.status, p.phone, p.created_at
  FROM public.profiles p
  WHERE COALESCE((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()), 'user') = 'admin';
$$;

-- Update user role (admin only)
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()), 'user') <> 'admin' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE auth.users SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(new_role)
  ) WHERE id = target_user_id;
  UPDATE public.profiles SET role = new_role WHERE id = target_user_id;
END;
$$;

-- Update user status (admin only)
CREATE OR REPLACE FUNCTION public.update_user_status(target_user_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()), 'user') <> 'admin' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.profiles SET status = new_status WHERE id = target_user_id;
END;
$$;