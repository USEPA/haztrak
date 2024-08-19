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
import React, { ChangeEvent, useState } from 'react';
import { Button, Col, Table } from 'react-bootstrap';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { HtPageBtns, HtPageControls } from '~/components/legacyUi';
import { MtnRowActions } from '~/components/Mtn/MtnRowActions';
import { MtnSearchField } from '~/components/Mtn/MtnSearchField/MtnSearchField';
import { MtnStatusField, StatusOption } from '~/components/Mtn/MtnStatusField/MtnStatusField';

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
  manifests: MtnDetails[];
  pageSize?: number;
}

const columnHelper = createColumnHelper<MtnDetails>();

const columns = [
  columnHelper.accessor('manifestTrackingNumber', {
    header: 'MTN',
    cell: (info) => (
      <Link to={`./${info.getValue()}/view`} className="text-decoration-none">
        {info.getValue()}
      </Link>
    ),
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

    cell: ({ row: { getValue } }: CellContext<MtnDetails, unknown>) => (
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

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 */
export function MtnTable({ manifests }: MtnTableProps) {
  const [searchParams] = useSearchParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState(searchParams.get('mtn') ?? '');
  const table = useReactTable({
    columns,
    data: manifests,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter: searchValue,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchValue,
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

  const onStatusChange = (newValue: StatusOption | null) => {
    setColumnFilters([{ id: 'status', value: newValue?.value ?? '' }]);
  };

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-end">
        <Col xs={3}>
          <MtnSearchField value={searchValue} onChange={onSearchChange} />
        </Col>
        <Col xs={4} className="mx-2">
          <MtnStatusField onChange={onStatusChange} />
        </Col>
      </div>
      <Table responsive>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {/* if sortable, column header is clickable */}
                  {header.column.getCanSort() ? (
                    header.isPlaceholder ? null : (
                      <Button
                        className="bg-transparent border-0 cursor-pointer select-none p-0 text-dark fw-bolder"
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {/* If column is sortable */}
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          // Column sort icon when ascending order
                          asc: (
                            <>
                              {' '}
                              <FaSortUp className="text-info" />
                            </>
                          ),
                          // Column sort icon when descending order
                          desc: (
                            <>
                              {' '}
                              <FaSortDown className="text-info" />
                            </>
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <>
                            {' '}
                            {/* Default column sort icon when not sorting by this column*/}
                            <FaSort className="text-info" />
                          </>
                        )}
                      </Button>
                    )
                  ) : (
                    <div className="text-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="py-1" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
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
