import { QuickerSignForm } from '~/components/Manifest/QuickerSign';

import { cleanup, renderWithProviders, screen } from '~/mocks';
import { createMockMTNHandler } from '~/mocks/fixtures';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('QuickerSignForm', () => {
  test('displays the MTN to be signed', () => {
    const manifestTrackingNumbers: string[] = ['123456789ELC', '987654321ELC'];
    const handler = createMockMTNHandler();
    renderWithProviders(
      <QuickerSignForm mtn={manifestTrackingNumbers} mtnHandler={handler} siteType={'Generator'} />
    );
    for (const mtn of manifestTrackingNumbers) {
      expect(screen.getByText(mtn)).toBeInTheDocument();
    }
  });
  test('shows what site is signing', () => {
    const manifestTrackingNumbers: string[] = ['123456789ELC', '987654321ELC'];
    const handler = createMockMTNHandler();
    renderWithProviders(
      <QuickerSignForm mtn={manifestTrackingNumbers} mtnHandler={handler} siteType={'Generator'} />
    );
    expect(screen.getByText(new RegExp(`${handler.epaSiteId}`))).toBeInTheDocument();
  });
});
