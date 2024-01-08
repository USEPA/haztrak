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
          return (
            <Card key={transporter.epaSiteId} className="py-2 px-4 my-2">
              <Row className="d-flex justify-content-between">
                <Col xs={9} className="d-flex align-items-center">
                  <div>
                    <h5 className="d-inline border-3 me-3">{transporter.order} </h5>
                    <span className="text-nowrap overflow-scroll">{transporter.name}</span>
                  </div>
                </Col>
                <Col xs={1}>
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
                <Col xs={1}>
                  {readOnly || (
                    <TransporterRowActions
                      removeTransporter={arrayFieldMethods.remove}
                      swapTransporter={arrayFieldMethods.swap}
                      index={index}
                      length={transporters?.length}
                    />
                  )}
                </Col>
                <Col xs={1}>
                  <CustomToggle eventKey={transporter.epaSiteId}></CustomToggle>
                </Col>
              </Row>
              <Accordion.Collapse eventKey={transporter.epaSiteId}>
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
