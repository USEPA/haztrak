import React from 'react';
import { Table } from 'react-bootstrap';
import { WasteLine } from 'types/WasteLine';

interface WasteLineTableProps {
  wastes: Array<WasteLine>;
}

export function WasteLineTable({ wastes }: WasteLineTableProps) {
  if (!wastes || wastes.length < 1) {
    return <></>;
  }
  if (wastes) {
    for (let i = 0; i < wastes?.length; i++) {
      wastes[i].lineNumber = i + 1;
    }
  }
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>U.S. DOT Description</th>
          <th>Containers</th>
          <th>Type</th>
          <th>Codes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {wastes.map((wasteLine, index) => {
          return (
            <tr key={index}>
              <td>{wasteLine.lineNumber}</td>
              <td>{wasteLine.wasteDescription}</td>
              <td>{wasteLine.quantity?.containerNumber}</td>
              <td>{String(wasteLine.quantity?.containerType)}</td>
              <td>
                <small>
                  {wasteLine.hazardousWaste?.federalWasteCodes?.map((code, index) => {
                    // ToDo: fix how hazardous waste codes are appended to wasteline
                    // @ts-ignore
                    return `${String(code.value)} ${
                      index + 1 === wasteLine.hazardousWaste?.federalWasteCodes?.length ? ' ' : ', '
                    }`;
                  })}
                </small>
              </td>
              <td>
                <p>ToDo</p>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
