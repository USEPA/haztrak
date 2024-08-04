import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { OrgSelect } from '~/components/Org/OrgSelect';
import { cleanup, renderWithProviders } from '~/mocks';
import { screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { mockSiteEndpoints } from '~/mocks/handlers';

const server = setupServer(...mockSiteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

describe('OrgSelect Component', () => {
  it('renders', () => {
    renderWithProviders(<OrgSelect />);
    expect(screen.getByTestId('org-select')).toBeInTheDocument();
  });
  it('displays a select component', () => {
    renderWithProviders(<OrgSelect />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
