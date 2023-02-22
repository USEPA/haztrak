import React from 'react';
import { Table } from 'react-bootstrap';
import { Handler, Manifest } from 'types';
import { TransporterRowActions } from './TransporterRowActions';
import { UseFieldArrayReturn } from 'react-hook-form';

interface TransporterTableProps {
  transporters?: Array<Handler>;
  arrayFieldMethods: UseFieldArrayReturn<Manifest, 'transporters', 'id'>;
  readOnly?: boolean;
}

function TransporterTable({ transporters, arrayFieldMethods, readOnly }: TransporterTableProps) {
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
                {readOnly ? (
                  <></>
                ) : (
                  <TransporterRowActions
                    removeTransporter={arrayFieldMethods.remove}
                    swapTransporter={arrayFieldMethods.swap}
                    index={index}
                    length={transporters?.length}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export { TransporterTable };
