import React from "react";
import {Container} from "react-bootstrap";
import Stamp from "../components/cards/Stamp";

const Home = props => {
  return (
    <Container fluid>
      <h1 className="mt-4">Dashboard</h1>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">Breadcrumbs</li>
        <li className="breadcrumb-item active">Dashboard</li>
      </ol>
      <Container className="row">
        <Container className="col">
          <Stamp title="In Transit" color="primary">
            Mambo number 5
          </Stamp>
        </Container>
        <Container className="col">
          <Stamp title="Title" color="success">
            hello text inside stamp tags
          </Stamp>
        </Container>
      </Container>
    </Container>
  )
}

export default Home
