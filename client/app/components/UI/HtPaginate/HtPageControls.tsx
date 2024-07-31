import { Table } from '@tanstack/react-table';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

interface HtPageBtnsProps<T> {
  table: Table<T>;
}

/**
 * Returns display, and inputs for setting the page to view for a paginated table.
 * Built exclusively for use with the react-table (v8) library.
 * https://tanstack.com/table/v8
 * also see HtPageBtns.tsx
 * @param table
 * @constructor
 */
export function HtPageControls<T>({ table }: HtPageBtnsProps<T>) {
  return (
    <Row className="d-flex justify-content-between pt-2">
      <Col>
        {'Page '}
        <strong>{table.getState().pagination.pageIndex + 1}</strong>
        {' of '}
        <strong>{table.getPageCount()}</strong>
      </Col>
      <Col>
        <div className="d-flex align-content-center gap-1">
          <Form.Label htmlFor={'mtnPageNumber'}>{'Go to page:'}</Form.Label>
          <Form.Control
            type="number"
            id={'mtnPageNumber'}
            value={table.getState().pagination.pageIndex + 1}
            style={{ width: '4rem' }}
            className="py-0 px-1"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </div>
      </Col>
      <Col className="d-flex justify-content-end">
        <Col xs={9} xl={7}>
          <Form.Select
            aria-label="page size"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Col>
    </Row>
  );
}
