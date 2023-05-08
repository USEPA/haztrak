import { MtnRowActions } from 'components/Mtn/MtnRowActions';
import React, { ReactElement, useMemo, useState } from 'react';
import { HtPaginate, HtTooltip } from 'components/Ht';
import { Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { CellProps, Column, useTable } from 'react-table';
import { z } from 'zod';

const mtnDetailsSchema = z.object({
  manifestTrackingNumber: z.string(),
  signatureStatus: z.boolean(),
  submissionType: z.enum(['FullElectronic', 'DataImage5Copy', 'Hybrid', 'Image']),
  status: z.string(),
  actions: z.any(),
});

const subTypeCell = ({ value }: CellProps<MtnDetails>) => {
  if (value === 'FullElectronic') return 'Electronic';
};

/**
 * Select details about a manifest for display, navigation, and analysis.
 * Often used in composite types (arrays).
 */
export type MtnDetails = z.infer<typeof mtnDetailsSchema>;

interface MtnTableProps {
  manifests: Array<MtnDetails>;
  pageSize?: number;
}

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 */
export function MtnTable({ manifests, pageSize = 10 }: MtnTableProps): ReactElement {
  // @ts-ignore
  const mtnColumns: Column<MtnDetails>[] = useMemo(
    () => [
      {
        Header: 'MTN',
        accessor: 'manifestTrackingNumber', // accessor is the "key" in the data
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Type',
        accessor: 'submissionType',
        Cell: ({ value }: CellProps<MtnDetails>) => {
          if (value === 'FullElectronic') return 'Electronic';
          if (value === 'DataImage5Copy') return 'Data + Image';
          else return value;
        },
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({
          cell: {
            row: {
              values: { manifestTrackingNumber },
            },
          },
        }: CellProps<MtnDetails>) => <MtnRowActions mtn={manifestTrackingNumber} />,
      },
    ],
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return manifests.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize, manifests]);
  const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps } = useTable({
    columns: mtnColumns,
    data: manifests,
  });
  if (manifests.length === 0) {
    return (
      <>
        <Row className="text-center">
          <h3>No Manifest Found</h3>
        </Row>
      </>
    );
  }

  return (
    <>
      <Table hover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
        {/*<thead>*/}
        {/*  <tr>*/}
        {/*    <th>Manifest Tracking Number</th>*/}
        {/*    <th>Status</th>*/}
        {/*    <th className="d-flex justify-content-center">Actions</th>*/}
        {/*  </tr>*/}
        {/*</thead>*/}
        {/*<tbody>*/}
        {/*  {currentTableData.map(({ manifestTrackingNumber, status }, i) => {*/}
        {/*    return (*/}
        {/*      <tr key={`mtn${i}`}>*/}
        {/*        <td>{manifestTrackingNumber}</td>*/}
        {/*        <td>{status}</td>*/}
        {/*        <td>*/}
        {/*          <div className="d-flex justify-content-evenly">*/}
        {/*            <HtTooltip text={`View: ${manifestTrackingNumber}`}>*/}
        {/*              <Link*/}
        {/*                to={`./${manifestTrackingNumber}/view`}*/}
        {/*                aria-label={`viewManifest${manifestTrackingNumber}`}*/}
        {/*              >*/}
        {/*                <FontAwesomeIcon icon={faEye} />*/}
        {/*              </Link>*/}
        {/*            </HtTooltip>*/}
        {/*            <HtTooltip text={`Edit ${manifestTrackingNumber}`}>*/}
        {/*              <Link*/}
        {/*                to={`./${manifestTrackingNumber}/edit`}*/}
        {/*                aria-label={`editManifest${manifestTrackingNumber}`}*/}
        {/*              >*/}
        {/*                <FontAwesomeIcon icon={faPen} />*/}
        {/*              </Link>*/}
        {/*            </HtTooltip>*/}
        {/*          </div>*/}
        {/*        </td>*/}
        {/*      </tr>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</tbody>*/}
      </Table>
      <HtPaginate
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalCount={manifests.length}
        pageSize={pageSize}
      />
    </>
  );
}
