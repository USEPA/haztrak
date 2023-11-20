import { HaztrakSite } from 'components/HaztrakSite';
import React from 'react';
import { Row, Table } from 'react-bootstrap';
import { useGetOrgSitesQuery } from 'store';
import { HaztrakProfileOrg } from 'store/profileSlice/profile.slice';

interface MyOrgSitesProps {
  org: HaztrakProfileOrg;
}

export function MyOrgSites({ org }: MyOrgSitesProps) {
  const { data, isLoading, error } = useGetOrgSitesQuery(org.id);
  return (
    <Row className="my-2">
      <Table hover responsive>
        <thead>
          <tr>
            <th>EPA ID</th>
            <th>Site Type</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            Object.values(data as HaztrakSite[]).map((site) => (
              <tr key={`${site.handler.epaSiteId}`}>
                <td>{site.handler.epaSiteId}</td>
                <td>{site.handler.siteType}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <i>Contact your Haztrak admin obtain access to additional sites within your organization</i>
    </Row>
  );
}
