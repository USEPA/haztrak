import '@testing-library/jest-dom';
import { ManifestStatusSelect } from 'components/Manifest/GeneralInfo/ManifestStatusSelect';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { userApiMocks } from 'test-utils/mock';
import { http, HttpResponse } from 'msw';
import { createMockProfileResponse } from 'test-utils/fixtures/mockUser';
import { API_BASE_URL } from 'test-utils/mock/htApiMocks';
import { createMockHandler, createMockSite } from 'test-utils/fixtures';

const server = setupServer(...userApiMocks);
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
      http.get(`${API_BASE_URL}/api/user/profile`, () => {
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
      http.get(`${API_BASE_URL}/api/user/profile`, () => {
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
