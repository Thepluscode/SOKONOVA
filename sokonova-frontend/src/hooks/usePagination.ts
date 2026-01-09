// Pagination Hook - Reusable pagination state management

import { useState, useCallback } from 'react';

interface PaginationState {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

interface UsePaginationOptions {
    initialPage?: number;
    initialPageSize?: number;
}

interface UsePaginationReturn extends PaginationState {
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setTotal: (total: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    goToFirst: () => void;
    goToLast: () => void;
    hasNext: boolean;
    hasPrev: boolean;
    startIndex: number;
    endIndex: number;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const { initialPage = 1, initialPageSize = 20 } = options;

    const [page, setPageState] = useState(initialPage);
    const [pageSize, setPageSizeState] = useState(initialPageSize);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / pageSize) || 1;
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    const setPage = useCallback((newPage: number) => {
        setPageState(Math.max(1, Math.min(newPage, totalPages)));
    }, [totalPages]);

    const setPageSize = useCallback((newSize: number) => {
        setPageSizeState(newSize);
        setPageState(1); // Reset to first page when page size changes
    }, []);

    const nextPage = useCallback(() => {
        if (hasNext) setPageState(p => p + 1);
    }, [hasNext]);

    const prevPage = useCallback(() => {
        if (hasPrev) setPageState(p => p - 1);
    }, [hasPrev]);

    const goToFirst = useCallback(() => setPageState(1), []);
    const goToLast = useCallback(() => setPageState(totalPages), [totalPages]);

    return {
        page,
        pageSize,
        total,
        totalPages,
        setPage,
        setPageSize,
        setTotal,
        nextPage,
        prevPage,
        goToFirst,
        goToLast,
        hasNext,
        hasPrev,
        startIndex,
        endIndex,
    };
}

// Pagination component props generator
export function getPaginationProps(pagination: UsePaginationReturn) {
    return {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        total: pagination.total,
        pageSize: pagination.pageSize,
        onPageChange: pagination.setPage,
        onPageSizeChange: pagination.setPageSize,
        hasNext: pagination.hasNext,
        hasPrev: pagination.hasPrev,
        onNext: pagination.nextPage,
        onPrev: pagination.prevPage,
    };
}

export default usePagination;
