import { useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const userData = response.data;

        localStorage.setItem("token", userData.token);

        const loggedInUser = {
            id: userData.id,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        return loggedInUser;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}