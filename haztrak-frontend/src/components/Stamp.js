import React from "react";
import {Card} from "react-bootstrap";

const Stamp = (props) => {
  return (
    <div className={`ps-2 bg-${props.color} bg-gradient rounded`}>
      <Card className="shadow-lg order-bottom rounded-0 rounded-end">
        <Card.Body>
          <p className="h3">{props.title}</p>
          {props.children}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Stamp
