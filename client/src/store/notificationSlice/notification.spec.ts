/**
 * Test for the notification reduc slice
 */
import { cleanup } from '@testing-library/react';
import NotificationReducer, { addMsg, removeMsg } from 'store/notificationSlice/notification.slice';
import { NotificationState } from 'types/store';

const initialState: NotificationState = {
  alert: [],
};

const alertPayload = {
  uniqueId: Date.now() - 1,
  createdDate: new Date().toISOString(),
  read: false,
  alertType: 'Info',
  message: 'Welcome to Haztrak',
  timeout: 5000,
};

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('Notification Slice', () => {
  it('returns the initial state', () => {
    expect(NotificationReducer(undefined, { type: undefined })).toEqual(initialState);
  });
  test('addMsg appends a new message', () => {
    expect(NotificationReducer(initialState, addMsg(alertPayload)).alert.length).toEqual(1);
  });
  test('removeMsg remove the alert', () => {
    const nonEmptyState: NotificationState = { alert: [alertPayload] };
    expect(NotificationReducer(nonEmptyState, removeMsg(alertPayload)).alert.length).toEqual(0);
  });
});
