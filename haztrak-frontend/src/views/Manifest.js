import React from "react";
import {Button, Card, Container} from "react-bootstrap";

const Manifest = () => {

  return (
    <Container className="p-4">
      <Container
        className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">MTN</h1>
        <div>
          <Button
            className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm">
            <i className="fa-solid fa-floppy-disk pe-2"></i>
            Save
          </Button>
        </div>
      </Container>
      <General/>
    </Container>
  )
}

const General = () => {
  return (
    <Card className="shadow-lg">
      <Card.Header className="bg-primary">
        General Information
      </Card.Header>
      <Card.Body>
        hello there
      </Card.Body>
    </Card>
  )
}
Manifest.General = General;


export default Manifest
