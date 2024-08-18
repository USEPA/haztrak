import { screen } from '@testing-library/react';
import React from 'react';
import { cleanup, renderWithProviders } from '~/mocks';
import { afterEach, describe, expect, test } from 'vitest';
import { createMockSite } from '~/mocks/fixtures/mockHandler';
import { SiteListItem } from './SiteListItem';

afterEach(() => {
  cleanup();
});

const mySite1 = createMockSite();

describe('SiteListItem', () => {
  test('renders a site name and EPA ID', () => {
    renderWithProviders(<SiteListItem site={mySite1} />);
    expect(screen.getByText(mySite1.name)).toBeInTheDocument();
    expect(screen.getByText(mySite1.handler.epaSiteId)).toBeInTheDocument();
  });
});
