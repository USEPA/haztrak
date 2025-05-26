import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { About } from '~/features/about/About';
import { useTitle } from '~/hooks';

vi.mock('~/hooks', () => ({
  useTitle: vi.fn(),
}));

describe('About Component', () => {
  it('renders the About page title', () => {
    render(<About />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('sets the document title to "About"', () => {
    render(<About />);
    expect(useTitle).toHaveBeenCalled();
  });

  it('renders the Haztrak description', () => {
    render(<About />);
    expect(screen.getByText(/Haztrak is /i)).toBeInTheDocument();
  });
});
