import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Transporter } from 'components/Manifest';
import { Manifest } from 'components/Manifest/manifestSchema';
import { QuickerSignData, QuickerSignModalBtn } from 'components/Manifest/QuickerSign';
import { TransporterRowActions } from 'components/Manifest/Transporter/TransporterTable/TransporterRowActions';
import React from 'react';
import { Accordion, AccordionButton, Card, Col, Row, useAccordionButton } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';

interface TransporterTableProps {
  transporters?: Array<Transporter>;
  arrayFieldMethods: UseFieldArrayReturn<Manifest, 'transporters', 'id'>;
  readOnly?: boolean;
  setupSign: (data: QuickerSignData) => void;
}

function CustomToggle({ children, eventKey }: any) {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    // <button type="button" style={{ backgroundColor: 'pink' }} onClick={decoratedOnClick}>
    //   {children}
    // </button>
    <div className="mx-1">
      <AccordionButton onClick={decoratedOnClick} />
    </div>
  );
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
      <Accordion ref={parent}>
        {transporters.map((transporter, index) => {
          return (
            <Card key={transporter.epaSiteId} className="py-2 px-4 m-2">
              <Row>
                <Col xs={8}>
                  <h5 className="d-inline border-3 me-3">{transporter.order} </h5>
                  <span>{transporter.name} </span>
                  <span>{transporter.epaSiteId} </span>
                </Col>
                <Col xs={3} className="text-end">
                  {readOnly ? (
                    <QuickerSignModalBtn
                      siteType={'Transporter'}
                      mtnHandler={transporter}
                      handleClick={setupSign}
                      iconOnly={true}
                      disabled={transporter.signed}
                    />
                  ) : (
                    <>
                      <TransporterRowActions
                        removeTransporter={arrayFieldMethods.remove}
                        swapTransporter={arrayFieldMethods.swap}
                        index={index}
                        length={transporters?.length}
                      />
                    </>
                  )}
                </Col>
                <Col xs={1}>
                  <CustomToggle eventKey={transporter.epaSiteId}></CustomToggle>
                </Col>
              </Row>
              <Accordion.Collapse eventKey={transporter.epaSiteId}>
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
    </>
  );
}

export { TransporterTable };
