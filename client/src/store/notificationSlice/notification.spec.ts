/**
 * Test for the notification Redux slice
 */
import { cleanup } from '@testing-library/react';
import NotificationReducer, {
  addNotification,
  removeNotification,
} from 'store/notificationSlice/notification.slice';
import { NotificationState } from './notification.slice';

const initialState: NotificationState = {
  notifications: [],
};

const alertPayload = {
  uniqueId: Date.now() - 1,
  createdDate: new Date().toISOString(),
  read: false,
  status: 'Error' as const,
  message: 'Welcome to Haztrak',
  timeout: 5000,
};

afterEach(() => {
  cleanup();
});

describe('Notification Slice', () => {
  it('returns the initial state', () => {
    expect(NotificationReducer(undefined, { type: undefined })).toEqual(initialState);
  });
  test('addNotification appends a new message', () => {
    expect(
      NotificationReducer(initialState, addNotification(alertPayload)).notifications.length
    ).toEqual(1);
  });
  test('removeNotification remove the alert', () => {
    const nonEmptyState: NotificationState = { notifications: [alertPayload] };
    expect(
      NotificationReducer(nonEmptyState, removeNotification(alertPayload)).notifications.length
    ).toEqual(0);
  });
});
