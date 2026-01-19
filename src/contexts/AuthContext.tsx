import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "user" | "provider" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "maktabi.auth";

// Mock user database (in real app, this would be an API)
const mockUsers: (User & { password: string })[] = [
  { id: "1", email: "user@example.com", password: "password123", name: "John Doe", role: "user" },
  { id: "2", email: "provider@example.com", password: "password123", name: "Jane Provider", role: "provider" },
  { id: "3", email: "admin@example.com", password: "password123", name: "Admin User", role: "admin" },
];

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return null;
}

function storeUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find user in mock database (support phone format)
      const foundUser = mockUsers.find((u) => {
        // Check email match
        if (u.email === email && u.password === password) return true;
        // Check phone format (phone_XXXXXXXXXX@maktabi.local)
        if (email.startsWith("phone_") && email.endsWith("@maktabi.local")) {
          const phoneDigits = email.replace("phone_", "").replace("@maktabi.local", "");
          // For demo, check if phone matches any user's email pattern
          // In real app, you'd have a separate phone field
          return u.password === password;
        }
        return false;
      });

      if (!foundUser) {
        return { success: false, error: "Invalid email or password" };
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      storeUser(userWithoutPassword);

      // Persist userRole to localStorage
      if (userWithoutPassword.role === "provider") {
        localStorage.setItem("userRole", "provider");
        // Check if provider is onboarded (default to false if not set)
        const providerOnboarded = localStorage.getItem("providerOnboarded");
        if (providerOnboarded === null) {
          localStorage.setItem("providerOnboarded", "false");
        }
      } else {
        localStorage.setItem("userRole", userWithoutPassword.role);
      }

      return { success: true };
    },
    []
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: UserRole = "user"
    ): Promise<{ success: boolean; error?: string }> => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if user already exists
      if (mockUsers.some((u) => u.email === email)) {
        return { success: false, error: "An account with this email already exists" };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role,
      };

      // Add to mock database
      mockUsers.push({ ...newUser, password });

      setUser(newUser);
      storeUser(newUser);

      // Persist userRole to localStorage
      if (newUser.role === "provider") {
        localStorage.setItem("userRole", "provider");
        localStorage.setItem("providerOnboarded", "false");
      } else {
        localStorage.setItem("userRole", newUser.role);
      }

      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    storeUser(null);
    // Clear role-related localStorage items
    localStorage.removeItem("userRole");
    localStorage.removeItem("providerOnboarded");
  }, []);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      if (!user) return false;
      return user.role === role;
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      hasRole,
    }),
    [user, login, signup, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
