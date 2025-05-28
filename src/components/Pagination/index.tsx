"use client";
// This page is entirely AI generated. The lion does not consern himself with pagination.

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './pagination.module.css';
import Button from '@/components/ui/Button';

interface PaginationControlsProps {
  totalPages: number;
  isLoading?: boolean;
}

export default function Pagination({
  totalPages,
  isLoading = false,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    // Preserve the 'limit' search parameter if it exists
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      params.set('limit', limitParam);
    }

    router.push(`?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;
    const delta = 2;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let lastPage = 0;
    for (const pageNum of range) {
      if (typeof pageNum === 'number' && pageNum > lastPage + 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(pageNum);
      if (typeof pageNum === 'number') {
        lastPage = pageNum;
      }
    }
    return pageNumbers;
  };

  const pageNumbersToDisplay = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      <Button
        variant="outline"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className={styles.paginationButton}
      >
        Anterior
      </Button>

      {pageNumbersToDisplay.map((pageNumber, index) => (
        <React.Fragment key={index}>
          {typeof pageNumber === 'string' ? (
            <span className={styles.paginationEllipsis}>...</span>
          ) : (
            <Button
              variant="outline"
              onClick={() => goToPage(pageNumber)}
              disabled={isLoading}
              className={`${styles.paginationButton} ${pageNumber === currentPage ? styles.active : ''}`}
            >
              {pageNumber}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className={styles.paginationButton}
      >
        Próximo
      </Button>
    </div>
  );
}
