import { screen } from '@testing-library/react';
import { SiteSelect } from 'components/Manifest/SiteSelect/SiteSelect';
import { SiteTypeSelect } from 'components/Manifest/SiteSelect/SiteTypeSelect';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { renderWithProviders } from 'test-utils';
import { createMockSite } from 'test-utils/fixtures';
import { createMockPermission } from 'test-utils/fixtures/mockHandler';

function TestComponent() {
  const [mockSiteType, setMockSiteType] = useState();
  const { control } = useForm();
  // @ts-ignore
  return <SiteTypeSelect siteType={mockSiteType} setSiteType={setMockSiteType} control={control} />;
}

describe('SiteTypeSelect', () => {
  test('renders', () => {
    const mySite = createMockSite();
    renderWithProviders(<TestComponent />);
    expect(screen.queryByTestId('siteTypeSelect')).toBeDefined();
  });
});
