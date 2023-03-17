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
  /**
   * User's haztrak username
   */
  user: string | undefined;
  /**
   * The user's API ID for the EPA RCRAInfo/e-Manifest system
   */
  rcraAPIID?: string;
  /**
   * The user's RCRAInfo system username
   */
  rcraUsername?: string;
  /**
   * The user's API key for the EPA RCRAInfo/e-Manifest system.
   * Should never be sent to client, only received from.
   */
  rcraAPIKey?: string;
  /**
   * Array of EPA sites a user has access to in RCRAInfo stored in key-value pairs
   * where the keys are the site's EPA ID number
   */
  epaSites?: Record<string, ProfileEpaSite>;
  phoneNumber?: string;
  loading?: boolean;
  error?: string;
  /**
   * Indicates whether the user is authorized
   */
  apiUser?: boolean;
}

/**
 * The user's site permissions for an EPA site in RCRAInfo, including each the user's
 * permission for each RCRAInfo module
 */
export interface ProfileEpaSite {
  epaId: string;
  permissions: {
    /**
     * Whether the user has 'Site Manager' level access.
     * If true, all other modules should be equal to 'Certifier'
     */
    siteManagement: boolean;
    annualReport: string;
    biennialReport: string;
    eManifest: string;
    /**
     * The RCRAInfo Waste Import Export Tracking System (WIETS)
     */
    WIETS: string;
    myRCRAid: string;
  };
}
