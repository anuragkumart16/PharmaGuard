
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check local storage for existing session
        const savedUser = localStorage.getItem("pg_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const publicPaths = ["/", "/login", "/signup", "/features", "/methodology"];
            const isPublicPath = publicPaths.includes(pathname);
            const isGuestPath = ["/login", "/signup"].includes(pathname);

            if (!user && !isPublicPath) {
                router.push("/login");
            } else if (user && isGuestPath) {
                router.push("/dashboard");
            }
        }
    }, [user, isLoading, pathname, router]);

    const login = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem("pg_user", JSON.stringify(newUser));
        router.push("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("pg_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
