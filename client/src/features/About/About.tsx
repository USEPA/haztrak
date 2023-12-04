import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useTitle } from 'hooks';
import { HtSpinner } from 'components/UI';
import { HaztrakLicense, SectionTitle } from 'components/Help';

/**
 * Static page that talks about Haztrak's licensing, maybe versioning in future
 * @constructor
 * @example "<About/>"
 */
export function About() {
  useTitle('About');
  return (
    <Container fluid className="p-5">
      <SectionTitle title="About" variant="h1" />
      <Row className="content">
        <Col xs={12} md={5} lg={6}>
          <p>
            Haztrak is an an open-source example of how hazardous handlers can interface their waste
            management software with <a href="https://rcrainfo.epa.gov">RCRAInfo</a> to use
            e-Manifest. It illustrates how many of the common task necessary to execute a fully
            electronic manifest can be completed without ever having to login to RCRAInfo via the
            web browser.
          </p>
        </Col>
        <Col xs={12} md={7} lg={6}>
          <p>
            Integration with RCRAInfo and e-Manifest directly benefits the end user and the
            organization.
          </p>
          <ul>
            <li>Up-to-date site information</li>
            <li>Seamless electronic manifest and e-signatures</li>
            <li>Waste stream data analysis for compliance</li>
          </ul>
        </Col>
      </Row>
      <SectionTitle title="Licensing" />
      <p>
        Haztrak It was developed by the United State Environmental Protection Agency (US EPA) under
        the MIT license, a permissive license that lets you modify, redistribute, and use
        commercially as you see fit. If you're thinking about using/forking/etc. Haztrak encourage
        you to read the license, don't worry, it's short:
      </p>
      <HaztrakLicense />
      <p className="pt-4">
        We welcome contribution to the source code, which you can find, along with the contributor's
        guidelines in our git repository on{' '}
        <a href={`${import.meta.env.VITE_GITHUB_URL}`}>GitHub</a>
      </p>
      <p />
    </Container>
  );
}
