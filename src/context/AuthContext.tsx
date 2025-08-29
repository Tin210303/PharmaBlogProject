import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserInfo {
  ID: number;
  display_name: string;
  username: string;
  avatar_URL: string;
  email?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CLIENT_ID = "123712";
const REDIRECT_URI = "https://pharmanews.vercel.app/oauth/callback";
const WP_OAUTH_URL = `https://public-api.wordpress.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&response_type=code&scope=global`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Kiểm tra token khi load app
  useEffect(() => {
    const token = localStorage.getItem("wp_token");
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("https://public-api.wordpress.com/rest/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("wp_token");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      localStorage.removeItem("wp_token");
      setIsLoggedIn(false);
    }
  };

  const login = () => {
    window.location.href = WP_OAUTH_URL;
  };

  const logout = () => {
    localStorage.removeItem("wp_token");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để xài ở component khác
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
