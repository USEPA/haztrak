import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '~/mocks';
import { RegisterHero } from './RegisterHero';

describe('RegisterHero Component', () => {
  it('renders the logo with correct alt text', () => {
    renderWithProviders(<RegisterHero />);
    const logo = screen.getByAltText('haztrak logo, hazardous waste tracking made easy.');
    expect(logo).toBeInTheDocument();
  });

  it('renders the Sign Up button with correct link', () => {
    renderWithProviders(<RegisterHero />);
    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton.closest('a')).toHaveAttribute('href', '/login');
  });

  it('renders the feature descriptions', () => {
    renderWithProviders(<RegisterHero />);
    expect(screen.getByText('Manifest')).toBeInTheDocument();
    expect(screen.getByText('e-Sign')).toBeInTheDocument();
    expect(screen.getByText('Manage')).toBeInTheDocument();
  });
});
