/*
# Auto-promote first user to admin

1. Changes
- Updates handle_new_user() to check if the new user is the very first auth user
- If so, sets their role to 'admin' instead of 'user'
- Also sets raw_app_meta_data role to 'admin' for that first user
- Subsequent users remain 'user' role

2. Security
- No policy changes
- Only the very first user ever registered gets auto-admin
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT count(*) INTO user_count FROM auth.users;

  IF user_count = 1 THEN
    -- First user becomes admin
    INSERT INTO public.profiles (id, email, full_name, role, balance, status)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'admin', 0.00, 'active');

    -- Also set role in raw_app_meta_data
    NEW.raw_app_meta_data = jsonb_set(
      COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'::jsonb
    );
  ELSE
    INSERT INTO public.profiles (id, email, full_name, role, balance, status)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'user', 0.00, 'active');
  END IF;

  RETURN NEW;
END;
$$;