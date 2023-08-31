import { faTools } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { WasteRowActions } from 'components/Manifest/WasteLine/WasteLineTable/WasteRowActions';
import { UseFieldArrayReturn } from 'react-hook-form';
import { Manifest } from 'components/Manifest';

interface WasteLineTableProps {
  wastes: Array<WasteLine>;
  toggleWLModal: () => void;
  wasteArrayMethods: UseFieldArrayReturn<Manifest, 'wastes'>;
}

export function WasteLineTable({ wastes, toggleWLModal, wasteArrayMethods }: WasteLineTableProps) {
  const { editWasteLine, setEditWasteLine } = useContext<ManifestContextType>(ManifestContext);
  if (!wastes || wastes.length < 1) {
    return <></>;
  }
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Containers</th>
          <th>Type</th>
          <th>Codes</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {wastes.map((wasteLine, index) => {
          return (
            <tr key={index}>
              <td>{wasteLine.lineNumber + 1}</td>
              <td
                style={{
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {wasteLine.wasteDescription ?? wasteLine.dotInformation?.printedDotInformation}
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
                <WasteRowActions
                  index={index}
                  wasteArrayMethods={wasteArrayMethods}
                  toggleWLModal={toggleWLModal}
                  setEditWasteLine={setEditWasteLine}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
