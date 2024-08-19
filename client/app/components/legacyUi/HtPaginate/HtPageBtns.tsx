import { Table } from '@tanstack/react-table';

import { Pagination } from 'react-bootstrap';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { FaBackwardFast, FaForwardFast } from 'react-icons/fa6';
import { usePagination } from '~/hooks';

interface HtPageBtnsProps<T> {
  table: Table<T>;
}

/**
 * Returns buttons for setting the page to view for a table.
 * Built exclusively for use with the react-table (v8) library.
 * https://tanstack.com/table/v8
 * @param table
 * @constructor
 */
export function HtPageBtns<T>({ table }: HtPageBtnsProps<T>) {
  const paginationRange = usePagination({
    totalCount: table.getFilteredRowModel().rows.length,
    pageSize: table.getState().pagination.pageSize,
    siblingCount: 1,
    currentPage: table.getState().pagination.pageIndex,
    maxVisiblePages: 7,
    useEllipsis: true,
  });
  if (!paginationRange) {
    return null;
  }
  return (
    <>
      <div className="d-flex justify-content-center">
        <Pagination className="bg-light rounded-5 p-1 py-2">
          <Pagination.First
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FaBackwardFast size={'lg'} />
          </Pagination.First>
          <Pagination.Prev onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>
            <FaCaretLeft size={'lg'} />
          </Pagination.Prev>

          {paginationRange.map((pageNumber, index) => {
            const pageIndex = table.getState().pagination.pageIndex;
            if (typeof pageNumber === 'string') {
              return <Pagination.Ellipsis key={`mtnListPag${index}`} disabled={true} />;
            }
            return (
              <Pagination.Item
                onClick={() => table.setPageIndex(pageNumber - 1)}
                key={`mtnListPag${index}`}
                active={pageNumber === pageIndex + 1}
              >
                {pageNumber}
              </Pagination.Item>
            );
          })}
          <Pagination.Next onClick={table.nextPage} disabled={!table.getCanNextPage()}>
            <FaCaretRight size="lg" />
          </Pagination.Next>
          <Pagination.Last
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FaForwardFast size="lg" />
          </Pagination.Last>
        </Pagination>
      </div>
    </>
  );
}
