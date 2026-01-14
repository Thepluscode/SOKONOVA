// Mobile API Configuration
// Adapted from web frontend for React Native

import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://sokonova-backend-production.up.railway.app';

export class ApiError extends Error {
    status: number;
    statusText: string;
    data?: unknown;

    constructor(status: number, statusText: string, data?: unknown) {
        super(`API Error: ${status} ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }
}

async function getAuthToken(): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync('auth_token');
    } catch {
        return null;
    }
}

export async function setAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
}

export async function removeAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let data;
        try {
            data = await response.json();
        } catch {
            data = null;
        }
        throw new ApiError(response.status, response.statusText, data);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text);
}

const api = {
    get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
    post: <T>(path: string, body?: unknown) =>
        apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown) =>
        apiFetch<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
    patch: <T>(path: string, body?: unknown) =>
        apiFetch<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            searchParams.append(key, String(value));
        }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

export default api;
