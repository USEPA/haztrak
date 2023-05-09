import {
  faBackwardFast,
  faCaretLeft,
  faCaretRight,
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
import { MtnRowActions } from 'components/Mtn/MtnRowActions';
import React, { useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { z } from 'zod';

const mtnDetailsSchema = z.object({
  manifestTrackingNumber: z.string(),
  signatureStatus: z.boolean(),
  submissionType: z.enum(['FullElectronic', 'DataImage5Copy', 'Hybrid', 'Image', 'NotSelected']),
  status: z.enum(['Scheduled', 'Signed', 'Corrected', 'ReadyForSignature', 'Draft', 'InTransit']),
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
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('submissionType', {
    header: 'Type',
    cell: (info) => {
      if (info.getValue() === 'FullElectronic') return 'Electronic';
      if (info.getValue() === 'NotSelected') return 'Not Selected';
      if (info.getValue() === 'DataImage5Copy') return 'Data + Image';
      else return info.getValue();
    },
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: ({ row: { getValue } }: CellContext<MtnDetails, any>) => (
      <MtnRowActions mtn={getValue('manifestTrackingNumber')} />
    ),
    enableGlobalFilter: false,
  }),
];

/**
 * A fuzzy filter utility function from React table v8 docs
 * @param row
 * @param columnId
 * @param value
 * @param addMeta
 */
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
  const [searchValue, setSearchValue] = useState('');
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
      <div className="d-flex flex-row-reverse">
        <Col xs={5}>
          <Form.Select
            className="py-0 ms-2"
            value={searchValue}
            placeholder={'Status'}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setColumnFilters([{ id: 'status', value: event.target.value }]);
            }}
          >
            <option value="">--</option>
            <option value="Scheduled">Scheduled</option>
            <option value="NotAssigned">Draft</option>
            <option value="IntTransit">In Transit</option>
            <option value="ReadyForSignature">Ready for Signature</option>
            <option value="Signed">Signed</option>
            <option value="Corrected">Corrected</option>
          </Form.Select>
        </Col>
        <Col xs={3}>
          <Form.Control
            id={'mtnGlobalSearch'}
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Filter..."
            className="py-0"
          />
        </Col>
      </div>
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
    </>
  );
}
