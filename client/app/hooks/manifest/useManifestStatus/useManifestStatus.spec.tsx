import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import userEvent from '@testing-library/user-event';
import { ManifestStatus } from '~/components/Manifest/manifestSchema';
import { renderWithProviders, screen } from '~/mocks';
import { useManifestStatus } from './useManifestStatus';

const TestChildComponent = () => {
  const [status] = useManifestStatus();
  return (
    <>
      <p>child status: {status || 'undefined'}</p>
    </>
  );
};

const TestComponent = ({ propStatus }: { propStatus?: ManifestStatus }) => {
  const [status, setStatus] = useManifestStatus(propStatus);
  return (
    <>
      <p>status: {status || 'undefined'}</p>
      <button onClick={() => setStatus('Pending')}>Change Status</button>
      <TestChildComponent />
    </>
  );
};

afterEach(() => cleanup());

describe('useManifestStatus', () => {
  it('status is undefined by default', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/^status: undefined/i)).toBeInTheDocument();
  });
  it('reflects the state of the redux store manifest slice', () => {
    renderWithProviders(<TestComponent />, {
      preloadedState: {
        manifest: {
          status: 'InTransit',
          readOnly: true,
        },
      },
    });
    expect(screen.getByText(/^status: InTransit/i)).toBeInTheDocument();
    expect(screen.getByText(/^child status: InTransit/i)).toBeInTheDocument();
  });
  it('updates the status in the redux store', async () => {
    renderWithProviders(<TestComponent />, {
      preloadedState: {
        manifest: {
          status: 'NotAssigned',
          readOnly: true,
        },
      },
    });
    expect(screen.getByText(/^status: NotAssigned/i)).toBeInTheDocument();
    expect(screen.getByText(/^child status: NotAssigned/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/^status: Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/^child status: Pending/i)).toBeInTheDocument();
  });
  it('optional accepts a value as prop and sets as default value if present', async () => {
    const propStatus: ManifestStatus = 'Corrected';
    renderWithProviders(<TestComponent propStatus={propStatus} />, {
      preloadedState: {
        manifest: {
          status: 'Scheduled',
          readOnly: true,
        },
      },
    });
    expect(screen.getByText(new RegExp(`^status: ${propStatus}`, 'i'))).toBeInTheDocument();
  });
});
