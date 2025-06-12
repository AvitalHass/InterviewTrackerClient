import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext, User } from "./auth-types";

// Cookie configuration that matches our login flow
const COOKIE_CONFIG: Cookies.CookieAttributes = {
  expires: 2,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://we23tm7jpl.execute-api.us-east-1.amazonaws.com/dev/auth/user", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          // Refresh the token's expiration
          Cookies.set('authToken', token, COOKIE_CONFIG);
        }
        setIsLoading(false);
        if (data.user) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        Cookies.remove("authToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
