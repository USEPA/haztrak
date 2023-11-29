import { manifest } from 'services/manifest/manifest';
import {
  createMockManifest,
  createMockMTNHandler,
  createMockTransporter,
} from 'test-utils/fixtures';
import { describe, expect, test } from 'vitest';

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
    expect(result).toBe(mockId);
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
    expect(result).toBe(mockId);
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
    expect(result).toBe(mockId);
  });
  test.each(['NotAssigned', 'Pending', 'Corrected', 'Signed', 'UnderCorrection'])(
    `returns undefined if status is %s`,
    (status: string) => {
      const mockManifest = createMockManifest({
        // @ts-ignore
        status,
      });
      const result = manifest.getNextSigner(mockManifest);
      expect(result).toBe(undefined);
    }
  );
});
