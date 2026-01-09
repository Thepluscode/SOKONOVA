// Centralized API client for SokoNova backend
// Connects to NestJS backend at port 4000

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Token storage key
const TOKEN_KEY = 'sokonova_token';

// Get stored auth token
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

// Set auth token
export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

// Remove auth token
export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

// Generic API error
export class ApiError extends Error {
    status: number;
    statusText: string;
    data?: unknown;

    constructor(status: number, statusText: string, data?: unknown) {
        super(`API Error: ${status} ${statusText}`);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }
}

// Core fetch wrapper with auth
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

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
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, response.statusText, errorData);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return null as T;

    return JSON.parse(text);
}

// API methods
export const api = {
    // GET request
    get: <T>(path: string): Promise<T> =>
        apiFetch<T>(path, { method: 'GET' }),

    // POST request
    post: <T>(path: string, data?: unknown): Promise<T> =>
        apiFetch<T>(path, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    // PATCH request
    patch: <T>(path: string, data?: unknown): Promise<T> =>
        apiFetch<T>(path, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),

    // PUT request
    put: <T>(path: string, data?: unknown): Promise<T> =>
        apiFetch<T>(path, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    // DELETE request
    delete: <T>(path: string): Promise<T> =>
        apiFetch<T>(path, { method: 'DELETE' }),
};

// Build query string from params object
export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
    const filtered = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
}

export default api;
