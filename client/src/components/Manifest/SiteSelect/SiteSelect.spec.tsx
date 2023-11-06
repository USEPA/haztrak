import { screen } from '@testing-library/react';
import { SiteSelect } from 'components/Manifest/SiteSelect/SiteSelect';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { renderWithProviders } from 'test-utils';
import { createMockRcrainfoSite } from 'test-utils/fixtures';
import { createMockRcrainfoPermissions } from 'test-utils/fixtures/mockHandler';
import { describe, expect, test } from 'vitest';

function TestComponent() {
  const [selected, setSelected] = useState();
  const { control } = useForm();
  // @ts-ignore
  return <SiteSelect value={selected} handleChange={setSelected} control={control} />;
}

describe('SiteSelect', () => {
  test('renders', () => {
    const mySite = createMockRcrainfoSite();
    renderWithProviders(<TestComponent />, {
      preloadedState: {
        profile: {
          user: 'username',
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
            rcraSites: {
              VATESTGEN001: {
                epaSiteId: 'VATESTGEN001',
                permissions: createMockRcrainfoPermissions(),
              },
              VATEST00001: {
                epaSiteId: 'VATEST00001',
                permissions: createMockRcrainfoPermissions(),
              },
            },
          },
        },
      },
    });
    expect(screen.queryByTestId('siteSelect')).toBeDefined();
  });
});
