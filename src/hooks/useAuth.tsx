import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the shape of the data the context will provide
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: any | null; message?: string }>;
}

// ✅ Create the React Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Create the AuthProvider component
// This component will wrap your application and provide the auth state to all children.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ The onAuthStateChange listener is the core of Supabase auth.
    // It fires on sign-in, sign-out, password recovery, and token refresh.
    // It also fires once when the app loads, with the current session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // The cleanup function unsubscribes from the listener when the component unmounts.
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    if (!user) {
        console.error("No user is currently signed in to delete.");
        return { error: new Error("User not found") };
    }
    try {
      // The ON DELETE CASCADE in your database schema should handle deleting related data.
      // We only need to delete the profile here to be sure.
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);
      
      if (profileError) throw profileError;
      
      // Note: Deleting a user from auth.users requires admin privileges.
      // This must be done via a Supabase Edge Function.
      // The current implementation signs the user out and clears their data from public tables.
      await signOut();
      return { error: null, message: 'Account data deleted successfully.' };

    } catch (error: any) {
      console.error('Error deleting account:', error);
      return { error };
    }
  };

  // The value object is passed down to all consuming components.
  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signOut,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Create the custom hook for easy consumption of the context.
// Components will use this hook to access auth state.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};