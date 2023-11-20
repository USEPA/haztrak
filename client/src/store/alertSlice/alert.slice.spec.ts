/**
 * Test for the notification Redux slice
 */
import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import alterReducers, {
  addAlert,
  AlertSlice,
  HaztrakAlert,
  removeAlert,
} from 'store/alertSlice/alert.slice';

const initialState: AlertSlice = {
  alerts: [],
};

const alertPayload: HaztrakAlert = {
  id: Date.now().toString(),
  createdDate: new Date().toISOString(),
  read: false,
  type: 'Error' as const,
  message: 'Welcome to Haztrak',
  timeout: 5000,
};

afterEach(() => {
  cleanup();
});

describe('alertSlice', () => {
  test('returns the initial state', () => {
    expect(alterReducers(undefined, { type: undefined })).toEqual(initialState);
  });
  test('addAlert appends a new message', () => {
    expect(alterReducers(initialState, addAlert(alertPayload)).alerts.length).toEqual(1);
  });
  test('removeAlert remove the alert', () => {
    const nonEmptyState: AlertSlice = { alerts: [alertPayload] };
    expect(alterReducers(nonEmptyState, removeAlert(alertPayload)).alerts.length).toEqual(0);
  });
});
