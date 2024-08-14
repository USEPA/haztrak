import { HtCard } from 'app/components/legacyUi';
import React, { ReactElement } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import {
  GeneratorStatusAreaChart,
  ManifestCountBarChart,
  ManifestStatusPieChart,
} from '~/components/Charts';
import { useTitle } from '~/hooks';

/** Dashboard page for logged-in user*/
export function Dashboard(): ReactElement {
  useTitle(`Haztrak`, false, true);

  return (
    <Container className="py-2 pt-3">
      <Row xs={1} lg={2}>
        <Col className="my-3">
          <HtCard title="Calculated Status" className="p-2">
            <GeneratorStatusAreaChart />
          </HtCard>
        </Col>
        <Col className="my-3">
          <HtCard title="Manifest by Status" className="p-2">
            <ManifestStatusPieChart />
          </HtCard>
        </Col>
      </Row>
      <Row>
        <Col>
          <HtCard title="Manifest count" className="p-2">
            <ManifestCountBarChart />
          </HtCard>
        </Col>
      </Row>
    </Container>
  );
}
