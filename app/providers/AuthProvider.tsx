import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
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
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const signOut = async () => {
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