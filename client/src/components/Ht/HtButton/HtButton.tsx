import React from 'react';
import { Button, ButtonProps, Col } from 'react-bootstrap';

interface HtButtonProps extends ButtonProps {
  align?: 'start' | 'center' | 'end';
}

/**
 * This little helper just adds a centered button that executes what function you pass.
 * I just got sick of the repetition because I have this button in a lot of places
 * It defaults to 'primary' variant and centered. use align="start|end|center"
 * to easily control alignment
 * @constructor
 */
function HtButton(props: HtButtonProps) {
  const align = props.align || 'center';
  return (
    <Col className={`text-${align}`}>
      <Button variant="primary" {...props}>
        {props.children}
      </Button>
    </Col>
  );
}

export default HtButton;
