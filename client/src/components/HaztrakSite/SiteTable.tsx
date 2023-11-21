import { HaztrakSite } from 'components/HaztrakSite/haztrakSiteSchema';
import { SiteTableRowActions } from 'components/HaztrakSite/SiteTableRowActions';
import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface HtSiteTableProps {
  sitesData: Array<HaztrakSite>;
}

export function HtSiteTable({ sitesData }: HtSiteTableProps) {
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Site</th>
          <th>EPA ID number</th>
          <th>Site Type</th>
          <th className="d-grid justify-content-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sitesData.map((site, i) => {
          return (
            <tr key={i}>
              <td>
                <Link to={`/site/${site.handler.epaSiteId}`} aria-label={`site ${site.name}`}>
                  {site.name}
                </Link>
              </td>
              <td>{site.handler.epaSiteId}</td>
              <td>{site.handler.siteType}</td>
              <td className="d-flex justify-content-evenly">
                <SiteTableRowActions siteId={site.handler.epaSiteId} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
