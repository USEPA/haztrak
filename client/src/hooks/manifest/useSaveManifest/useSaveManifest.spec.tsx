import { cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { Manifest } from '~/components/Manifest';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '~/mocks';
import { createMockManifest } from '~/mocks/fixtures';
import { mockManifestEndpoints } from '~/mocks/handlers';
import { useSaveManifest } from './useSaveManifest';

const TestComponent = ({ manifest }: { manifest?: Manifest }) => {
  const { data, isLoading, error, taskId, saveManifest } = useSaveManifest();
  return (
    <>
      <p>loading: {isLoading ? 'yes' : 'no'}</p>
      <p>error: {error ? 'yes' : 'no'}</p>
      <p>task: {taskId ? taskId : 'empty'}</p>
      <p>data: {data ? 'defined' : 'undefined'}</p>
      <p>mtn: {data?.manifestTrackingNumber ?? 'undefined'}</p>
      <button onClick={() => saveManifest(manifest)}>save</button>
    </>
  );
};

const server = setupServer(...mockManifestEndpoints);
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => cleanup());

describe('useSaveManifest', () => {
  it('isLoading is false, error is null, and taskId is null by default ', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/^loading: no/i)).toBeInTheDocument();
    expect(screen.getByText(/^error: no/i)).toBeInTheDocument();
    expect(screen.getByText(/^task: empty/i)).toBeInTheDocument();
  });
  it('request are made to create a draft manifest', async () => {
    renderWithProviders(
      <TestComponent
        manifest={createMockManifest({
          manifestTrackingNumber: undefined,
          status: 'NotAssigned',
        })}
      />
    );
    await userEvent.click(screen.getByText(/^save$/i));
    await waitFor(() => expect(screen.getByText(/^loading: no/i)).toBeInTheDocument());
    expect(screen.getByText(/^data: defined/i)).toBeInTheDocument();
    expect(screen.getByText(/^mtn: [0-9]{9}DFT/i)).toBeInTheDocument();
  });
  it('request to update a draft manifest if MTN already exists', async () => {
    const existingMTN = '123456789DFT';
    renderWithProviders(
      <TestComponent
        manifest={createMockManifest({
          manifestTrackingNumber: existingMTN,
          status: 'NotAssigned',
        })}
      />
    );
    expect(screen.getByText(/^loading: no/i)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/^save$/i));
    await waitFor(() => expect(screen.getByText(/^loading: no/i)).toBeInTheDocument());
    expect(screen.getByText(/^data: defined/i)).toBeInTheDocument();
    expect(screen.getByText(`mtn: ${existingMTN}`)).toBeInTheDocument();
  });
});
