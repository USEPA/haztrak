import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';
import { HaztrakAlert } from 'store';
import { AlertType } from 'store/alertSlice/alert.slice';

interface HaztrakToastProps {
  alert: HaztrakAlert;
}

const mapAlertTypeToBg = (type: AlertType) => {
  switch (type.toLowerCase()) {
    case 'error':
      return 'danger';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'info':
      return 'light';
    default:
      return 'light';
  }
};

export function HaztrakToast({ alert }: HaztrakToastProps) {
  const [show, setShow] = useState(!alert.read);
  const handleClose = () => {
    setShow(false);
  };

  const bg = mapAlertTypeToBg(alert.type);

  return (
    <Toast
      autohide={true}
      delay={alert.timeout}
      key={alert.id}
      bg={bg}
      show={show}
      onClose={handleClose}
      onClick={handleClose}
    >
      <Toast.Body>
        <span>
          <b></b>
        </span>
        <div>{alert.message}</div>
      </Toast.Body>
    </Toast>
  );
}
