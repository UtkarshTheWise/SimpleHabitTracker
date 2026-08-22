import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const LOCAL_USER = { id: 'local-user', email: 'local@device', isLocal: true };

export function useAuth() {
  const [user, setUser] = useState(isSupabaseConfigured ? null : LOCAL_USER);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    if (!isSupabaseConfigured) return;
    supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = () => {
    if (!isSupabaseConfigured) return;
    supabase.auth.signOut();
  };

  return { user, loading, signInWithGoogle, signOut, isLocal: !isSupabaseConfigured };
}
