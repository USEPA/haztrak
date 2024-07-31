import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import React, { useState } from 'react';
import { cleanup, renderWithProviders } from '~/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { createMockHandler, createMockSite } from '~/test-utils/fixtures/mockHandler';
import { SiteFilterForm } from '~/components/HaztrakSite/SiteFilter/SiteFilterForm';
import { useSearchParams } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

afterEach(() => {
  cleanup();
});

const mySite2Handler = createMockHandler({ epaSiteId: 'TXD0192837465' });

const mySite1 = createMockSite();
const mySite2 = createMockSite({ name: 'My Second Site', handler: mySite2Handler });

const mockSites = [mySite1, mySite2];

const TestComponent = () => {
  const [filteredSites, setFilteredSites] = useState(mockSites);
  const [searchParams] = useSearchParams();
  const siteFilter = searchParams.get('q') ?? undefined;
  return (
    <div>
      <SiteFilterForm sites={filteredSites} setFilteredSites={setFilteredSites} />
      <p>url parameter: {siteFilter}</p>
    </div>
  );
};

describe('SiteFilterForm', () => {
  test('renders ', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
  test('URL query parameter is empty by default', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/url parameter:$/i)).toBeInTheDocument();
  });
  test('sets URL query parameter on submit', async () => {
    const userInput = 'TXD';
    const user = userEvent.setup();
    renderWithProviders(<TestComponent />);
    const filterField = screen.getByRole('searchbox');
    await user.click(filterField);
    await user.type(filterField, userInput);
    await user.type(filterField, '{enter}');
    expect(screen.getByText(new RegExp(`url parameter: ${userInput}`, 'i'))).toBeInTheDocument();
  });
});
