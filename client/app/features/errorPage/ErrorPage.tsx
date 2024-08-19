import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Error404 } from '~/components/Error';
import { Button, Card, CardContent, CardFooter, CardHeader } from '~/components/ui';

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
    <div className="tw-container tw-p-8">
      <Card>
        <CardHeader />
        <CardContent className="tw-grid tw-justify-center">{renderErrorMessage(code)}</CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Return
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
