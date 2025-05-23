import { fireEvent } from '@testing-library/react';
import { MtnDetails, MtnTable } from '~/components/Mtn';

import { describe, expect, test } from 'vitest';
import { renderWithProviders, screen } from '~/mocks';

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
  test('filters', async () => {
    const zeroMtn = '000000000ELC';
    const oneMtn = '111111111ELC';
    const mtnData = [
      createMockMtnDetails({ manifestTrackingNumber: zeroMtn }),
      createMockMtnDetails({ manifestTrackingNumber: oneMtn }),
    ];
    renderWithProviders(<MtnTable manifests={mtnData} />);
    const filterInput = screen.getByPlaceholderText<HTMLInputElement>('search...');
    fireEvent.change(filterInput, { target: { value: '00000' } });
    expect(await screen.queryByText(oneMtn)).toBeNull();
    expect(await screen.queryByText(zeroMtn)).not.toBeNull();
  });
});
