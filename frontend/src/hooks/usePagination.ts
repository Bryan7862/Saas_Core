import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
    data: T[];
    itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    paginatedData: T[];
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    isFirstPage: boolean;
    isLastPage: boolean;
    startIndex: number;
    endIndex: number;
    totalItems: number;
}

export const usePagination = <T>({
    data,
    itemsPerPage = 10
}: UsePaginationOptions<T>): UsePaginationReturn<T> => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    // Reset to page 1 if data changes and current page is out of bounds
    if (currentPage > totalPages) {
        setCurrentPage(1);
    }

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    }, [data, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, data.length);

    return {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
        nextPage,
        prevPage,
        isFirstPage: currentPage === 1,
        isLastPage: currentPage === totalPages,
        startIndex,
        endIndex,
        totalItems: data.length
    };
};
