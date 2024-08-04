import { describe, expect, it } from 'vitest';
import { OrgSelect } from '~/components/Org/OrgSelect';
import { renderWithProviders } from '~/mocks';
import { screen } from '@testing-library/react';

describe('OrgSelect Component', () => {
  it('renders', () => {
    renderWithProviders(<OrgSelect />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
