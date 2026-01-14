/**
 * useApiError Hook - Provides consistent error handling with toast notifications
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage, isAuthError, isNetworkError } from '../lib/errorUtils';
import { removeToken } from '../lib/api';

export interface UseApiErrorOptions {
    /** Context for more specific error messages (e.g., 'login', 'cart', 'order') */
    context?: string;
    /** Custom message to show instead of parsed error */
    customMessage?: string;
    /** Whether to redirect to login on auth errors (default: true) */
    redirectOnAuth?: boolean;
    /** Whether to show toast notification (default: true) */
    showToast?: boolean;
}

/**
 * Hook for handling API errors with consistent UX
 * 
 * @example
 * const handleError = useApiError();
 * 
 * try {
 *   await api.get('/orders');
 * } catch (error) {
 *   handleError(error, { context: 'order' });
 * }
 */
export function useApiError() {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleError = useCallback(
        (error: unknown, options: UseApiErrorOptions = {}) => {
            const {
                context,
                customMessage,
                redirectOnAuth = true,
                showToast: shouldShowToast = true,
            } = options;

            // Log error for debugging (development)
            console.error(`[API Error]${context ? ` [${context}]` : ''}:`, error);

            // Get user-friendly message
            const message = customMessage || getErrorMessage(error, context);

            // Handle auth errors - redirect to login
            if (isAuthError(error) && redirectOnAuth) {
                removeToken();
                showToast({
                    message: 'Session expired. Please log in again.',
                    type: 'error',
                });
                navigate('/login', { replace: true });
                return;
            }

            // Show toast notification
            if (shouldShowToast) {
                showToast({
                    message,
                    type: isNetworkError(error) ? 'error' : 'error',
                    duration: isNetworkError(error) ? 6000 : 4000, // Longer for network errors
                });
            }

            return message;
        },
        [showToast, navigate]
    );

    return handleError;
}

/**
 * Simple error handler without hooks (for use outside components)
 */
export function handleApiError(error: unknown, context?: string): string {
    console.error(`[API Error]${context ? ` [${context}]` : ''}:`, error);
    return getErrorMessage(error, context);
}

export default useApiError;
