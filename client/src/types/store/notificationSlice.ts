export interface NotificationState {
  alert: Array<Alert>;
}

/**
 * Alert describes the payload used to interact with the Redux store 'notification' slice.
 */
export interface Alert {
  uniqueId: number;
  createdDate: string;
  read: boolean;
  message: string;
  alertType: 'Warning' | 'Error' | 'Info' | String;
  timeout: number;
}
