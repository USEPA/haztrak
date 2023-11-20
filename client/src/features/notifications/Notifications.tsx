import { HtCard } from 'components/Ht';
import { useTitle } from 'hooks';
import React from 'react';
import { Col, Container } from 'react-bootstrap';

/**
 * Table showing the user's current notifications
 * @constructor
 */
export function Notifications() {
  useTitle('Notifications');

  return (
    <>
      <Container className="py-2">
        <Col>
          <HtCard>
            <HtCard.Header title="Notifications"></HtCard.Header>
            <HtCard.Body></HtCard.Body>
          </HtCard>
        </Col>
      </Container>
    </>
  );
}
