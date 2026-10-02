import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  balance: number;
  avatar_url: string;
  status: 'active' | 'suspended';
  phone: string;
  created_at: string;
};

export type SmsMessage = {
  id: string;
  user_id: string | null;
  phone: string;
  sender: string;
  message_body: string;
  status: 'unread' | 'read';
  received_at: string;
  created_at: string;
};

export type Operation = {
  id: string;
  user_id: string | null;
  type: 'recharge' | 'transfer' | 'withdrawal';
  amount: number;
  phone: string;
  status: 'successful' | 'pending' | 'failed';
  reference: string;
  created_at: string;
};

export type Card = {
  id: string;
  user_id: string | null;
  card_number: string;
  holder_name: string;
  balance: number;
  status: 'active' | 'blocked';
  expiry_date: string;
  created_at: string;
};
