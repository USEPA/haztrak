import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Table } from 'react-bootstrap';
import { Manifest } from 'types/manifest';
import { Transporter } from 'types/handler';
import { TransporterRowActions } from './TransporterRowActions';
import { UseFieldArrayReturn } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TransporterTableProps {
  transporters?: Array<Transporter>;
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
          <th className="text-center">Signed</th>
          {readOnly ? <></> : <th className="text-center">Edit</th>}
        </tr>
      </thead>
      <tbody>
        {transporters.map((transporter, index) => {
          return (
            <tr key={index}>
              <td>{transporter.order}</td>
              <td>{transporter.epaSiteId}</td>
              <td>{transporter.name}</td>
              <td className="text-center">
                {transporter.signed ? (
                  <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-success" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} size="lg" className="text-danger" />
                )}
              </td>
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
