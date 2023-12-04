import React from 'react';
import { Card, Container } from 'react-bootstrap';
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
    <Container fluid className="py-4">
      <h1 className="display-5 d-flex justify-content-center">About Us</h1>
      <SectionTitle title="About" variant="h1" />
      <p>
        Haztrak is an an open-source example of how hazardous handlers can interface their waste
        management software with <a href="https://rcrainfo.epa.gov">RCRAInfo</a> to use e-Manifest.
        It illustrates how many of the common task necessary to execute a fully electronic manifest
        can be completed without ever having to login to RCRAInfo via the web browser.
      </p>
      <SectionTitle title="Licensing" />
      <p>
        Haztrak It was developed by the United State Environmental Protection Agency (US EPA) under
        the MIT license. If you're thinking about using/forking/etc. Haztrak encourage you to read
        the license, don't worry, it's short:
      </p>
      <HaztrakLicense />
      <p className="pt-4">
        We welcome contribution to the source code, which you can find, along with the contributor's
        guidelines in our git repository on <a href="https://github.com/USEPA/e-Manifest">GitHub</a>
      </p>
      <p />
    </Container>
  );
}
