import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("authToken");
        if (stored) setToken(stored);
    }, [])

    const login = (input) => {
        localStorage.setItem("authToken", input);
        setToken(input)
    };

    const logout = () => {
        localStorage.removeItem("authToken")
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;