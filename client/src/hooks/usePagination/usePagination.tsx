import { useMemo } from 'react';

export const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface usePaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  maxVisiblePages?: number;
  useEllipsis?: boolean;
}

/**
 * This custom usePagination hook was modeled after the article found on
 * https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
 * @param currentPage The current active page
 * @param totalCount Total number of items
 * @param pageSize Number of items in each page
 * @param siblingCount minimum number of page numbers on each side of active page (default 1)
 * @param maxVisiblePages number of visible pages (defaults to 7)
 * @param useEllipsis Do not return ellipsis (defaults to false)
 */
export function usePagination({
  totalCount,
  pageSize,
  siblingCount = 1,
  maxVisiblePages = 7,
  currentPage: currentPageIndex,
  useEllipsis = true,
}: usePaginationProps) {
  return useMemo(() => {
    // Total number of pages needed (rounded up) show every row
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = currentPageIndex + 1;

    // If the total number of pages needed is either
    // 1. less than the max number of visible
    // 2. the component has explicitly said it doesn't want ellipsis
    if (maxVisiblePages >= totalPages || !useEllipsis) {
      return range(1, totalPages); // return a simple array of numbers
    }
    // Past this point, we're adding ellipsis ('...'),

    // The index of earliest sibling to the left of the current page (or first)
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    // The index of the furthest page to the right of the current page (or last)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Show dots if more than 3 pages to left or right beyond the current page's sibling
    const showLeftDots = leftSiblingIndex > siblingCount;
    const showRightDots = rightSiblingIndex < totalPages - siblingCount;

    // show dots right of active page
    // 1, [2], 3, ..., 8
    if (!showLeftDots && showRightDots) {
      // create an array that shows the max number of page minus
      // 1 for the ellipsis, and 1 for the last page
      const leftItemCount = maxVisiblePages - 2;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    // show dots left of active page
    // 1, ..., 6, [7], 8
    if (showLeftDots && !showRightDots) {
      // create an array that shows the max number of page minus
      // 1 for the ellipsis, and 1 for the last page
      const rightItemCount = maxVisiblePages - 2;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, DOTS, ...rightRange];
    }

    // show dots on both sides of active page
    // 1, ..., 4, [5], 6, ..., 8
    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, DOTS, ...middleRange, DOTS, totalPages];
    }
  }, [totalCount, pageSize, siblingCount, currentPageIndex]);
}
