/**
 * Error Utilities - Parse API errors into user-friendly messages
 */

import { ApiError } from './api';

// HTTP status code to user-friendly message mapping
const STATUS_MESSAGES: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Session expired. Please log in again.',
    403: 'You don\'t have permission to do this.',
    404: 'The requested item was not found.',
    409: 'This action conflicts with existing data.',
    422: 'Please check your input and try again.',
    429: 'Too many requests. Please wait a moment.',
    500: 'Server error. Please try again later.',
    502: 'Server is temporarily unavailable.',
    503: 'Service is under maintenance. Please try again later.',
};

// Context-specific error messages
const CONTEXT_MESSAGES: Record<string, Record<number, string>> = {
    login: {
        401: 'Invalid email or password.',
        404: 'Account not found.',
    },
    cart: {
        404: 'Product no longer available.',
        409: 'Item already in cart.',
    },
    order: {
        402: 'Payment required.',
        404: 'Order not found.',
    },
    product: {
        404: 'Product not found or has been removed.',
    },
};

/**
 * Extract user-friendly message from an error
 * @param error - The error object (ApiError, Error, or unknown)
 * @param context - Optional context for more specific messages (e.g., 'login', 'cart')
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown, context?: string): string {
    // Handle ApiError with server-provided message
    if (error instanceof ApiError) {
        // Check for server-provided message first
        const serverMessage = extractServerMessage(error.data);
        if (serverMessage) {
            return serverMessage;
        }

        // Check context-specific messages
        if (context && CONTEXT_MESSAGES[context]?.[error.status]) {
            return CONTEXT_MESSAGES[context][error.status];
        }

        // Fall back to generic status messages
        return STATUS_MESSAGES[error.status] || `Error ${error.status}: ${error.statusText}`;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Network error. Please check your internet connection.';
    }

    // Handle standard errors
    if (error instanceof Error) {
        // Don't expose technical error messages to users
        if (error.message.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }
        if (error.message.includes('abort')) {
            return 'Request was cancelled.';
        }
    }

    // Default fallback
    return 'Something went wrong. Please try again.';
}

/**
 * Extract message from API error response data
 */
function extractServerMessage(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;

    const errorData = data as Record<string, unknown>;

    // Common API error response formats
    if (typeof errorData.message === 'string') {
        return errorData.message;
    }

    // NestJS validation errors
    if (Array.isArray(errorData.message)) {
        return errorData.message[0];
    }

    // Nested error object
    if (errorData.error && typeof errorData.error === 'object') {
        const nestedError = errorData.error as Record<string, unknown>;
        if (typeof nestedError.message === 'string') {
            return nestedError.message;
        }
    }

    return null;
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return true;
    }
    if (error instanceof ApiError && error.status === 0) {
        return true;
    }
    return false;
}

/**
 * Check if error requires re-authentication
 */
export function isAuthError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 401;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
    return error instanceof ApiError && (error.status === 400 || error.status === 422);
}

/**
 * Extract validation errors for form fields
 */
export function getValidationErrors(error: unknown): Record<string, string> {
    if (!(error instanceof ApiError)) return {};

    const data = error.data as Record<string, unknown> | undefined;
    if (!data) return {};

    // Handle NestJS class-validator format
    if (Array.isArray(data.message)) {
        const errors: Record<string, string> = {};
        data.message.forEach((msg: string) => {
            // Try to extract field name from message
            const match = msg.match(/^(\w+)\s/);
            if (match) {
                errors[match[1]] = msg;
            }
        });
        return errors;
    }

    // Handle errors object format
    if (data.errors && typeof data.errors === 'object') {
        return data.errors as Record<string, string>;
    }

    return {};
}
