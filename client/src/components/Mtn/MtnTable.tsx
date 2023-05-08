import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MtnRowActions } from 'components/Mtn/MtnRowActions';
import React from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

const mtnDetailsSchema = z.object({
  manifestTrackingNumber: z.string(),
  signatureStatus: z.boolean(),
  submissionType: z.enum(['FullElectronic', 'DataImage5Copy', 'Hybrid', 'Image', 'NotSelected']),
  status: z.string(),
  actions: z.any(),
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

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 */
export function MtnTable({ manifests }: MtnTableProps) {
  const table = useReactTable({
    columns,
    data: manifests,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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
    </>
  );
}
