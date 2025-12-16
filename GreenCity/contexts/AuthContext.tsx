// write only for the login authcontex
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "../types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../lib/api"; // Update this path to the correct location of the api module
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");  
      if (userData) setUser(JSON.parse(userData));
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // real API call
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const { token, refreshToken, user: userData } = response.data;
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // get porfile function can be added here
  const getProfile = async (): Promise<User | null> => {
    try {
      const response = await api.get("/auth/profile");
      if (response.status === 200) {
        const userData: User = response.data;
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);  
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}