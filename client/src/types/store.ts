/**
 * The stored information on the current haztrak user
 */
export interface UserState {
  user: string | undefined;
  token: string | undefined;
  rcraAPIID?: string;
  rcraAPIKey?: string;
  rcraUsername?: string;
  epaSites?: string[];
  phoneNumber?: string;
  email?: string;
  loading: boolean;
  error?: string | undefined;
}

/**
 * Encompasses all global notifications
 */
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
