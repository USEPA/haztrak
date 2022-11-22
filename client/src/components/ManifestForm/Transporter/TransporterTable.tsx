import React from 'react';
import { Table } from 'react-bootstrap';
import { Handler } from 'types';
import TransporterRowActions from './TransporterRowActions';

interface Props {
  transporters?: [Handler];
}

function TransporterTable({ transporters }: Props) {
  if (!transporters) {
    return <></>;
  }

  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>EPA ID</th>
          <th>Name</th>
          <th>e-Signer?</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {transporters.map((transporter, index) => {
          return (
            <tr key={index}>
              <td>{transporter.order}</td>
              <td>{transporter.epaSiteId}</td>
              <td>{transporter.name}</td>
              <td>{transporter.canEsign ? 'yes' : 'no'}</td>
              <td>
                <TransporterRowActions />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default TransporterTable;
