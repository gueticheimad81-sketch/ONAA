import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type Profile } from './supabase';

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile — retries handle the trigger race after signup where the
  // profile row may not be committed yet when the query runs.
  const fetchProfile = async (uid: string): Promise<Profile | null> => {
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();
      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      if (data) return data as Profile;
      if (attempt < 4) await new Promise((r) => setTimeout(r, 400));
    }
    return null;
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      const p = await fetchProfile(session.user.id);
      setProfile(p);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        setLoading(true);
        (async () => {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    if (data.session && data.user) {
      // Set the session immediately so subsequent queries carry the auth token
      await supabase.auth.setSession(data.session);
      setSession(data.session);
      setLoading(true);
      const p = await fetchProfile(data.user.id);
      if (p) {
        setProfile(p);
        setLoading(false);
      } else {
        setLoading(false);
        return { error: 'Account exists but profile could not be loaded. Please try again.' };
      }
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign-up failed. Please try again.' };

    // Sign in immediately after signup
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return { error: signInError.message };

    if (signInData.session && signInData.user) {
      await supabase.auth.setSession(signInData.session);
      setSession(signInData.session);
      setLoading(true);
      // The trigger may need a moment to create the profile row — retry loop handles this
      const p = await fetchProfile(signInData.user.id);
      if (p) {
        setProfile(p);
        setLoading(false);
      } else {
        setLoading(false);
        return { error: 'Account created but profile could not be loaded. Please sign in again.' };
      }
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
