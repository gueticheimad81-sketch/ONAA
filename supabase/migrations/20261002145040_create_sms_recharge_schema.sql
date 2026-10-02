/*
# SMS & Recharge Dashboard Schema

1. New Tables
- `profiles` — extends auth.users with role (admin/user), full_name, balance, avatar, status, created_at
- `sms_messages` — incoming SMS records: phone, message body, sender, received_at, status
- `operations` — recharge/transfer operations: type, amount, phone, status (successful/pending/failed), user_id, created_at
- `cards` — recharge cards: card_number, balance, status, user_id, created_at

2. Security
- RLS enabled on all tables
- Profiles: users can read/update their own; admins can read/update all
- SMS messages: users read their own + admins read all
- Operations: users read their own + admins read all
- Cards: users read their own + admins read all
- Role determined by raw_app_meta_data->>'role'

3. Notes
- Uses auth.uid() for ownership checks
- Admin checks use raw_app_meta_data->>'role' = 'admin'
- All owner columns default to auth.uid()
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  balance numeric(12,2) NOT NULL DEFAULT 0.00,
  avatar_url text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE
TO authenticated USING ((SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

-- SMS Messages table
CREATE TABLE IF NOT EXISTS sms_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  sender text NOT NULL DEFAULT '',
  message_body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'unread',
  received_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sms_select" ON sms_messages;
CREATE POLICY "sms_select" ON sms_messages FOR SELECT
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "sms_insert" ON sms_messages;
CREATE POLICY "sms_insert" ON sms_messages FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "sms_update" ON sms_messages;
CREATE POLICY "sms_update" ON sms_messages FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "sms_delete" ON sms_messages;
CREATE POLICY "sms_delete" ON sms_messages FOR DELETE
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

-- Operations table
CREATE TABLE IF NOT EXISTS operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'recharge',
  amount numeric(12,2) NOT NULL DEFAULT 0.00,
  phone text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  reference text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ops_select" ON operations;
CREATE POLICY "ops_select" ON operations FOR SELECT
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "ops_insert" ON operations;
CREATE POLICY "ops_insert" ON operations FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "ops_update" ON operations;
CREATE POLICY "ops_update" ON operations FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "ops_delete" ON operations;
CREATE POLICY "ops_delete" ON operations FOR DELETE
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number text NOT NULL,
  holder_name text NOT NULL DEFAULT '',
  balance numeric(12,2) NOT NULL DEFAULT 0.00,
  status text NOT NULL DEFAULT 'active',
  expiry_date text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cards_select" ON cards;
CREATE POLICY "cards_select" ON cards FOR SELECT
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "cards_insert" ON cards;
CREATE POLICY "cards_insert" ON cards FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "cards_update" ON cards;
CREATE POLICY "cards_update" ON cards FOR UPDATE
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin')
WITH CHECK (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "cards_delete" ON cards;
CREATE POLICY "cards_delete" ON cards FOR DELETE
TO authenticated USING (auth.uid() = user_id OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sms_messages_user_id ON sms_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_received_at ON sms_messages(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_operations_user_id ON operations(user_id);
CREATE INDEX IF NOT EXISTS idx_operations_created_at ON operations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, balance, status)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'user', 0.00, 'active');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();