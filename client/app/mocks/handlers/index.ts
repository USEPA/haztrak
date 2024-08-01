import { mockUserEndpoints } from '~/mocks/handlers/mockUserEndpoints';
import { mockSiteEndpoints } from '~/mocks/handlers/mockSiteEndpoints';
import { mockWasteEndpoints } from '~/mocks/handlers/mockWasteEndpoints';
import { mockManifestEndpoints } from '~/mocks/handlers/mockManifestEndpoints';

const handlers = {
  ...mockManifestEndpoints,
  ...mockUserEndpoints,
  ...mockSiteEndpoints,
  ...mockWasteEndpoints,
};

export {
  mockWasteEndpoints,
  mockManifestEndpoints,
  mockSiteEndpoints,
  mockUserEndpoints,
  handlers,
};
