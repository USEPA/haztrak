import { useMemo } from 'react';

export const DOTS = '...';

const range = (start: number, end: number) => {
  let length = end - start + 1;
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
 * @param maxPages Maximum number of visible pages (defaults to 9)
 * @param useEllipsis Do not return ellipsis (defaults to false)
 */
function usePagination({
  totalCount,
  pageSize,
  siblingCount = 1,
  maxVisiblePages = 9,
  currentPage,
  useEllipsis = false,
}: usePaginationProps) {
  return useMemo(() => {
    // Total number of pages needed (rounded up) to present data
    const totalPages = Math.ceil(totalCount / pageSize);

    // If the total number of pages needed is less than the max number of visible
    // pages, or we do not want to use ellipsis, just return the range of numbers
    if (maxVisiblePages >= totalPages || !useEllipsis) {
      return range(1, totalPages);
    }

    // Past this point, we're adding ellipsis ('...'), we need to figure out where to put those.
    // Get our active page's current index from left
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    // Get our active page's current index from Right
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Show dots if more than 3 pages to left or right beyond the current page's sibling
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!showLeftDots && showRightDots) {
      // We want to show a number of pages beyond the active and siblings
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      // We want to show a number of pages beyond the active and siblings
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);
}

export default usePagination;
