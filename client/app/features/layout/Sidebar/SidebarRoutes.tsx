import { LuFactory, LuFileCode2, LuHelpCircle } from 'react-icons/lu';
import { IconType } from 'react-icons';
import { TbBinaryTree } from 'react-icons/tb';
import { RiGovernmentFill } from 'react-icons/ri';
import { IoIosDocument } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';

export interface Route {
  id: string;
  icon: IconType;
  text: string;
  url: string;
  description?: string;
  external?: boolean;
}

export interface RoutesSection {
  name: string;
  id: string;
  icon?: IconType;
  routes: Route[];
}

export const routes: (Route | RoutesSection)[] = [
  {
    id: 'Dashboard',
    icon: TbBinaryTree,
    text: 'Dashboard',
    url: '/',
  },
  {
    name: 'Site',
    id: 'sitesSection',
    routes: [
      {
        id: 'mySites',
        icon: LuFactory,
        text: 'My Sites',
        url: '/site',
      },
      {
        id: 'rcraInfo',
        icon: RiGovernmentFill,
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
        icon: IoIosDocument,
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
        icon: LuHelpCircle,
        text: 'About',
        url: '/about',
        description: 'About Haztrak',
      },
      {
        id: 'openApi',
        icon: LuFileCode2,
        text: 'OpenAPI Docs',
        url: `${import.meta.env.VITE_HT_API_URL}/api/schema/swagger-ui`,
        description: 'API Documentation',
        external: true,
      },
      {
        id: 'reportAnIssue',
        icon: FaGithub,
        text: 'Report an Issue',
        url: `${import.meta.env.VITE_GITHUB_URL}/issues`,
        description: 'API Documentation',
        external: true,
      },
    ],
  },
];
