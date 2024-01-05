import { Manifest } from 'components/Manifest';
import { ManifestContext, ManifestContextType } from 'components/Manifest/ManifestForm';
import { WasteLine } from 'components/Manifest/WasteLine/wasteLineSchema';
import { WasteRowActions } from 'components/Manifest/WasteLine/WasteLineTable/WasteRowActions';
import { useReadOnly } from 'hooks/manifest';
import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';

interface WasteLineTableProps {
  wastes: Array<WasteLine>;
  toggleWLModal: () => void;
  wasteForm: UseFieldArrayReturn<Manifest, 'wastes'>;
}

export function WasteLineTable({ wastes, toggleWLModal, wasteForm }: WasteLineTableProps) {
  const { setEditWasteLineIndex } = useContext<ManifestContextType>(ManifestContext);
  const [readonly] = useReadOnly();
  if (!wastes || wastes.length < 1) {
    return <></>;
  }
  return (
    <Table striped responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Containers</th>
          <th>Type</th>
          <th>Codes</th>
          {readonly ?? <th>Edit</th>}
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
              {readonly ?? (
                <td className="text-center">
                  <WasteRowActions
                    index={index}
                    wasteForm={wasteForm}
                    toggleWLModal={toggleWLModal}
                    setEditWasteLine={setEditWasteLineIndex}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
