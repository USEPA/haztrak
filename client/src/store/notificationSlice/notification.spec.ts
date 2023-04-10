/**
 * Test for the notification Redux slice
 */
import { cleanup } from '@testing-library/react';
import NotificationReducer, { addMsg, removeMsg } from 'store/notificationSlice/notification.slice';
import { NotificationState } from './notification.slice';

const initialState: NotificationState = {
  notifications: [],
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
    expect(NotificationReducer(initialState, addMsg(alertPayload)).notifications.length).toEqual(1);
  });
  test('removeMsg remove the alert', () => {
    const nonEmptyState: NotificationState = { notifications: [alertPayload] };
    expect(
      NotificationReducer(nonEmptyState, removeMsg(alertPayload)).notifications.length
    ).toEqual(0);
  });
});
