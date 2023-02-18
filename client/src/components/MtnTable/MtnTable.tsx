import React, { ReactElement } from 'react';
import { HtCard, HtTooltip } from 'components/Ht';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import { MtnDetails } from 'types/Manifest/Manifest';

interface MtnTableProps {
  title: string;
  manifests: Array<MtnDetails>;
}

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 * @param title
 */
function MtnTable({ manifests, title }: MtnTableProps): ReactElement | null {
  if (manifests.length === 0) {
    return <></>;
  }
  return (
    <HtCard>
      <HtCard.Header title={title} />
      <HtCard.Body>
        <Table hover>
          <thead>
            <tr>
              <th>Manifest Tracking Number</th>
              <th>Status</th>
              <th className="d-flex justify-content-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {manifests.map(({ manifestTrackingNumber, status }, i) => {
              return (
                <tr key={i}>
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
      </HtCard.Body>
    </HtCard>
  );
}

export default MtnTable;
