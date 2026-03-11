import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/supabase';
import { toast } from 'sonner';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('volthub_access_token');
      if (token) {
        const data = await api.getSession(token);
        if (data.user && data.session) {
          setUser(data.user);
          setSession(data.session);
        } else {
          // Clear invalid token
          localStorage.removeItem('volthub_access_token');
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('volthub_access_token');
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const data = await api.signin(email, password);
      setUser(data.user);
      setSession(data.session);
      
      // Store token in localStorage
      if (data.session?.access_token) {
        localStorage.setItem('volthub_access_token', data.session.access_token);
      }
      
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Create user account
      await api.signup(email, password, firstName, lastName);
      
      // Automatically sign in after signup
      await signin(email, password);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signout = async () => {
    try {
      const token = localStorage.getItem('volthub_access_token');
      if (token) {
        await api.signout(token);
      }
      
      setUser(null);
      setSession(null);
      localStorage.removeItem('volthub_access_token');
      
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Still clear local state even if server request fails
      setUser(null);
      setSession(null);
      localStorage.removeItem('volthub_access_token');
      toast.error('Signed out (with errors)');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await api.resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signin,
        signup,
        signout,
        resetPassword,
      }}
    >
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
