import { Manifest } from 'types';
import { MOCK_HANDLER } from 'test/fixtures/mockHandler';
import { MOCK_WASTE } from 'test/fixtures/mockWaste';

export const MOCK_MTN = '123456789ELC';

export const MOCK_MANIFEST: Manifest = {
  manifestTrackingNumber: MOCK_MTN,
  import: false,
  status: 'NotAssigned',
  rejection: false,
  locked: false,
  containsPreviousRejectOrResidue: false,
  potentialShipDate: '2022-12-14T12:50:12+0000',
  generator: MOCK_HANDLER,
  transporters: [
    { ...MOCK_HANDLER, order: 1 },
    { ...MOCK_HANDLER, order: 2 },
  ],
  designatedFacility: MOCK_HANDLER,
  wastes: [
    { ...MOCK_WASTE, lineNumber: 1 },
    { ...MOCK_WASTE, lineNumber: 2 },
  ],
};

export const MOCK_MANIFESTS_ARRAY = [MOCK_MANIFEST, MOCK_MANIFEST];
