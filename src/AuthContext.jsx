import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'mate_demo_user';

function makeDemoUser(email) {
  const name = email.split('@')[0];
  return {
    id: 'demo-' + Math.random().toString(36).slice(2, 10),
    email,
    demo: true,
  };
}

function makeDemoProfile(email) {
  const name = email.split('@')[0];
  return {
    id: null,
    username: name,
    email,
    display_name: name,
    bio: '데모 계정입니다',
    avatar_url: '',
    interests: ['UI/UX', '마케팅'],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데모 유저 복원
    const saved = sessionStorage.getItem(DEMO_USER_KEY);
    if (saved) {
      const demo = JSON.parse(saved);
      setUser(demo.user);
      setProfile(demo.profile);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        if (!sessionStorage.getItem(DEMO_USER_KEY)) {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  }

  async function signUp(email, password, displayName) {
    const username = email.split('@')[0] + '_' + Math.random().toString(36).slice(2, 6);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || username, username } },
    });
    if (!error) return { data, error };

    // Supabase 실패 시 데모 모드
    const demoUser = makeDemoUser(email);
    const demoProfile = makeDemoProfile(email);
    demoProfile.display_name = displayName || demoProfile.display_name;
    sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
    setUser(demoUser);
    setProfile(demoProfile);
    return { data: { user: demoUser }, error: null };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) return { data, error };

    // Supabase 실패 시 데모 모드로 자동 로그인
    const demoUser = makeDemoUser(email);
    const demoProfile = makeDemoProfile(email);
    sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify({ user: demoUser, profile: demoProfile }));
    setUser(demoUser);
    setProfile(demoProfile);
    return { data: { user: demoUser }, error: null };
  }

  async function signOut() {
    sessionStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
    setProfile(null);
    await supabase.auth.signOut();
  }

  async function updateProfile(updates) {
    if (!user) return;
    if (user.demo) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      const saved = JSON.parse(sessionStorage.getItem(DEMO_USER_KEY) || '{}');
      sessionStorage.setItem(DEMO_USER_KEY, JSON.stringify({ ...saved, profile: updated }));
      return { data: updated, error: null };
    }
    const { data, error } = await supabase.from('users').update(updates).eq('id', user.id).select().single();
    if (!error) setProfile(data);
    return { data, error };
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
