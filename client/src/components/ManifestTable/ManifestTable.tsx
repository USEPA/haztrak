import React, { ReactElement } from 'react';
import { HtCard, HtTooltip } from 'components/Ht';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

interface ManifestDetails {
  mtn: string;
  status: string;
}

/**
 * Returns a card with a table of manifest tracking numbers (MTN) and select details
 * @param manifest
 * @param title
 */
function ManifestTable(
  manifest: Array<ManifestDetails>,
  title: string
): ReactElement | null {
  if (manifest.length === 0) {
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
            {manifest.map(({ mtn, status }, i) => {
              return (
                <tr key={i}>
                  <td>{mtn}</td>
                  <td>{status}</td>
                  <td>
                    <div className="d-flex justify-content-evenly">
                      <HtTooltip text={`View: ${mtn}`}>
                        <Link
                          to={`/manifest/${mtn}/view`}
                          aria-label={`viewManifest${mtn}`}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </HtTooltip>
                      <HtTooltip text={`Edit ${mtn}`}>
                        <Link
                          to={`/manifest/${mtn}/edit`}
                          aria-label={`editManifest${mtn}`}
                        ></Link>
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

export default ManifestTable;
