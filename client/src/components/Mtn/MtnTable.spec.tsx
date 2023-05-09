import '@testing-library/jest-dom';
import { Manifest } from 'components/Manifest';
import { MtnTable } from 'components/Mtn';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { MtnDetails } from 'components/Mtn';

const DEFAULT_MTN_DETAILS: MtnDetails = {
  manifestTrackingNumber: '123456789ELC',
  status: 'InTransit',
  submissionType: 'FullElectronic',
  signatureStatus: false,
};

export function createMockMtnDetails(overWrites?: Partial<MtnDetails>): MtnDetails {
  return {
    ...DEFAULT_MTN_DETAILS,
    ...overWrites,
  };
}

describe('MtnTable', () => {
  test('renders', async () => {
    const mtnData = [createMockMtnDetails(), createMockMtnDetails()];
    renderWithProviders(<MtnTable manifests={mtnData} />);
    expect(await screen.findAllByText(DEFAULT_MTN_DETAILS.manifestTrackingNumber)).toHaveLength(2);
  });
});
