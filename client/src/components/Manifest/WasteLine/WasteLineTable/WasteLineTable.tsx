import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Table } from 'react-bootstrap';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';

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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {wastes.map((wasteLine, index) => {
          return (
            <tr key={index}>
              <td>{wasteLine.lineNumber}</td>
              <td
                style={{
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {wasteLine.wasteDescription}
              </td>
              <td>{wasteLine.quantity?.containerNumber}</td>
              <td>{String(wasteLine.quantity?.containerType.code)}</td>
              <td>
                <small
                  style={{
                    display: '-webkit-box',
                    maxHeight: '60px',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {wasteLine.hazardousWaste?.federalWasteCodes?.map((item) => item.code).join(', ')}
                </small>
              </td>
              <td className="text-center">
                <FontAwesomeIcon icon={faTools} className="text-info" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
