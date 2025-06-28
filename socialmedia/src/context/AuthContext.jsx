import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase-client";

/**
 * @typedef {import('@supabase/supabase-js').User} User
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {() => void} signInWithGitHub
 * @property {() => void} signOut
 */

// Create the context (initially null)
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Keep user in sync with Supabase session
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    signInWithGitHub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use AuthContext
 * @returns {AuthContextType}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
