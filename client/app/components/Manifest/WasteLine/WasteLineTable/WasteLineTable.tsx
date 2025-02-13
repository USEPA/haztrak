import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useContext, useState } from 'react';
import { Accordion, Button, Card, Col, Row, useAccordionButton } from 'react-bootstrap';
import { UseFieldArrayReturn } from 'react-hook-form';
import { FaAngleRight, FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { Manifest } from '~/components/Manifest';
import { ManifestContext, ManifestContextType } from '~/components/Manifest/ManifestForm';
import { WasteRowActions } from '~/components/Manifest/WasteLine/WasteLineTable/WasteRowActions';
import { WasteLine } from '~/components/Manifest/WasteLine/wasteLineSchema';
import { useReadOnly } from '~/hooks/manifest';

interface WasteLineTableProps {
  wastes: WasteLine[];
  toggleWLModal: () => void;
  wasteForm: UseFieldArrayReturn<Manifest, 'wastes'>;
}

const WasteCodes = ({ wasteLine }: { wasteLine: WasteLine }) => {
  return (
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
  );
};

const CustomToggle = ({ eventKey }: any) => {
  const [open, setOpen] = useState(false);
  const decoratedOnClick = useAccordionButton(eventKey, () => setOpen(!open));

  return (
    <Button
      onClick={decoratedOnClick}
      className="bg-transparent border-0 text-dark me-2"
      title="more info"
    >
      <FaAngleRight
        className={` sb-sidenav-collapse-arrow tw-transform tw-transition-all ${
          open ? 'tw-rotate-90' : ''
        } `}
      />
    </Button>
  );
};

export function WasteLineTable({ wastes, toggleWLModal, wasteForm }: WasteLineTableProps) {
  const { setEditWasteLineIndex } = useContext<ManifestContextType>(ManifestContext);
  const [parent] = useAutoAnimate();
  const [readOnly] = useReadOnly();
  if (!wastes || wastes.length < 1) {
    return <></>;
  }
  return (
    <>
      <Accordion ref={parent}>
        {wastes.map((waste, index) => {
          const description = waste.wasteDescription ?? waste.dotInformation?.printedDotInformation;

          return (
            <Card key={waste.lineNumber} className="py-2 ps-4 pe-2 my-2">
              <Row className="d-flex justify-content-around">
                <Col xs={10} className="d-flex align-items-center">
                  <h5 className="me-3 mb-0">{waste.lineNumber} </h5>
                  <span className="overflow-scroll">
                    {waste.quantity.containerNumber} {waste.quantity.containerType.description}
                  </span>
                </Col>
                <Col className="d-flex justify-content-end align-items-center" xs={2}>
                  {readOnly ? (
                    <CustomToggle eventKey={waste.lineNumber.toString()} />
                  ) : (
                    <WasteRowActions
                      wasteForm={wasteForm}
                      setEditWasteLine={() => setEditWasteLineIndex(index)}
                      toggleWLModal={toggleWLModal}
                      index={index}
                      eventKey={waste.lineNumber.toString()}
                    />
                  )}
                </Col>
              </Row>
              <Accordion.Collapse eventKey={waste.lineNumber.toString()}>
                <Card.Body className="px-1">
                  <Row xs={1}>
                    <Col xs={12}>
                      <span className="fw-bold">Description</span>
                      <p>{description}</p>
                    </Col>
                  </Row>
                  <Row xs={1} sm={3}>
                    <Col>
                      <small className="fw-bold">Federal Waste</small>
                      <p>
                        {waste.epaWaste ? (
                          <FaCheckCircle className="test-success" />
                        ) : (
                          <FaCircleXmark className="text-danger" />
                        )}
                      </p>
                    </Col>
                    <Col>
                      <small className="fw-bold">DOT Haz Material</small>
                      <p>
                        {waste.dotHazardous ? (
                          <FaCheckCircle className="test-success" />
                        ) : (
                          <FaCircleXmark className="text-danger" />
                        )}
                      </p>
                    </Col>
                    <Col>
                      <small className="fw-bold">PCB Waste</small>
                      <p>
                        {waste.pcb ? (
                          <FaCheckCircle className="test-success" />
                        ) : (
                          <FaCircleXmark className="text-danger" />
                        )}
                      </p>
                    </Col>
                  </Row>
                  <Row xs={1}>
                    <Col>
                      <span className="fw-bold">Waste Codes</span>
                      <p>
                        <WasteCodes wasteLine={waste} />
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={4}>
                      <span className="fw-bold">Quantity</span>
                      <p>
                        {waste.quantity.quantity} {waste.quantity.unitOfMeasurement.description}
                      </p>
                    </Col>
                    <Col xs={12} sm={8}>
                      <span className="fw-bold">Container(s)</span>
                      <p>
                        {waste.quantity.containerNumber} {waste.quantity.containerType.description}
                      </p>
                    </Col>
                  </Row>
                  {/*<Table responsive>*/}
                  {/*  <thead>*/}
                  {/*    <tr>*/}
                  {/*      <th>Description</th>*/}
                  {/*      <th>Federal Waste</th>*/}
                  {/*    </tr>*/}
                  {/*  </thead>*/}
                  {/*  <tbody>*/}
                  {/*    <tr>*/}
                  {/*      <td>{description}</td>*/}
                  {/*      <td>*/}
                  {/*      </td>*/}
                  {/*    </tr>*/}
                  {/*  </tbody>*/}
                  {/*</Table>*/}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
    </>
  );
}
