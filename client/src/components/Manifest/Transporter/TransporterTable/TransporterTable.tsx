import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Transporter } from 'components/Manifest';
import { Manifest } from 'components/Manifest/manifestSchema';
import { QuickerSignData, QuickerSignModalBtn } from 'components/Manifest/QuickerSign';
import { TransporterRowActions } from 'components/Manifest/Transporter/TransporterTable/TransporterRowActions';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';

interface TransporterTableProps {
  transporters?: Array<Transporter>;
  arrayFieldMethods: UseFieldArrayReturn<Manifest, 'transporters', 'id'>;
  readOnly?: boolean;
  setupSign: (data: QuickerSignData) => void;
}

function TransporterTable({
  transporters,
  arrayFieldMethods,
  readOnly,
  setupSign,
}: TransporterTableProps) {
  const [parent, enableAnimations] = useAutoAnimate();

  if (!transporters || transporters.length < 1) {
    return <></>;
  }

  if (transporters) {
    for (let i = 0; i < transporters?.length; i++) {
      transporters[i].order = i + 1;
    }
  }

  return (
    <>
      <div ref={parent}>
        {transporters.map((transporter, index) => {
          return (
            <Card key={transporter.epaSiteId} className="mb-2">
              <Card.Body>
                <Row>
                  <Col>
                    <h5 className="d-inline border-3 me-3">{transporter.order} </h5>
                    {/*<span>{transporter.epaSiteId} </span>*/}
                    <span>{transporter.name} </span>
                  </Col>
                  <Col xs={3}>
                    {readOnly ? (
                      <QuickerSignModalBtn
                        siteType={'Transporter'}
                        mtnHandler={transporter}
                        handleClick={setupSign}
                        iconOnly={true}
                        disabled={transporter.signed}
                      />
                    ) : (
                      <TransporterRowActions
                        removeTransporter={arrayFieldMethods.remove}
                        swapTransporter={arrayFieldMethods.swap}
                        index={index}
                        length={transporters?.length}
                      />
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            // <tr key={index}>
            //   <td>{transporter.order}</td>
            //   <td>{transporter.epaSiteId}</td>
            //   <td>{transporter.name}</td>
            //   <td className="text-center">
            //     {transporter.signed ? (
            //       <FontAwesomeIcon icon={faCircleCheck} size="lg" className="text-success" />
            //     ) : (
            //       <FontAwesomeIcon icon={faCircleXmark} size="lg" className="text-danger" />
            //     )}
            //   </td>
            //   <td>

            //   </td>
            // </tr>
          );
        })}
      </div>
    </>
  );
}

export { TransporterTable };
