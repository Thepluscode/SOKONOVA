// Mobile Auth Context
// Uses cross-platform storage for web compatibility

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItemAsync } from './storage';
import api, { setAuthToken, removeAuthToken } from './api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'BUYER' | 'SELLER' | 'ADMIN';
    shopName?: string;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const token = await getItemAsync('auth_token');
            if (token) {
                const userData = await api.get<User>('/auth/me');
                setUser(userData);
            }
        } catch (error) {
            console.log('No valid session found');
            await removeAuthToken();
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const response = await api.post<{ access_token: string; user: User }>('/auth/login', {
            email,
            password,
        });

        await setAuthToken(response.access_token);
        setUser(response.user);
    }

    async function register(name: string, email: string, password: string) {
        const response = await api.post<{ access_token: string; user: User }>('/auth/register', {
            name,
            email,
            password,
        });

        await setAuthToken(response.access_token);
        setUser(response.user);
    }

    async function logout() {
        await removeAuthToken();
        setUser(null);
    }

    async function refreshUser() {
        try {
            const userData = await api.get<User>('/auth/me');
            setUser(userData);
        } catch {
            await logout();
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export default AuthContext;
