import { Handler } from './Handler';

/**
 *  The Site type encapsulates the Handler model as well as other details specific to
 *  that hazardous waste site.
 *
 *  @description
 *  The Site type encapsulates the Handler model as well as other details specific to
 *  that hazardous waste site. It is not directly associated with the EPA RCRAInfo system
 *  directly and can be extended as needed. For example, Haztrak users are given permission to
 *  sites, not Handlers.
 */
export interface Site {
  name: string;
  handler: Handler;
  // This model can be extended to include 'waste streams' or non-RCRAInfo relevant info
}
