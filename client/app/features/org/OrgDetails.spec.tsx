import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrgDetails } from './OrgDetails';

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
});
