import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup } from '~/mocks';
import { mockSiteEndpoints } from '~/mocks/handlers';
import { OrgDetails, orgDetailsLoader } from './OrgDetails';

const server = setupServer(...mockSiteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('OrgDetails Component', () => {
  it('renders the organization details heading', () => {
    render(<OrgDetails />);
    const headingElement = screen.getByText(/Organization Details/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(<OrgDetails />);
    expect(container).toBeDefined();
  });
  describe('orgDetailsLoader', () => {
    it('returns null when org query parameter is missing', async () => {
      const request = new Request('http://localhost/org');
      const result = await orgDetailsLoader({ request, params: {} });
      expect(result).toBeNull();
    });
  });
});
