import React from "react";
import {Button, Card} from "react-bootstrap";
import {Container} from "react-bootstrap";

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
      <div className="justify-content-end p-3">
      </div>
      <Card className="shadow-lg">
        <Card.Header className="">General Info</Card.Header>
        <Card.Body>
          <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional
            content.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Manifest
