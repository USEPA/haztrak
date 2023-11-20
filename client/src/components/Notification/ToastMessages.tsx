import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { HaztrakError, selectAllErrors, useAppSelector } from 'store';

export function ToastMessages() {
  const errors: HaztrakError[] = useAppSelector(selectAllErrors);
  console.log('errors', errors);

  return (
    <ToastContainer position="top-end" className="p-3">
      {errors.map((error, index) => (
        <Toast autohide={true} delay={3000} key={index}>
          <Toast.Header>
            <strong className="me-auto">Haztrak</strong>
          </Toast.Header>
          <Toast.Body>
            <div>{error.message}</div>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
