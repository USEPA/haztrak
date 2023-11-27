import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faCircleQuestion,
  faFileLines,
  faFolderOpen,
  faInfo,
  faLocationArrow,
  faLocationDot,
  faNetworkWired,
  faRecycle,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement } from 'react';

export interface Route {
  id: string;
  icon: ReactElement;
  text: string;
  url: string;
  description?: string;
}

export interface RoutesSection {
  name: string;
  id: string;
  icon: ReactElement;
  routes: Route[];
}

export const routes: Array<Route | RoutesSection> = [
  {
    id: 'Dashboard',
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="text-primary" size="lg" />,
    text: 'Dashboard',
    url: '/',
  },
  {
    name: 'sites',
    id: 'sitesSection',
    icon: <FontAwesomeIcon icon={faLocationArrow} size="lg" className="me-2 text-primary" />,
    routes: [
      {
        id: 'mySites',
        icon: <FontAwesomeIcon icon={faLocationDot} className="me-2 text-primary" size="lg" />,
        text: 'My Sites',
        url: '/site',
      },
      {
        id: 'rcraInfo',
        icon: <FontAwesomeIcon icon={faRecycle} className="text-primary" size="lg" />,
        text: 'RCRAInfo',
        url: 'https://rcrainfopreprod.epa.gov',
        description: 'RCRAInfo',
      },
    ],
  },
  {
    name: 'Manifests',
    id: 'manifestsSection',
    icon: <FontAwesomeIcon icon={faFileLines} size="lg" className="text-primary me-2" />,
    routes: [
      {
        id: 'My Manifests',
        icon: <FontAwesomeIcon icon={faFolderOpen} className="text-primary" size="lg" />,
        text: 'My Manifests',
        url: '/manifest',
        description: 'All hazardous waste manifest',
      },
    ],
  },
  {
    name: 'Help',
    id: 'helpSection',
    icon: <FontAwesomeIcon icon={faInfo} size="lg" className="text-primary me-2" />,
    routes: [
      {
        id: 'About',
        icon: <FontAwesomeIcon icon={faCircleQuestion} className="text-primary" size="lg" />,
        text: 'About',
        url: '/about',
        description: 'About Haztrak',
      },
      {
        id: 'openApi',
        icon: <FontAwesomeIcon icon={faNetworkWired} className="text-primary" size="lg" />,
        text: 'OpenAPI Docs',
        url: `${import.meta.env.VITE_HT_API_URL}/api/schema/swagger-ui`,
        description: 'API Documentation',
      },
      {
        id: 'reportAnIssue',
        icon: <FontAwesomeIcon icon={faGithub} className="text-primary" size="lg" />,
        text: 'Report an Issue',
        url: 'https://github.com/USEPA/haztrak/issues',
        description: 'API Documentation',
      },
    ],
  },
];
