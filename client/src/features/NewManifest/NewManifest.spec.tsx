import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { NewManifest } from 'features/NewManifest/NewManifest';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import {
  createMockRcrainfoPermissions,
  createMockRcrainfoSite,
} from 'test-utils/fixtures/mockHandler';
import { describe, expect, test } from 'vitest';

describe('NewManifest', () => {
  test('renders', () => {
    const mySiteId = 'VATESTGEN001';
    const mySiteName = 'My Site';
    const mySite = createMockRcrainfoSite({
      name: mySiteName,
      // @ts-ignore
      handler: { epaSiteId: mySiteId, siteType: 'Tsdf' },
    });
    renderWithProviders(<NewManifest />, {
      preloadedState: {
        profile: {
          user: 'testuser1',
          sites: { VATESTGEN001: { ...mySite, permissions: { eManifest: 'viewer' } } },
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
            rcraSites: {
              VATESTGEN001: {
                epaSiteId: mySiteId,
                permissions: createMockRcrainfoPermissions(),
              },
            },
          },
        },
      },
    });
    expect(screen.getByRole('combobox', { name: /site Role/i })).toBeInTheDocument();
  });
  test('site type is initially disabled', () => {
    const mySiteId = 'VATESTGEN001';
    const mySiteName = 'My Site';
    const mySite = createMockRcrainfoSite({
      name: mySiteName,
      // @ts-ignore
      handler: { epaSiteId: mySiteId, siteType: 'Tsdf' },
    });
    renderWithProviders(<NewManifest />, {
      preloadedState: {
        profile: {
          user: 'testuser1',
          rcrainfoProfile: {
            user: 'username',
            phoneNumber: '1231231234',
            apiUser: false,
            rcraSites: {
              VATESTGEN001: {
                epaSiteId: mySiteId,
                permissions: createMockRcrainfoPermissions(),
              },
            },
          },
        },
      },
    });
    const siteRole = screen.getByRole('combobox', { name: /site Role/i });
    expect(siteRole).toBeDisabled();
  });
  test('site type is not disabled after selecting a site', async () => {
    const mySiteId = 'VATESTGEN001';
    const mySiteName = 'My Site';
    const mySite = createMockRcrainfoSite({
      name: mySiteName,
      // @ts-ignore
      handler: { epaSiteId: mySiteId, siteType: 'Tsdf' },
    });
    renderWithProviders(<NewManifest />, {
      preloadedState: {
        profile: {
          user: 'testuser1',
          sites: { VATESTGEN001: { ...mySite, permissions: { eManifest: 'viewer' } } },
        },
      },
    });
    const siteSelection = screen.getByRole('combobox', { name: /site select/i });
    await userEvent.click(siteSelection);
    await userEvent.keyboard('{enter}');
    expect(screen.getByText(new RegExp(`${mySiteId} --`, 'i'))).toBeInTheDocument();
    const siteRole = screen.getByRole('combobox', { name: /site Role/i });
    expect(siteRole).not.toBeDisabled();
  });
});
