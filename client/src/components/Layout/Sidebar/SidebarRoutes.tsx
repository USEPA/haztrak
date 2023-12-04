import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faCircleQuestion,
  faFileLines,
  faLocationDot,
  faNetworkWired,
  faRecycle,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';

export interface Route {
  id: string;
  icon: IconProp;
  text: string;
  url: string;
  description?: string;
  external?: boolean;
}

export interface RoutesSection {
  name: string;
  id: string;
  icon?: IconProp;
  routes: Route[];
}

export const routes: Array<Route | RoutesSection> = [
  {
    id: 'Dashboard',
    icon: faTachometerAlt,
    text: 'Dashboard',
    url: '/',
  },
  {
    name: 'Site',
    id: 'sitesSection',
    routes: [
      {
        id: 'mySites',
        icon: faLocationDot,
        text: 'My Sites',
        url: '/site',
      },
      {
        id: 'rcraInfo',
        icon: faRecycle,
        text: 'RCRAInfo',
        url: import.meta.env.DEV ? 'https://rcrainfopreprod.epa.gov' : 'https://rcrainfo.epa.gov',
        description: 'RCRAInfo',
        external: true,
      },
    ],
  },
  {
    name: 'Manifest',
    id: 'manifestsSection',
    routes: [
      {
        id: 'My Manifests',
        icon: faFileLines,
        text: 'My Manifests',
        url: '/manifest',
        description: 'All hazardous waste manifest',
      },
    ],
  },
  {
    name: 'Help',
    id: 'helpSection',
    routes: [
      {
        id: 'About',
        icon: faCircleQuestion,
        text: 'About',
        url: '/about',
        description: 'About Haztrak',
      },
      {
        id: 'openApi',
        icon: faNetworkWired,
        text: 'OpenAPI Docs',
        url: `${import.meta.env.VITE_HT_API_URL}/api/schema/swagger-ui`,
        description: 'API Documentation',
        external: true,
      },
      {
        id: 'reportAnIssue',
        icon: faGithub,
        text: 'Report an Issue',
        url: `${import.meta.env.VITE_GITHUB_URL}/issues`,
        description: 'API Documentation',
        external: true,
      },
    ],
  },
];
