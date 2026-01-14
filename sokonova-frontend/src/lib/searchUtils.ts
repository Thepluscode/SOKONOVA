/**
 * Search Utilities - Recent searches and suggestions helpers
 */

const RECENT_SEARCHES_KEY = 'sokonova_recent_searches';
const MAX_RECENT_SEARCHES = 5;

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): string[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Add a search query to recent searches
 */
export function addRecentSearch(query: string): void {
    if (typeof window === 'undefined' || !query.trim()) return;

    const normalized = query.trim().toLowerCase();
    const recent = getRecentSearches();

    // Remove if already exists (will be re-added at top)
    const filtered = recent.filter(s => s.toLowerCase() !== normalized);

    // Add to front and limit
    const updated = [query.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);

    try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
        // Ignore storage errors
    }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
        // Ignore storage errors
    }
}

/**
 * Remove a specific search from recent searches
 */
export function removeRecentSearch(query: string): void {
    if (typeof window === 'undefined') return;

    const recent = getRecentSearches();
    const filtered = recent.filter(s => s.toLowerCase() !== query.toLowerCase());

    try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    } catch {
        // Ignore storage errors
    }
}
