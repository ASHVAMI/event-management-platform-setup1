import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { addSampleEvents } from '../lib/sampleEvents';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_EMAIL = 'guest@eventhub.demo';
const GUEST_PASSWORD = 'guestpass123!';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Add sample events for new users
    if (data.user) {
      try {
        await addSampleEvents(data.user.id);
        toast.success('Sample events added to your account');
      } catch (error) {
        console.error('Error adding sample events:', error);
        // Don't throw here, as the user is still created successfully
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const createGuestAccountIfNeeded = async () => {
    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    });

    // If sign in fails, create the guest account
    if (signInError) {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      });

      if (signUpError) throw signUpError;

      // Add sample events for the new guest account
      if (data.user) {
        try {
          await addSampleEvents(data.user.id);
        } catch (error) {
          console.error('Error adding sample events for guest:', error);
        }
      }

      // Sign in with the newly created account
      const { error: finalSignInError } = await supabase.auth.signInWithPassword({
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      });

      if (finalSignInError) throw finalSignInError;
    }
  };

  const signInAsGuest = async () => {
    try {
      await createGuestAccountIfNeeded();
      toast.success('Signed in as guest');
    } catch (error) {
      console.error('Error signing in as guest:', error);
      toast.error('Failed to sign in as guest. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}