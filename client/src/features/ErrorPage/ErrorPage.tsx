import { Error404 } from 'components/Error';
import { HtCard } from 'components/UI';
import React, { ReactElement } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  code?: number;
}

const renderErrorMessage = (code: number | undefined): ReactElement => {
  switch (code) {
    case 404:
      return <Error404 />;
    default:
      return <Error404 />;
  }
};

// ToDo: add error handling for other codes and integrate with Redux store
export const ErrorPage = ({ code }: ErrorPageProps) => {
  const navigate = useNavigate();
  return (
    <Container>
      <HtCard>
        <HtCard.Body className="d-grid justify-content-center">
          {renderErrorMessage(code)}
        </HtCard.Body>
        <HtCard.Footer>
          <Button onClick={() => navigate(-1)}>Return</Button>
        </HtCard.Footer>
      </HtCard>
    </Container>
  );
};
