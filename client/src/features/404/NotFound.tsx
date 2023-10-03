import happyRobot from '/static/robot-bad-sign.jpg';
import { HtCard } from 'components/Ht';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <HtCard>
      <HtCard.Header title="Page not found" />
      <HtCard.Body className="d-grid justify-content-center">
        <img src={happyRobot} alt="happy robot" width={200} height={'auto'} />
        <h1 className="display-1 d-flex justify-content-center">404</h1>
        <h4>Resource not found</h4>
      </HtCard.Body>
      <HtCard.Footer>
        <Button onClick={() => navigate(-1)}>Return</Button>
      </HtCard.Footer>
    </HtCard>
  );
};
