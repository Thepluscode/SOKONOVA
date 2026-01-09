// Pagination Component - Reusable pagination UI

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    total?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
    hasNext?: boolean;
    hasPrev?: boolean;
    showPageSize?: boolean;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

export default function Pagination({
    currentPage,
    totalPages,
    total,
    pageSize = 20,
    onPageChange,
    hasNext = currentPage < totalPages,
    hasPrev = currentPage > 1,
    showPageSize = false,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {/* Page info */}
            <div className="text-sm text-gray-600">
                {total !== undefined && (
                    <span>
                        Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, total)}</strong> to{' '}
                        <strong>{Math.min(currentPage * pageSize, total)}</strong> of{' '}
                        <strong>{total}</strong> results
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Page size selector */}
                {showPageSize && onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Page numbers */}
                <nav className="flex items-center gap-1">
                    {/* Previous button */}
                    <button
                        onClick={() => hasPrev && onPageChange(currentPage - 1)}
                        disabled={!hasPrev}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${hasPrev
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Previous page"
                    >
                        <i className="ri-arrow-left-s-line"></i>
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers().map((pageNum, index) => (
                        <React.Fragment key={index}>
                            {pageNum === '...' ? (
                                <span className="px-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(pageNum as number)}
                                    className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Next button */}
                    <button
                        onClick={() => hasNext && onPageChange(currentPage + 1)}
                        disabled={!hasNext}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${hasNext
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                        aria-label="Next page"
                    >
                        <i className="ri-arrow-right-s-line"></i>
                    </button>
                </nav>
            </div>
        </div>
    );
}
