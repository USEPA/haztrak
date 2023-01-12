/**
 * The stored information on the current haztrak user
 */
export interface UserState {
  user?: string;
  token?: string;
  loading?: boolean;
  error?: string;
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

/**
 * The stored information on the current haztrak user
 */
export interface RcraProfileState {
  user: string | undefined;
  rcraAPIID?: string;
  rcraAPIKey?: string;
  rcraUsername?: string;
  epaSites?: Array<ProfileEpaSite>;
  // sites?: string[];
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
}

export interface ProfileEpaSite {
  epaId: string;
  permissions: {
    siteManagement: boolean;
    annualReport: string;
    biennialReport: string;
    eManifest: string;
    WIETS: string;
    myRCRAid: string;
  };
}
