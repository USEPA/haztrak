import { ManifestContext } from '~/components/Manifest/ManifestForm';
import { Handler, RcraSiteType } from '~/components/Manifest/manifestSchema';
import { QuickSignBtn } from '~/components/Manifest/QuickerSign/index';
import { setupServer } from 'msw/node';

import { cleanup, renderWithProviders, screen } from '~/mocks';
import { createMockMTNHandler } from '~/mocks/fixtures';
import { mockUserEndpoints } from '~/mocks/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { undefined } from 'zod';

const server = setupServer(...mockUserEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

function TestComponent({
  handler,
  signingSite,
}: {
  siteType?: RcraSiteType;
  handler?: Handler;
  signingSite?: {
    epaSiteId: string;
    siteType: 'generator' | 'designatedFacility' | 'transporter';
    transporterOrder?: number | undefined;
  };
}) {
  const setGeneratorStateCode = vi.fn();
  const setTsdfStateCode = vi.fn();
  const setEditWasteLineIndex = vi.fn();

  return (
    <div>
      <ManifestContext.Provider
        value={{
          nextSigningSite: signingSite,
          setGeneratorStateCode,
          setTsdfStateCode,
          setEditWasteLineIndex,
        }}
      >
        <QuickSignBtn mtnHandler={handler} onClick={() => undefined} />
      </ManifestContext.Provider>
    </div>
  );
}

describe('QuickSignBtn', () => {
  test('is not disabled when user org is rcrainfo integrated', () => {
    const unsigned_handler = createMockMTNHandler({
      signed: false,
      electronicSignaturesInfo: [],
    });
    renderWithProviders(<TestComponent siteType={'Generator'} handler={unsigned_handler} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  test('is disabled when API user but already signed', () => {
    const epaSiteId = 'TXD987654321';
    const unsigned_handler = createMockMTNHandler({
      signed: true,
      siteType: 'Generator',
      epaSiteId,
    });
    renderWithProviders(
      <TestComponent
        siteType={'Tsdf'}
        signingSite={{ epaSiteId: 'other_site', siteType: 'transporter' }}
        handler={unsigned_handler}
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
