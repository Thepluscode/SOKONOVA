// Authentication Context for SokoNova
// Provides user state, login/logout, and route protection

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken, removeToken, getToken } from './api';
import type { User, Role, LoginResponse } from './types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    needsOnboarding: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    hasRole: (role: Role | Role[]) => boolean;
    completeOnboarding: () => void;
    triggerOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const token = getToken();
        if (token) {
            // Try to get current user from token
            api.get<User>('/users/me')
                .then(setUser)
                .catch(() => {
                    // Token invalid, clear it
                    removeToken();
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await api.post<LoginResponse>('/auth/login', { email, password });
        setToken(response.token);
        setUser(response.user);
    }, []);

    const logout = useCallback(() => {
        removeToken();
        setUser(null);
    }, []);

    const hasRole = useCallback((role: Role | Role[]) => {
        if (!user) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
    }, [user]);

    const completeOnboarding = useCallback(() => {
        setNeedsOnboarding(false);
        localStorage.setItem('onboarding_completed', 'true');
    }, []);

    const triggerOnboarding = useCallback(() => {
        setNeedsOnboarding(true);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user: user,
                isLoading: isLoading,
                isAuthenticated: !!user,
                needsOnboarding: needsOnboarding,
                login: login,
                logout: logout,
                hasRole: hasRole,
                completeOnboarding: completeOnboarding,
                triggerOnboarding: triggerOnboarding,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook for protected routes
export function useRequireAuth(requiredRole?: Role | Role[]) {
    const { user, isLoading, isAuthenticated, hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        } else if (!isLoading && requiredRole && !hasRole(requiredRole)) {
            navigate('/unauthorized');
        }
    }, [isLoading, isAuthenticated, requiredRole, hasRole, navigate]);

    return { user, isLoading };
}
