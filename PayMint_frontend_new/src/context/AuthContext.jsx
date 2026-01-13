import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { userApi } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const currentUser = userApi.getCurrentUser();
    if (currentUser) {
      console.log("currentUser:", currentUser);
      setUser(currentUser.user);
    }
    setLoading(false);
  }, []);
  const login = useCallback(async (email, password) => {
    const user2 = await userApi.login(email, password);
    console.log(user2);
    setUser(user2);
    return user2;
  }, []);
  const signup = useCallback(async (email, password, name) => {
    const user2 = await userApi.signup(email, password, name);
    console.log(email);
    setUser(user2);
    return user2;
  }, []);
  const logout = useCallback(() => {
    userApi.logout();
    setUser(null);
  }, []);
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    setUser
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export default AuthContext;
