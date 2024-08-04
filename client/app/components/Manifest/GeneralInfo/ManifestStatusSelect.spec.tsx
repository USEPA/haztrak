import userEvent from '@testing-library/user-event';
import { ManifestStatusSelect } from '~/components/Manifest/GeneralInfo/ManifestStatusSelect';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { createMockHandler, createMockSite } from '~/mocks/fixtures';
import { createMockProfileResponse } from '~/mocks/fixtures/mockUser';
import { mockUserEndpoints } from 'app/mocks/handlers';
import { API_BASE_URL } from '~/mocks/handlers/mockSiteEndpoints';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

interface TestComponentProps {
  isDraft?: boolean;
  readOnly?: boolean;
}

const TestComponent = ({ isDraft, readOnly }: TestComponentProps) => {
  const isDraftVal = isDraft !== undefined ? isDraft : true;
  const readOnlyVal = readOnly !== undefined ? readOnly : false;
  return (
    <>
      <ManifestStatusSelect isDraft={isDraftVal} readOnly={readOnlyVal} />
    </>
  );
};

describe('Manifest Status Field', () => {
  test('renders', () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />);
  });
  test('is not editable if read only', () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={true} />);

    expect(screen.getByLabelText(/Status/i)).toBeDisabled();
  });
  test('is editable if the manifest is a draft', () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />);
    expect(screen.getByLabelText(/Status/i)).not.toBeDisabled();
  });
  test('Scheduled status is enabled if user has access to TSDF', async () => {
    // Arrange
    const userGeneratorSite = createMockSite({
      handler: createMockHandler({
        siteType: 'Generator',
        epaSiteId: 'MOCKVAGEN001',
      }),
    });
    const userTsdfSite = createMockSite({
      handler: createMockHandler({
        siteType: 'Tsdf',
        epaSiteId: 'MOCKVATSDF001',
      }),
    });
    server.use(
      http.get(`${API_BASE_URL}/api/profile`, () => {
        return HttpResponse.json(
          {
            ...createMockProfileResponse({
              sites: [
                {
                  site: userGeneratorSite,
                  eManifest: 'signer',
                },
                {
                  site: userTsdfSite,
                  eManifest: 'signer',
                },
              ],
            }),
          },
          { status: 200 }
        );
      })
    );
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />, {
      preloadedState: { manifest: { readOnly: false } },
      useFormProps: { values: { status: 'NotAssigned', generator: userGeneratorSite.handler } },
    });
    await userEvent.click(screen.getByLabelText(/Status/i));
    const options = screen.queryAllByRole('option');
    const scheduledOption = options.find((option) => option.textContent === 'Scheduled');
    expect(scheduledOption).not.toBeDisabled();
  });
  test('Scheduled status is disabled if no access to TSDF', async () => {
    // Arrange
    const userGeneratorSite = createMockSite({
      handler: createMockHandler({
        siteType: 'Generator',
        epaSiteId: 'MOCKVAGEN001',
      }),
    });
    server.use(
      http.get(`${API_BASE_URL}/api/profile`, () => {
        return HttpResponse.json(
          {
            ...createMockProfileResponse({
              sites: [
                {
                  site: userGeneratorSite,
                  eManifest: 'signer',
                },
              ],
            }),
          },
          { status: 200 }
        );
      })
    );
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />, {
      preloadedState: { manifest: { readOnly: false } },
      useFormProps: { values: { status: 'NotAssigned', generator: userGeneratorSite.handler } },
    });
    await userEvent.click(screen.getByLabelText(/Status/i));
    const scheduledOption = screen.queryByRole('option', { name: /Scheduled/i });
    expect(scheduledOption).toBeInTheDocument();
    expect(scheduledOption).toHaveAttribute('aria-disabled', 'true');
  });
  test('is editable if draft status', async () => {
    // Arrange
    const userGeneratorSite = createMockSite({
      handler: createMockHandler({
        siteType: 'Generator',
        epaSiteId: 'MOCKVAGEN001',
      }),
    });
    server.use(
      http.get(`${API_BASE_URL}/api/profile`, () => {
        return HttpResponse.json(
          {
            ...createMockProfileResponse({
              sites: [
                {
                  site: userGeneratorSite,
                  eManifest: 'signer',
                },
              ],
            }),
          },
          { status: 200 }
        );
      })
    );
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />, {
      preloadedState: { manifest: { readOnly: false } },
      useFormProps: { values: { status: 'NotAssigned', generator: userGeneratorSite.handler } },
    });
    await userEvent.click(screen.getByLabelText(/Status/i));
    const scheduledOption = screen.queryByRole('option', { name: /Scheduled/i });
    expect(scheduledOption).toBeInTheDocument();
    expect(scheduledOption).toHaveAttribute('aria-disabled', 'true');
  });
});
