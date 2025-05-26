import { mockManifestEndpoints } from '~/mocks/handlers/mockManifestEndpoints';
import { mockSiteEndpoints } from '~/mocks/handlers/mockSiteEndpoints';
import { mockUserEndpoints } from '~/mocks/handlers/mockUserEndpoints';
import { mockWasteEndpoints } from '~/mocks/handlers/mockWasteEndpoints';

const handlers = [
  ...mockManifestEndpoints,
  ...mockUserEndpoints,
  ...mockSiteEndpoints,
  ...mockWasteEndpoints,
];

export {
  mockWasteEndpoints,
  mockManifestEndpoints,
  mockSiteEndpoints,
  mockUserEndpoints,
  handlers,
};
