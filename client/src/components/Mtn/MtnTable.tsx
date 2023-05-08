import {
  faBackwardFast,
  faCaretLeft,
  faCaretRight,
  faForward,
  faForwardFast,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  CellContext,
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { HtForm } from 'components/Ht';
import { MtnRowActions } from 'components/Mtn/MtnRowActions';
import React, { useState } from 'react';
import { Button, Col, Dropdown, Form, Row, Table } from 'react-bootstrap';
import { z } from 'zod';

const mtnDetailsSchema = z.object({
  manifestTrackingNumber: z.string(),
  signatureStatus: z.boolean(),
  submissionType: z.enum(['FullElectronic', 'DataImage5Copy', 'Hybrid', 'Image', 'NotSelected']),
  status: z.string(),
  actions: z.any().optional(),
});

/**
 * Select details about a manifest for display, navigation, and analysis.
 * Often used in composite types (arrays).
 */
export type MtnDetails = z.infer<typeof mtnDetailsSchema>;

interface MtnTableProps {
  manifests: Array<MtnDetails>;
  pageSize?: number;
}

const columnHelper = createColumnHelper<MtnDetails>();

const columns = [
  columnHelper.accessor('manifestTrackingNumber', {
    header: 'MTN',
    cell: (info) => info.getValue(), // example
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      if (info.getValue() === 'ReadyForSignature') return 'Ready for Signature';
      else return info.getValue();
    },
  }),
  columnHelper.accessor('submissionType', {
    header: 'Type',
    cell: (info) => {
      if (info.getValue() === 'FullElectronic') return 'Electronic';
      if (info.getValue() === 'NotSelected') return 'Not Selected';
      if (info.getValue() === 'DataImage5Copy') return 'Data + Image';
      else return info.getValue();
    },
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: ({ row: { getValue } }: CellContext<MtnDetails, any>) => (
      <MtnRowActions mtn={getValue('manifestTrackingNumber')} />
    ),
  }),
];

const fuzzyFilter: FilterFn<MtnDetails> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 */
export function MtnTable({ manifests }: MtnTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    columns,
    data: manifests,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <>
      <Col xs={3}>
        <HtForm.Label htmlFor={'mtnGlobalSearch'}>Global Search</HtForm.Label>
        <Form.Control
          id={'mtnGlobalSearch'}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Search manifests..."
        />
      </Col>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
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
      <Row className="d-flex justify-content-between pt-2">
        <Col>
          {'Page '}
          <strong>{table.getState().pagination.pageIndex + 1}</strong>
          {' of '}
          <strong>{table.getPageCount()}</strong>
        </Col>
        <Col>
          <Row>
            <Col className="me-0 pe-0">
              <span className="align-bottom">{'Go to page:'}</span>
            </Col>
            <Col className="ms-0 ps-0" xs={5}>
              <Form.Control
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="d-inline-block"
              />
            </Col>
          </Row>
        </Col>
        <Col className="d-flex justify-content-end">
          <Col xs={7}>
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
    </>
  );
}
