import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  bio?: string;
  profilePicUrl?: string;
  emailVerified?: boolean;
  user_metadata?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

interface Account {
  user: User;
  session: { access_token: string };
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  accounts: Account[];
  activeUserId: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signout: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: { firstName?: string; lastName?: string; phone?: string; company?: string; bio?: string }) => Promise<void>;
  uploadProfileAvatar: (file: File) => Promise<void>;
  signinWithSession: (user: User, session: { access_token: string }) => void;
  switchAccount: (userId: string) => void;
  removeAccount: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const ACCOUNTS_KEY = 'volthub_accounts';
  const ACTIVE_USER_KEY = 'volthub_active_user_id';

  const persistAccounts = (nextAccounts: Account[], nextActiveUserId: string | null) => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
    if (nextActiveUserId) {
      localStorage.setItem(ACTIVE_USER_KEY, nextActiveUserId);
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  };

  const getActiveAccount = () => accounts.find((a) => a.user.id === activeUserId) ?? null;

  const activeAccount = getActiveAccount();
  const user = activeAccount?.user ?? null;
  const session = activeAccount?.session ?? null;

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
      const storedActiveUserId = localStorage.getItem(ACTIVE_USER_KEY);

      let parsedAccounts: Account[] = [];
      if (storedAccounts) {
        parsedAccounts = JSON.parse(storedAccounts);
      }

      let nextActiveUserId = storedActiveUserId;

      if (nextActiveUserId && parsedAccounts.length > 0) {
        const active = parsedAccounts.find((a) => a.user.id === nextActiveUserId);
        if (!active) {
          nextActiveUserId = parsedAccounts[0]?.user?.id ?? null;
        }
      } else if (parsedAccounts.length > 0) {
        nextActiveUserId = parsedAccounts[0].user.id;
      } else {
        nextActiveUserId = null;
      }

      setAccounts(parsedAccounts);
      setActiveUserId(nextActiveUserId);

      if (nextActiveUserId) {
        const active = parsedAccounts.find((a) => a.user.id === nextActiveUserId);
        if (active) {
          try {
            const data = await api.getSession(active.session.access_token);
            if (data.user && data.session) {
              // use profile endpoint for latest user fields
              const profileData = await api.getProfile(active.session.access_token);
              const updatedAccount: Account = { user: profileData, session: active.session };
              const updatedAccounts = parsedAccounts.map((a) =>
                a.user.id === nextActiveUserId ? updatedAccount : a
              );
              setAccounts(updatedAccounts);
              persistAccounts(updatedAccounts, nextActiveUserId);
            } else {
              // session invalid; switch or clear
              const cleanedAccounts = parsedAccounts.filter((a) => a.user.id !== nextActiveUserId);
              const newActive = cleanedAccounts[0]?.user?.id ?? null;
              setAccounts(cleanedAccounts);
              setActiveUserId(newActive);
              persistAccounts(cleanedAccounts, newActive);
            }
          } catch (sessErr) {
            console.error('Session check error:', sessErr);
            const cleanedAccounts = parsedAccounts.filter((a) => a.user.id !== nextActiveUserId);
            const newActive = cleanedAccounts[0]?.user?.id ?? null;
            setAccounts(cleanedAccounts);
            setActiveUserId(newActive);
            persistAccounts(cleanedAccounts, newActive);
          }
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem(ACCOUNTS_KEY);
      localStorage.removeItem(ACTIVE_USER_KEY);
      setAccounts([]);
      setActiveUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email: string, password: string) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    try {
      const data = await api.signin(normalizedEmail, trimmedPassword);
      const fetchedUser = data.user;
      const fetchedSession = data.session;

      if (!fetchedUser?.id || !fetchedSession?.access_token) {
        throw new Error('Invalid response from sign in');
      }

      const existingIndex = accounts.findIndex((a) => a.user.id === fetchedUser.id);
      let nextAccounts = [...accounts];

      const newAccount: Account = {
        user: fetchedUser,
        session: fetchedSession,
      };

      if (existingIndex >= 0) {
        nextAccounts[existingIndex] = newAccount;
      } else {
        nextAccounts.push(newAccount);
      }

      const nextActiveUserId = fetchedUser.id;
      setAccounts(nextAccounts);
      setActiveUserId(nextActiveUserId);
      persistAccounts(nextAccounts, nextActiveUserId);

      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signinWithSession = (fetchedUser: User, fetchedSession: { access_token: string }) => {
    const existingIndex = accounts.findIndex((a) => a.user.id === fetchedUser.id);
    let nextAccounts = [...accounts];

    const newAccount: Account = { user: fetchedUser, session: fetchedSession };

    if (existingIndex >= 0) {
      nextAccounts[existingIndex] = newAccount;
    } else {
      nextAccounts.push(newAccount);
    }

    const nextActiveUserId = fetchedUser.id;
    setAccounts(nextAccounts);
    setActiveUserId(nextActiveUserId);
    persistAccounts(nextAccounts, nextActiveUserId);
    toast.success('Successfully signed in via session');
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    try {
      // Create user account
      const result = await api.signup(normalizedEmail, trimmedPassword, firstName, lastName);
      
      // Return the user data for redirection to email verification
      toast.success('Account created! Please verify your email.');
      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signout = async (): Promise<boolean> => {
    try {
      const active = getActiveAccount();
      if (active?.session?.access_token) {
        await api.signout(active.session.access_token);
      }

      const remainingAccounts = accounts.filter((a) => a.user.id !== activeUserId);
      const nextActive = remainingAccounts[0]?.user?.id ?? null;

      setAccounts(remainingAccounts);
      setActiveUserId(nextActive);
      persistAccounts(remainingAccounts, nextActive);

      toast.success('Successfully signed out');
      return remainingAccounts.length > 0;
    } catch (error: any) {
      console.error('Sign out error:', error);
      const remainingAccounts = accounts.filter((a) => a.user.id !== activeUserId);
      const nextActive = remainingAccounts[0]?.user?.id ?? null;

      setAccounts(remainingAccounts);
      setActiveUserId(nextActive);
      persistAccounts(remainingAccounts, nextActive);

      toast.error('Signed out (with errors)');
      return remainingAccounts.length > 0;
    }
  };

  const updateProfile = async (updates: { firstName?: string; lastName?: string; phone?: string; company?: string; bio?: string; }) => {
    try {
      const active = getActiveAccount();
      const token = active?.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const updatedUser = await api.updateProfile(token, updates);

      const updatedAccounts = accounts.map((a) =>
        a.user.id === updatedUser.id ? { ...a, user: updatedUser } : a
      );
      setAccounts(updatedAccounts);
      persistAccounts(updatedAccounts, activeUserId);

      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const uploadProfileAvatar = async (file: File) => {
    try {
      const active = getActiveAccount();
      const token = active?.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const data = await api.uploadProfileAvatar(token, file);
      if (!active) throw new Error('No active account');

      const updatedUser = { ...active.user, profilePicUrl: data.profilePicUrl };
      const updatedAccounts = accounts.map((a) =>
        a.user.id === active.user.id ? { ...a, user: updatedUser } : a
      );
      setAccounts(updatedAccounts);
      persistAccounts(updatedAccounts, activeUserId);

      toast.success('Profile picture uploaded successfully');
      return data;
    } catch (error: any) {
      console.error('Profile avatar upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture');
      throw error;
    }
  };

  const switchAccount = (userId: string) => {
    if (!accounts.some((a) => a.user.id === userId)) {
      throw new Error('Account not found');
    }

    setActiveUserId(userId);
    persistAccounts(accounts, userId);
    toast.success('Switched account');
  };

  const removeAccount = (userId: string) => {
    const remainingAccounts = accounts.filter((a) => a.user.id !== userId);
    const nextActive = remainingAccounts[0]?.user?.id ?? null;

    setAccounts(remainingAccounts);
    setActiveUserId(nextActive);
    persistAccounts(remainingAccounts, nextActive);

    if (userId === activeUserId) {
      toast.success('Removed active account, switched to another');
    } else {
      toast.success('Removed account');
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
        accounts,
        activeUserId,
        loading,
        signin,
        signinWithSession,
        signup,
        signout,
        resetPassword,
        updateProfile,
        uploadProfileAvatar,
        switchAccount,
        removeAccount,
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
