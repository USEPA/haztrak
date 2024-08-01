import { screen } from '@testing-library/react';
import { RcraSiteType } from '~/components/Manifest/manifestSchema';
import { SiteTypeSelect } from '~/components/Manifest/SiteSelect/SiteTypeSelect';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { renderWithProviders } from 'app/mocks';
import { describe, expect, test } from 'vitest';

function TestComponent({ siteType }: { siteType?: RcraSiteType }) {
  const [mockSiteType, setMockSiteType] = useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (siteType: any) => setMockSiteType(siteType);
  const { control } = useForm();
  return (
    <SiteTypeSelect
      siteType={siteType}
      value={mockSiteType}
      handleChange={handleChange}
      control={control}
    />
  );
}

describe('SiteTypeSelect', () => {
  test('renders', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.queryByTestId('siteTypeSelect')).toBeDefined();
  });
  test('site options are limited when site type is Generator', () => {
    renderWithProviders(<TestComponent siteType={'Generator'} />);
    expect(screen.queryByRole('option', { name: /generator/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Transporter/i })).toBeNull();
    expect(screen.queryByRole('option', { name: /Tsdf/i })).toBeNull();
  });
  test('site options are limited when site type is transporter', () => {
    renderWithProviders(<TestComponent siteType={'Transporter'} />);
    expect(screen.queryByRole('option', { name: /generator/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Transporter/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Tsdf/i })).toBeNull();
  });
  test('All options are available when site Type is Tsdf', () => {
    renderWithProviders(<TestComponent siteType={'Tsdf'} />);
    expect(screen.queryByRole('option', { name: /generator/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Transporter/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Tsdf/i })).toBeDefined();
  });
  test('All options are available when site Type is undefined', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.queryByRole('option', { name: /generator/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Transporter/i })).toBeDefined();
    expect(screen.queryByRole('option', { name: /Tsdf/i })).toBeDefined();
  });
});
