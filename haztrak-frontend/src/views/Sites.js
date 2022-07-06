import React from "react";
import {Col, Container} from "react-bootstrap";
import HtCard from "../components/HtCard";

const Sites = () => {
  return (
    <Container fluid>
      <Col xs sm md lg="11" xl="10" xxl="9"
           className="justify-content-center">
        <HtCard>
          <HtCard.Header color="">
            hello
          </HtCard.Header>
          <HtCard.Body>
            hello again
          </HtCard.Body>
        </HtCard>
      </Col>
    </Container>
  )
}

export default Sites
