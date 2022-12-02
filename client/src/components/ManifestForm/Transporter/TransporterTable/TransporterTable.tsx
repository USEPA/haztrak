import React from 'react';
import { Table } from 'react-bootstrap';
import { Handler } from 'types';
import { TransporterRowActions } from './TransporterRowActions';
import { UseFieldArrayRemove } from 'react-hook-form';

interface Props {
  transporters?: Array<Handler>;
  removeTransporter: UseFieldArrayRemove;
}

function TransporterTable({ transporters, removeTransporter }: Props) {
  // useEffect(() => {
  //   if (transporters) {
  //     for (let i = 0; i < transporters?.length; i++) {
  //       transporters[i].order = i + 1;
  //       console.log(transporters[i]);
  //     }
  //   }
  // }, [transporters]);

  if (!transporters || transporters.length < 1) {
    return <></>;
  }
  if (transporters) {
    for (let i = 0; i < transporters?.length; i++) {
      transporters[i].order = i + 1;
    }
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
                <TransporterRowActions
                  removeTransporter={removeTransporter}
                  order={index}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export { TransporterTable };
