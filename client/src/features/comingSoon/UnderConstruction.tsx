import underConstruction from '/static/under-construction.png';
import { HtCard } from 'components/Ht';
import { useTitle } from 'hooks';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Static page that talks about Haztrak's licensing, maybe versioning in future
 * @constructor
 * @example "<About/>"
 */
export function UnderConstruction() {
  useTitle('Under Construction');
  return (
    <Container fluid className="text-lg-center py-4">
      <Card bg={'warning'}>
        <HtCard.Body>
          <Card.Title>
            <h1 className="fw-bold">Under Construction!</h1>
          </Card.Title>
          <Col>
            <Row>
              <Col className="d-flex justify-content-center">
                <div className="rounded-circle bg-light p-5">
                  <img
                    src={underConstruction}
                    alt="under construction sign"
                    width={200}
                    height={'auto'}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <h5 className="d-flex justify-content-center">
                Looks like you've found something we haven't completed yet.
              </h5>
              <h5 className="d-flex justify-content-center">Don't worry, we're working on it.</h5>
              <p>
                If you'd like to show your interest for this feature,{' '}
                <Link to={'https://github.com/USEPA/haztrak/issues'} target="_blank">
                  let us know on our issue tracker
                </Link>{' '}
                by commenting on an existing issue or opening a new one.
              </p>
            </Row>
          </Col>
        </HtCard.Body>
      </Card>
    </Container>
  );
}
