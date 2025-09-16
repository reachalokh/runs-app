import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  height?: string;
  position?: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (isSupabaseConfigured) {
        // try to get user from supabase auth
        const session = supabase.auth.getSession && (await supabase.auth.getSession());
        // supabase v2 client returns { data, error }
        // handle both shapes defensively
        const currentUser = (session as any)?.data?.session?.user ?? (session as any)?.user ?? null;
        if (currentUser) {
          setUser({
            id: currentUser.id,
            name: currentUser.user_metadata?.name ?? currentUser.email ?? "",
            email: currentUser.email ?? "",
            profileImage: currentUser.user_metadata?.avatar_url ?? undefined,
          });
        } else {
          const userData = await AsyncStorage.getItem("user");
          if (userData) setUser(JSON.parse(userData));
        }
      } else {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Supabase signIn error:", error);
        return false;
      }

      const supaUser = (data as any)?.user ?? null;
      if (supaUser) {
        const localUser: User = {
          id: supaUser.id,
          name: supaUser.user_metadata?.name ?? email,
          email: supaUser.email ?? email,
          profileImage: supaUser.user_metadata?.avatar_url ?? undefined,
        };
        await AsyncStorage.setItem("user", JSON.stringify(localUser));
        setUser(localUser);
        return true;
      }
      return false;
    }

    // Mock authentication
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      profileImage: "https://ui-avatars.com/api/?name=John+Doe&background=FF6B35&color=fff",
      height: "6'2\"",
      position: "Point Guard",
    };
    
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      // Supabase social sign-in typically redirects; for web-only flows you might call
      // supabase.auth.signInWithOAuth({ provider: 'google' })
      // For native apps you'd use the native Google SDK and then exchange tokens.
      // Here we return false to indicate the caller should handle platform-specific flow.
      return false;
    }

    // Mock Google authentication
    const mockUser: User = {
      id: "1",
      name: "Google User",
      email: "user@gmail.com",
      profileImage: "https://ui-avatars.com/api/?name=Google+User&background=FF6B35&color=fff",
    };
    
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (error) {
        console.error("Supabase signUp error:", error);
        return false;
      }

      const supaUser = (data as any)?.user ?? null;
      if (supaUser) {
        const localUser: User = {
          id: supaUser.id,
          name: supaUser.user_metadata?.name ?? name,
          email: supaUser.email ?? email,
          profileImage: supaUser.user_metadata?.avatar_url ?? undefined,
        };
        await AsyncStorage.setItem("user", JSON.stringify(localUser));
        setUser(localUser);
        return true;
      }
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      profileImage: `https://ui-avatars.com/api/?name=${name}&background=FF6B35&color=fff`,
    };
    
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };

    if (isSupabaseConfigured) {
      try {
        // update user metadata
        await supabase.auth.updateUser({ data: { ...updates } } as any);
      } catch (e) {
        console.warn("Supabase updateUser warning:", e);
      }
    }

    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut warning:", e);
      }
    }

    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    updateProfile,
    signOut,
  };
});