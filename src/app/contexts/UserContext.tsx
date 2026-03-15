import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabase from '../../supabaseClient';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string;
  degree: string;
  field_of_study: string;
  xp: number;
  level: number;
  tasks_completed: number;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'email'>>) => Promise<void>;
  addXP: (xpGained: number) => Promise<{ newXp: number; newLevel: number }>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function calcLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function UserProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, email: string | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('fetchProfile error:', error);
      }

      if (data) {
        setProfile({ ...data, email });
      } else {
        // No profile row yet — build a local stub so UI works
        setProfile({
          id: userId,
          email,
          name: email?.split('@')[0] || 'Hunter',
          degree: '',
          field_of_study: '',
          xp: 0,
          level: 1,
          tasks_completed: 0,
        });
      }
    } catch (err) {
      console.error('fetchProfile exception:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchProfile(session.user.id, session.user.email ?? null);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [session, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    await fetchProfile(session.user.id, session.user.email ?? null);
  }, [session, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Omit<UserProfile, 'id' | 'email'>>) => {
    if (!profile) return;

    // Optimistic local update first (so UI reacts instantly)
    setProfile(prev => prev ? { ...prev, ...updates } : null);

    // Use UPSERT so it works even if the row doesn't exist yet
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        name: profile.name,
        degree: profile.degree,
        field_of_study: profile.field_of_study,
        xp: profile.xp,
        level: profile.level,
        tasks_completed: profile.tasks_completed ?? 0,
        ...updates,
      });

    if (error) {
      console.error('updateProfile error:', error);
      // Revert optimistic update on error
      await refreshProfile();
    }
  }, [profile, refreshProfile]);

  const addXP = useCallback(async (xpGained: number): Promise<{ newXp: number; newLevel: number }> => {
    if (!profile) return { newXp: 0, newLevel: 1 };

    const newXp = profile.xp + xpGained;
    const newLevel = calcLevel(newXp);
    const newTasksCompleted = (profile.tasks_completed ?? 0) + 1;

    await updateProfile({ xp: newXp, level: newLevel, tasks_completed: newTasksCompleted });

    return { newXp, newLevel };
  }, [profile, updateProfile]);

  return (
    <UserContext.Provider value={{ user: session?.user ?? null, profile, loading, updateProfile, addXP, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}