/**
 * The Redux stored information on the current haztrak user
 */
export interface UserState {
  user?: string;
  token?: string;
  loading?: boolean;
  error?: string;
}

/**
 * Schema of a user's alerts stored in the Redux store
 * Note, we don't store these in the back end database, this is just for looks.
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
 * The user's RCRAInfo account data stored in the Redux store
 */
export interface RcraProfileState {
  user: string | undefined;
  rcraAPIID?: string;
  rcraUsername?: string;
  rcraAPIKey?: string;
  epaSites?: Record<string, ProfileEpaSite>;
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
}

/**
 * The user's site permissions for an EPA site in RCRAInfo
 */
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
