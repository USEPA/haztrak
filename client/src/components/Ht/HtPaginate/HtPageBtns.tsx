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
    <div className="d-flex justify-content-center">
      <Button
        variant="outline-secondary"
        className="p-1 mx-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <FontAwesomeIcon icon={faBackwardFast} className="text-primary" />
      </Button>
      <Button
        variant="outline-secondary"
        className="p-1 mx-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <FontAwesomeIcon icon={faCaretLeft} className="text-primary" />
      </Button>
      <Button
        variant="outline-secondary"
        className="p-1 mx-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <FontAwesomeIcon icon={faCaretRight} className="text-primary" />
      </Button>
      <Button
        variant="outline-secondary"
        className="p-1 mx-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <FontAwesomeIcon icon={faForwardFast} className="text-primary" />
      </Button>
    </div>
  );
}
