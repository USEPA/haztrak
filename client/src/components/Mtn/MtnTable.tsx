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
import { HtPageBtns, HtPageControls } from 'components/Ht';
import { MtnRowActions } from 'components/Mtn/MtnRowActions';
import React, { useState } from 'react';
import { Col, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import { z } from 'zod';

const mtnDetailsSchema = z.object({
  manifestTrackingNumber: z.string(),
  signatureStatus: z.boolean(),
  submissionType: z.enum(['FullElectronic', 'DataImage5Copy', 'Hybrid', 'Image', 'NotSelected']),
  status: z.enum([
    'Scheduled',
    'Signed',
    'Corrected',
    'ReadyForSignature',
    'Draft',
    'InTransit',
    'UnderCorrection',
  ]),
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

// This defines our MTN table's columns and their behavior
const columns = [
  columnHelper.accessor('manifestTrackingNumber', {
    header: 'MTN',
    cell: (info) => info.getValue(), // example
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      if (info.getValue() === 'ReadyForSignature') return 'Ready for Signature';
      if (info.getValue() === 'UnderCorrection') return 'Under Correction';
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
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { getValue } }: CellContext<MtnDetails, any>) => (
      <MtnRowActions mtn={getValue('manifestTrackingNumber')} />
    ),
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

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: readonly StatusOption[] = [
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'InTransit', label: 'In Transit' },
  { value: 'ReadyForSignature', label: 'Ready to Sign' },
  { value: 'Corrected', label: 'Corrected' },
  { value: 'Signed', label: 'Signed' },
  { value: 'NotAssigned', label: 'Draft' },
  { value: 'UnderCorrection', label: 'Under Correction' },
];

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 */
export function MtnTable({ manifests }: MtnTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState<StatusOption | null>(null);
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
      <div className="d-flex flex-row justify-content-end">
        <Col xs={3}>
          <Form.Control
            id={'mtnGlobalSearch'}
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Filter..."
          />
        </Col>
        <Col xs={4} className="mx-2">
          <Select
            name="statusFilter"
            value={searchValue}
            onChange={(newValue) => {
              setSearchValue(newValue);
              setColumnFilters([{ id: 'status', value: newValue?.value ?? '' }]);
            }}
            options={statusOptions}
            isClearable={true}
            placeholder="Status"
            classNames={{
              control: () => 'form-select py-0 ms-2 rounded-3',
              placeholder: () => 'p-0 m-0 ps-1',
            }}
            components={{ IndicatorSeparator: () => null, DropdownIndicator: () => null }}
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
      <HtPageBtns table={table} />
      <HtPageControls table={table} />
    </>
  );
}
