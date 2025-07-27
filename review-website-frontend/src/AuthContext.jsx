import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("authToken");
    if (stored === AUTH_TOKEN) {
      setToken(stored);
    }
  }, []);

  const login = (input) => {
    if (input === AUTH_TOKEN) {
      localStorage.setItem("authToken", input);
      setToken(input);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
