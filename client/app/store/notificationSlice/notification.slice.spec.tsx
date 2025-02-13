import { describe, expect, test } from 'vitest';
import { renderWithProviders, screen } from '~/mocks';
import { HaztrakAlert, addAlert, removeAlert, useAppSelector } from '~/store';
import reducer, { selectAllAlerts } from './notification.slice';

function TestComponent() {
  const alerts = useAppSelector(selectAllAlerts);
  return (
    <>
      {alerts.map((alert) => (
        <div key={alert.id} data-testid={'test-id'}>
          {alert.message}
        </div>
      ))}
    </>
  );
}

describe('notificationSlice', () => {
  test('initial state is empty', async () => {
    renderWithProviders(<TestComponent />, {
      preloadedState: {
        notifications: {
          tasks: [],
          alerts: [],
        },
      },
    });
    expect(screen.queryAllByTestId('test-id')).toHaveLength(0);
  });
  test('addAlert creates a new alert', () => {
    const previousState = {
      tasks: [],
      alerts: [],
    };
    expect(
      reducer(previousState, addAlert({ id: 'test-id', message: 'test message' })).alerts
    ).toHaveLength(1);
  });
  test('new alert is unread by default', () => {
    const previousState = {
      tasks: [],
      alerts: [],
    };
    const newState = reducer(previousState, addAlert({ id: 'test-id', message: 'test message' }));
    expect(newState.alerts[0].read).toBe(false);
  });
  test('new alert is error by default', () => {
    const previousState = {
      tasks: [],
      alerts: [],
    };
    const newState = reducer(previousState, addAlert({ id: 'test-id', message: 'test message' }));
    expect(newState.alerts[0].type).toBe('error');
  });
  test('removeAlert removes by ID', () => {
    const initialAlert: HaztrakAlert = {
      id: 'test-id',
      message: 'test message',
      read: false,
      type: 'error',
      autoClose: false,
    };
    const previousState = {
      tasks: [],
      alerts: [initialAlert],
    };
    const newState = reducer(previousState, removeAlert({ id: 'test-id' }));
    expect(newState.alerts).toHaveLength(0);
  });
  test('An alert is not added if the ID already exists', () => {
    const initialAlert: HaztrakAlert = {
      id: 'test-id',
      message: 'test message',
      read: false,
      type: 'error',
      autoClose: false,
    };
    const previousState = {
      tasks: [],
      alerts: [initialAlert],
    };
    const newState = reducer(previousState, addAlert({ ...initialAlert }));
    expect(newState.alerts).toHaveLength(1);
  });
});
