import React, { ReactElement, useMemo, useState } from 'react';
import { HtPaginate, HtTooltip } from 'components/Ht';
import { Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { MtnDetails } from 'types/Manifest/Manifest';

interface MtnTableProps {
  manifests: Array<MtnDetails>;
  pageSize?: number;
}

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 */
function MtnTable({ manifests, pageSize = 10 }: MtnTableProps): ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return manifests.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize, manifests]);

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
      <Table hover>
        <thead>
          <tr>
            <th>Manifest Tracking Number</th>
            <th>Status</th>
            <th className="d-flex justify-content-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map(({ manifestTrackingNumber, status }, i) => {
            return (
              <tr key={`mtn${i}`}>
                <td>{manifestTrackingNumber}</td>
                <td>{status}</td>
                <td>
                  <div className="d-flex justify-content-evenly">
                    <HtTooltip text={`View: ${manifestTrackingNumber}`}>
                      <Link
                        to={`./${manifestTrackingNumber}/view`}
                        aria-label={`viewManifest${manifestTrackingNumber}`}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </HtTooltip>
                    <HtTooltip text={`Edit ${manifestTrackingNumber}`}>
                      <Link
                        to={`./${manifestTrackingNumber}/edit`}
                        aria-label={`editManifest${manifestTrackingNumber}`}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Link>
                    </HtTooltip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
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

export default MtnTable;
