import { HtSpinner } from 'components/Ht';
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useGetTaskStatusQuery } from 'store/task.slice';

interface UpdateRcraProps {
  taskId: string;
}

export function UpdateRcra({ taskId }: UpdateRcraProps) {
  const [showToast, setShowToast] = React.useState(true);

  const { data, isLoading, error } = useGetTaskStatusQuery(taskId, {
    pollingInterval: 3000,
  });

  if (data?.result) {
    const resp = JSON.parse(data?.result);
    return <Navigate to={`/manifest/${resp.manifestTrackingNumber}/view`} />;
  }

  if (error) {
    return (
      <ToastContainer position="top-end" style={{ zIndex: 1 }} className={'p-3'}>
        <Toast bg="danger" onClose={() => setShowToast(false)} show={showToast}>
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>
            {/*@ts-ignore*/}
            <p>{error.statusText}</p>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    );
  }
  // if (isLoading || !data || !results) {
  if (isLoading) {
    return (
      <div className="overlay-spinner">
        <HtSpinner className="text-light" size="5x" />
      </div>
    );
  }
}
