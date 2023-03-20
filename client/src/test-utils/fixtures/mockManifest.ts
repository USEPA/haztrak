import { Manifest } from 'types/manifest';
import { createMockHandler, createMockTransporter } from 'test-utils/fixtures/mockHandler';
import { createMockWaste } from 'test-utils/fixtures/mockWaste';

export const DEFAULT_MANIFEST: Manifest = {
  manifestTrackingNumber: '123456789ELC',
  import: false,
  status: 'NotAssigned',
  rejection: false,
  locked: false,
  containsPreviousRejectOrResidue: false,
  potentialShipDate: '2022-12-14T12:50:12+0000',
  generator: createMockHandler(),
  transporters: [{ ...createMockTransporter() }, { ...createMockTransporter({ order: 2 }) }],
  designatedFacility: createMockHandler(),
  wastes: [{ ...createMockWaste({ lineNumber: 1 }) }, { ...createMockWaste({ lineNumber: 2 }) }],
};

export function createMockManifest(overWrites?: Partial<Manifest>): Manifest {
  return {
    ...DEFAULT_MANIFEST,
    ...overWrites,
  };
}
