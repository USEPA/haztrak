import { useAutoAnimate } from '@formkit/auto-animate/react';
import { faAngleRight, faCheck, faSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transporter } from 'components/Manifest';
import { Manifest } from 'components/Manifest/manifestSchema';
import { QuickSignBtn } from 'components/Manifest/QuickerSign';
import { useReadOnly } from 'hooks/manifest';
import React, { useState } from 'react';
import { Accordion, Button, Card, Col, Row, Table, useAccordionButton } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';
import { TransporterRowActions } from './TransporterRowActions';

interface TransporterTableProps {
  transporters?: Array<Transporter>;
  arrayFieldMethods: UseFieldArrayReturn<Manifest, 'transporters', 'id'>;
  setupSign: () => void;
}

function CustomToggle({ eventKey }: any) {
  const [open, setOpen] = useState(false);
  const decoratedOnClick = useAccordionButton(eventKey, () => setOpen(!open));

  return (
    <Button
      onClick={decoratedOnClick}
      className="bg-transparent border-0 text-dark"
      title="more info"
    >
      <FontAwesomeIcon
        icon={faAngleRight}
        className={`sb-sidenav-collapse-arrow ${open ? 'rotate-90' : ''} `}
      />
    </Button>
  );
}

function TransporterTable({ transporters, arrayFieldMethods, setupSign }: TransporterTableProps) {
  const [parent] = useAutoAnimate();
  const [readOnly] = useReadOnly();

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
      <Accordion ref={parent}>
        {transporters.map((transporter, index) => {
          const transporterKey: string = `${transporter.epaSiteId}-${index.toString()}`;
          return (
            <Card key={transporterKey} className="py-2 ps-4 pe-2 my-2">
              <Row className="d-flex justify-content-around">
                <Col xs={8} className="d-flex align-items-center">
                  <h5 className="mb-0 me-3">{transporter.order} </h5>
                  <span className="overflow-scroll">{transporter.name}</span>
                </Col>
                <Col xs={2}>
                  {readOnly ? (
                    <QuickSignBtn
                      siteType={'Transporter'}
                      mtnHandler={transporter}
                      onClick={setupSign}
                      iconOnly={true}
                      disabled={transporter.signed}
                    />
                  ) : transporter.signed ? (
                    <FontAwesomeIcon icon={faSignature} />
                  ) : (
                    <></>
                  )}
                </Col>
                <Col xs={2} className="d-flex justify-content-end align-items-center">
                  {readOnly ? (
                    <CustomToggle eventKey={transporterKey}></CustomToggle>
                  ) : (
                    <TransporterRowActions
                      removeTransporter={arrayFieldMethods.remove}
                      swapTransporter={arrayFieldMethods.swap}
                      index={index}
                      length={transporters?.length}
                      eventKey={transporterKey}
                    />
                  )}
                </Col>
              </Row>
              <Accordion.Collapse eventKey={transporterKey}>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>EPA ID</th>
                        <th>Phone</th>
                        <th>Can e-Sign?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{transporter.epaSiteId}</td>
                        <td>{transporter.contact.phone?.number}</td>
                        <td className="text-success text-center">
                          {transporter ? <FontAwesomeIcon icon={faCheck} /> : 'no'}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
    </>
  );
}

export { TransporterTable };
