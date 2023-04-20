import { Table } from 'react-bootstrap';
import { HtTooltip } from 'components/Ht';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFileLines } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { HaztrakSite } from 'components/HaztrakSite/haztrakSiteSchema';

interface HtSiteTableProps {
  sitesData: Array<HaztrakSite>;
}

export function HtSiteTable({ sitesData }: HtSiteTableProps) {
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Site Alias</th>
          <th>EPA ID number</th>
          <th className="d-grid justify-content-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sitesData.map((site, i) => {
          return (
            <tr key={i}>
              <td>{site.name}</td>
              <td>{site.handler.epaSiteId}</td>
              <td className="d-flex justify-content-evenly">
                <HtTooltip text={`${site.name} Details`}>
                  <Link to={`/site/${site.handler.epaSiteId}`} aria-label={`${site.name}Details`}>
                    <FontAwesomeIcon icon={faEye} />
                  </Link>
                </HtTooltip>
                <HtTooltip text={`${site.name}'s manifest`}>
                  <Link
                    to={`/site/${site.handler.epaSiteId}/manifest`}
                    aria-label={`${site.name}Manifests`}
                  >
                    <FontAwesomeIcon icon={faFileLines} />
                  </Link>
                </HtTooltip>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
