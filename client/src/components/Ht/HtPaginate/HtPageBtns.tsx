import {
  faBackwardFast,
  faCaretLeft,
  faCaretRight,
  faForwardFast,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from '@tanstack/react-table';
import React from 'react';
import { Button } from 'react-bootstrap';
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
  console.log(table.getPageOptions());
  return (
    <div className="d-flex justify-content-center">
      <div className="bg-light rounded-5 px-1">
        <Button
          className="bg-transparent border-0 text-primary px-2"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <FontAwesomeIcon icon={faBackwardFast} size={'lg'} className="text-primary" />
        </Button>
        <Button
          className="bg-transparent border-0 text-primary px-2"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <FontAwesomeIcon icon={faCaretLeft} size={'lg'} className="text-primary" />
        </Button>
        {table.getPageOptions().map((pageNumber: number) => {
          const pageIndex = table.getState().pagination.pageIndex;
          return (
            <Button
              className={
                pageIndex === pageNumber
                  ? 'bg-primary rounded-circle mx-1 py-1'
                  : 'bg-transparent rounded-circle text-primary mx-1 py-1'
              }
              onClick={() => table.setPageIndex(pageNumber)}
            >
              {pageNumber + 1}
            </Button>
          );
        })}
        <Button
          className="bg-transparent border-0 text-primary px-2"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <FontAwesomeIcon icon={faCaretRight} size={'lg'} className="text-primary" />
        </Button>
        <Button
          className="bg-transparent border-0 text-primary px-2"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <FontAwesomeIcon icon={faForwardFast} size={'lg'} className="text-primary" />
        </Button>
      </div>
    </div>
  );
}
