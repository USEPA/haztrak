import React from 'react';
import usePagination from 'hooks/usePagination';
import { Pagination } from 'react-bootstrap';
import { usePaginationProps } from 'types';

interface HtPaginateProps extends usePaginationProps {
  onPageChange: any;
}

/**
 * HtPaginate is a wrapper around our usePagination hook and the react-bootstrap
 * Pagination component (for display). It applies defaults for ease and readability.
 *
 * @param totalCount
 * @param currentPage value from a useState hook in parent component
 * @param onPageChange setter function returned from useState for currentPage
 * @param siblingCount Number of Pages to show on either side of active page (defaults to 1)
 * @param pageSize Number of items to display
 * @param useEllipsis Hide overflow pages with ellipsis (defaults to true)
 * @param maxVisiblePages Maximum number page numbers to show (valid if useEllipsis === true,
 * defaults to 9)
 * @constructor
 */
function HtPaginate({
  totalCount,
  currentPage,
  onPageChange,
  pageSize,
  siblingCount = 1,
  useEllipsis = true,
  maxVisiblePages = 9,
}: HtPaginateProps) {
  const paginationRange = usePagination({
    totalCount,
    currentPage,
    pageSize,
    siblingCount,
    useEllipsis,
    maxVisiblePages,
  });

  // If there's no range of page number, or there's only 1 page. Return nothing
  if (!paginationRange || currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  /**
   * Increment page number by 1
   */
  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  /**
   * Decrement page number by 1
   */
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div className="d-flex justify-content-center">
      <Pagination>
        <Pagination.Prev onClick={onPrevious} disabled={currentPage === 1} />
        {paginationRange ? (
          paginationRange.map((pageNumber, index) => {
            if (pageNumber === '...') {
              return <Pagination.Ellipsis key={`mtnListPag${index}`} disabled={true} />;
            }
            return (
              <Pagination.Item
                key={`mtnListPag${index}`}
                active={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          })
        ) : (
          <></>
        )}
        <Pagination.Next onClick={onNext} disabled={currentPage === lastPage} />
      </Pagination>
    </div>
  );
}

export default HtPaginate;
