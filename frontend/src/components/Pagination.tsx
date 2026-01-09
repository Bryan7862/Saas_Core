import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showInfo?: boolean;
    startIndex?: number;
    endIndex?: number;
    totalItems?: number;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = true,
    startIndex,
    endIndex,
    totalItems
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between py-4">
            {showInfo && startIndex !== undefined && endIndex !== undefined && totalItems !== undefined && (
                <p className="text-sm text-[var(--muted)]">
                    Mostrando <span className="font-medium text-[var(--text)]">{startIndex}</span>
                    {' - '}
                    <span className="font-medium text-[var(--text)]">{endIndex}</span>
                    {' de '}
                    <span className="font-medium text-[var(--text)]">{totalItems}</span>
                </p>
            )}

            <div className="flex items-center gap-1">
                {/* First */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Primera página"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Anterior"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition-colors ${currentPage === page
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-primary)]'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2 text-[var(--muted)]">{page}</span>
                    )
                ))}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Siguiente"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--bg-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Última página"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
};
