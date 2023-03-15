import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { MOCK_HANDLER } from 'test/fixtures';
import QuickerSign from './QuickerSign';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('QuickerSign', () => {
  test('displays the MTN to be signed', () => {
    const manifestTrackingNumbers: Array<string> = ['123456789ELC', '987654321ELC'];
    renderWithProviders(<QuickerSign mtn={manifestTrackingNumbers} mtnHandler={MOCK_HANDLER} />);
    for (const mtn of manifestTrackingNumbers) {
      expect(screen.getByText(mtn)).toBeInTheDocument();
    }
  });
  test('shows what site is signing', () => {
    const manifestTrackingNumbers: Array<string> = ['123456789ELC', '987654321ELC'];
    renderWithProviders(<QuickerSign mtn={manifestTrackingNumbers} mtnHandler={MOCK_HANDLER} />);
    expect(screen.getByText(new RegExp(`${MOCK_HANDLER.epaSiteId}`))).toBeInTheDocument();
  });
});
