import React from 'react';
import { ToastContainer } from 'react-bootstrap';
import { HaztrakToast } from 'components/Notification/HaztrakToast';
import { HaztrakAlert, selectAllAlerts, useAppSelector } from 'store';

export function AlertContainer() {
  const alerts: HaztrakAlert[] = useAppSelector(selectAllAlerts);

  return (
    <ToastContainer position="top-end" className="p-3">
      {alerts.map((alert) => (
        <HaztrakToast key={alert.id} alert={alert} />
      ))}
    </ToastContainer>
  );
}
