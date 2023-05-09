import {
  faBackwardFast,
  faCaretLeft,
  faCaretRight,
  faForwardFast,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from '@tanstack/react-table';
import React from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { boolean } from 'zod';

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
  return (
    <>
      <div className="d-flex justify-content-center">
        <Pagination className="bg-light rounded-5 px-1">
          <Pagination.First
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon icon={faBackwardFast} size={'lg'} />
          </Pagination.First>
          <Pagination.Prev onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>
            <FontAwesomeIcon icon={faCaretLeft} size={'lg'} />
          </Pagination.Prev>

          {table.getPageOptions().map((pageNumber: number) => {
            const pageIndex = table.getState().pagination.pageIndex;
            return (
              <Pagination.Item
                onClick={() => table.setPageIndex(pageNumber)}
                key={pageNumber}
                active={pageNumber === pageIndex}
              >
                {pageNumber + 1}
              </Pagination.Item>
            );
          })}
          <Pagination.Next onClick={table.nextPage} disabled={!table.getCanNextPage()}>
            <FontAwesomeIcon icon={faCaretRight} size={'lg'} />
          </Pagination.Next>
          <Pagination.Last
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FontAwesomeIcon icon={faForwardFast} size={'lg'} />
          </Pagination.Last>
        </Pagination>
      </div>
    </>
  );
}
