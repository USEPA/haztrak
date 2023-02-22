import '@testing-library/jest-dom';
import MtnTable from 'components/MtnTable/index';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { MtnDetails } from 'types/Manifest/Manifest';

const manifestDetail: MtnDetails = {
  manifestTrackingNumber: '123456789ELC',
  status: 'InTransit',
};

const mtnData = [manifestDetail, manifestDetail];

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('MtnTable', () => {
  test('renders', async () => {
    renderWithProviders(<MtnTable manifests={mtnData} />);
    expect(await screen.findAllByText(manifestDetail.manifestTrackingNumber)).toHaveLength(2);
  });
});
