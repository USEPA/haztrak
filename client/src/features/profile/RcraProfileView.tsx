import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { UserState } from 'types/store';

interface ProfileViewProps {
  profile: UserState;
}

function RcraProfileView({ profile }: ProfileViewProps) {
  return (
    <>
      <Container>
        <p className="fw-bold">RCRAInfo API ID</p>
        <p>{profile.rcraAPIID}</p>
        <p className="fw-bold">Phone Number</p>
        <p>{profile.phoneNumber}</p>
        <h4>Site Permissions</h4>
        <Table striped bordered hover>
          <thead>
            <tr></tr>
            <th>EPA ID</th>
            <th>e-Manifest</th>
            <th>Biennial Report</th>
            <th>Annual Report</th>
            <th>WIETS</th>
            <th>my RCRA ID</th>
          </thead>
          <tbody>
            {profile.epaSites?.map((epa_id, index) => {
              return (
                <tr>
                  <td>{epa_id}</td>
                  <td>temp</td>
                  <td>temp</td>
                  <td>temp</td>
                  <td>temp</td>
                  <td>temp</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default RcraProfileView;
