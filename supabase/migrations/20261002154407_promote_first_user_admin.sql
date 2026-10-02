/*
# Promote first user to admin

1. Changes
- Sets raw_app_meta_data role to 'admin' for the first registered user (imad gue)
- Updates the profiles table role to 'admin' for the same user
- This ensures the Users management page is accessible immediately

2. Security
- No policy changes — this is a one-time data fix for existing accounts
- Future admins are promoted through the admin UI via the update_user_role function
*/

UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE id = 'b01e4c5f-d7e7-4151-97ef-bea845d06150';

UPDATE public.profiles
SET role = 'admin'
WHERE id = 'b01e4c5f-d7e7-4151-97ef-bea845d06150';