import { Manifest } from '~/components/Manifest/manifestSchema';
import { createMockMTNHandler, createMockTransporter } from '~/test-utils/fixtures/mockHandler';
import { createMockWaste } from '~/test-utils/fixtures/mockWaste';

const DEFAULT_MANIFEST: Manifest = {
  manifestTrackingNumber: '123456789ELC',
  import: false,
  status: 'NotAssigned',
  rejection: false,
  // locked: false,
  // containsPreviousRejectOrResidue: false,
  potentialShipDate: '2022-12-14T12:50:12+0000',
  submissionType: 'FullElectronic',
  generator: createMockMTNHandler({ epaSiteId: 'VATESTGEN001' }),
  transporters: [
    { ...createMockTransporter({ order: 1 }) },
    { ...createMockTransporter({ order: 2 }) },
  ],
  designatedFacility: createMockMTNHandler({ epaSiteId: 'VATEST001' }),
  wastes: [{ ...createMockWaste({ lineNumber: 1 }) }, { ...createMockWaste({ lineNumber: 2 }) }],
};

export function createMockManifest(overWrites?: Partial<Manifest>): Manifest {
  return {
    ...DEFAULT_MANIFEST,
    ...overWrites,
  };
}
