import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react"; /*React tools:
createContext() – lets you share data (like user info) across your app
useContext() – allows components to read from that shared context
useState() – stores the current user
useEffect() – runs when the component mounts */
import { supabase } from "../supabase-client"; /*also import your configured supabase instance to talk to the backend.*/

// Create the context (initially null)
const AuthContext =
  createContext(
    null
  ); /* create a new context to store and share the auth state.*/

/* AuthProvider component
   This component wraps your entire app (in main.jsx) and:
   Keeps track of the current user
   Shares login/logout functions
   Makes all this available to components like Navbar*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  /*What’s going on UseEffect?
When the app starts, this code:
Gets the current session from Supabase
Listens for changes like login/logout
Updates user state with new info
🔁 It also cleans up the listener when the component unmounts. */
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
  /*When the user clicks “Sign In with GitHub”, this function runs.
  It opens a GitHub login popup using Supabase OAuth.*/
  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };
  /*Logs the user out from Supabase.
  Clears the user state in React. */
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
  /*This shares your user, signInWithGitHub, and signOut with the whole app.*/
  const value = {
    user,
    signInWithGitHub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/*This custom hook makes it easy to access auth in any component (like Navbar).
Instead of doing useContext(AuthContext) everywhere, you just call useAuth().*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
