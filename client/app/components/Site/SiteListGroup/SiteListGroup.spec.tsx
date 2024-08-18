import { screen } from '@testing-library/react';

import { cleanup, renderWithProviders } from '~/mocks';
import { afterEach, describe, expect, test } from 'vitest';
import { SiteListGroup } from '~/components/Site/SiteListGroup/SiteListGroup';
import { createMockHandler, createMockSite } from '~/mocks/fixtures/mockHandler';

afterEach(() => {
  cleanup();
});

const mySite1 = createMockSite();
const mySite2 = createMockSite({
  name: 'My Second Site',
  handler: createMockHandler({ epaSiteId: 'TXD0192837465' }),
});

const mockSites = [mySite1, mySite2];

describe('SiteListGroup', () => {
  test('renders a list containing site names', () => {
    renderWithProviders(<SiteListGroup sites={mockSites} />);
    expect(screen.getByText(mySite1.name)).toBeInTheDocument();
    expect(screen.getByText(mySite2.name)).toBeInTheDocument();
  });
});
