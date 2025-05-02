import { describe, expect, test } from 'vitest';
import { ManifestStatus } from '~/components/Manifest/manifestSchema';
import {
  createMockHaztrakUser,
  createMockMTNHandler,
  createMockManifest,
  createMockSite,
  createMockTransporter,
} from '~/mocks/fixtures';
import { manifest } from '~/services/manifest/manifest';
import { ProfileSlice } from '~/store';

describe('manifest.getNextSigner', () => {
  test('returns the the generator if scheduled and no generator signature present', () => {
    // Arrange
    const mockId = 'VATESTGEN001';
    const generator = createMockMTNHandler({
      epaSiteId: mockId,
      electronicSignaturesInfo: [],
      siteType: 'Generator',
    });
    const mockManifest = createMockManifest({
      status: 'Scheduled',
      generator,
    });
    // Act
    const result = manifest.getNextSigner(mockManifest);
    // Assert
    expect(result?.epaSiteId).toBe(mockId);
  });
  test('returns the TSDF if ReadyForSignature', () => {
    const mockId = 'VATESTTSDF001';
    const designatedFacility = createMockMTNHandler({
      epaSiteId: mockId,
      electronicSignaturesInfo: [],
      siteType: 'Tsdf',
    });
    const mockManifest = createMockManifest({
      status: 'ReadyForSignature',
      designatedFacility,
    });
    const result = manifest.getNextSigner(mockManifest);
    expect(result?.epaSiteId).toBe(mockId);
  });
  test('returns the first transporter if "Scheduled" status and generator signed', () => {
    const mockId = 'VATESTTRANS1';
    const mockTransporter = createMockTransporter({
      epaSiteId: mockId,
      electronicSignaturesInfo: [],
      siteType: 'Transporter',
    });
    const generator = createMockMTNHandler({
      epaSiteId: mockId,
      electronicSignaturesInfo: [
        {
          signer: { firstName: 'John', lastName: 'Doe', contactType: 'Email' },
        },
      ],
      siteType: 'Generator',
    });
    const mockManifest = createMockManifest({
      status: 'Scheduled',
      transporters: [mockTransporter],
      generator,
    });
    const result = manifest.getNextSigner(mockManifest);
    expect(result?.epaSiteId).toBe(mockId);
  });
  test.each([
    'NotAssigned',
    'Pending',
    'Corrected',
    'Signed',
    'UnderCorrection',
  ] as ManifestStatus[])(`returns undefined if status is %s`, (status: ManifestStatus) => {
    const mockManifest = createMockManifest({
      status,
    });
    const result = manifest.getNextSigner(mockManifest);
    expect(result).toBe(undefined);
  });
  test('getStatusOptions returns pending and NotAssigned', () => {
    const mockManifest = createMockManifest({
      status: 'NotAssigned',
    });
    const mockHaztrakSite = createMockSite();
    const profile: ProfileSlice = {
      user: createMockHaztrakUser({ id: 'testuser1' }),
      sites: {
        [mockHaztrakSite.handler.epaSiteId]: {
          ...mockHaztrakSite,
          permissions: { eManifest: 'signer' },
        },
      },
    };
    const options = manifest.getStatusOptions({ manifest: mockManifest, profile });
    expect(options).toEqual(['NotAssigned', 'Pending']);
  });
  test('getStatusOptions includes Scheduled if user has access to the TSDF', () => {
    const mockHaztrakSite = createMockSite();
    const profile: ProfileSlice = {
      user: createMockHaztrakUser({ id: 'testuser1' }),
      sites: {
        [mockHaztrakSite.handler.epaSiteId]: {
          ...mockHaztrakSite,
          permissions: { eManifest: 'signer' },
        },
      },
    };
    const mockManifest = createMockManifest({
      status: 'NotAssigned',
      designatedFacility: mockHaztrakSite.handler,
    });
    const options = manifest.getStatusOptions({ manifest: mockManifest, profile });
    expect(options).toEqual(['NotAssigned', 'Pending', 'Scheduled']);
  });
});
