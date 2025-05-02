import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, renderWithProviders } from '~/mocks';
import { mockSiteEndpoints } from '~/mocks/handlers';
import { Org, orgLoader } from './Org';

const server = setupServer(...mockSiteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Org feature', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<Org />);
    expect(container).toBeDefined();
  });
  describe('org loader function', () => {
    it('returns null when org query parameter is missing', async () => {
      const request = new Request('http://localhost/org');
      const result = await orgLoader({
        request,
        params: {},
        context: undefined,
      });
      expect(result).toBeNull();
    });
  });
});
