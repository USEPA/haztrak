import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { createMockHandler } from 'test-utils/fixtures';
import QuickerSign from './QuickerSign';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('QuickerSign', () => {
  test('displays the MTN to be signed', () => {
    const manifestTrackingNumbers: Array<string> = ['123456789ELC', '987654321ELC'];
    const handler = createMockHandler();
    renderWithProviders(<QuickerSign mtn={manifestTrackingNumbers} mtnHandler={handler} />);
    for (const mtn of manifestTrackingNumbers) {
      expect(screen.getByText(mtn)).toBeInTheDocument();
    }
  });
  test('shows what site is signing', () => {
    const manifestTrackingNumbers: Array<string> = ['123456789ELC', '987654321ELC'];
    const handler = createMockHandler();
    renderWithProviders(<QuickerSign mtn={manifestTrackingNumbers} mtnHandler={handler} />);
    expect(screen.getByText(new RegExp(`${handler.epaSiteId}`))).toBeInTheDocument();
  });
});
