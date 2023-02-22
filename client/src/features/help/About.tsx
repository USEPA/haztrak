import React from 'react';
import { Card, Container } from 'react-bootstrap';
import useTitle from 'hooks/useTitle';

/**
 * Static page that talks about Haztrak's licensing, maybe versioning in future
 * @constructor
 * @example "<About/>"
 */
function About() {
  useTitle('Help');
  return (
    <Container fluid className="text-lg-center py-4">
      <h1>Welcome to Haztrak!</h1>
      <p>
        Haztrak is an an open-source example of how hazardous handlers can interface their waste
        management software with <a href="https://rcrainfo.epa.gov">RCRAInfo</a> to use e-Manifest.
        It illustrates how many of the common task necessary to execute a fully electronic manifest
        can be completed without ever having to login to RCRAInfo via the web browser.
      </p>
      <p>
        Haztrak It was developed by the United State Environmental Protection Agency (US EPA) under
        the MIT license. If you're thinking about using/forking/etc. Haztrak encourage you to read
        the license, don't worry, it's short:
      </p>
      <Card className="shadow-lg mx-5 my-3 bg-white p-2">
        <Card.Body>
          <div className="d-flex flex-column text-muted">
            <p className="text-start">MIT License</p>
            <p className="text-start">Copyright (c) 2022 U.S. Environmental Protection Agency</p>
            <p className="text-start">
              Permission is hereby granted, free of charge, to any person obtaining a copy of this
              software and associated documentation files (the "Software"), to deal in the Software
              without restriction, including without limitation the rights to use, copy, modify,
              merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
              permit persons to whom the Software is furnished to do so, subject to the following
              conditions:
            </p>
            <p className="text-start">
              The above copyright notice and this permission notice shall be included in all copies
              or substantial portions of the Software.
            </p>
            <p className="text-start">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
              CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
              OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </div>
        </Card.Body>
      </Card>
      <p className="pt-4">
        We welcome contribution to the source code, which you can find, along with the contributor's
        guidelines in our git repository on <a href="https://github.com/USEPA/e-Manifest">GitHub</a>
      </p>
      <p />
    </Container>
  );
}

export default About;
