import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default size and show true', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('span')).toHaveClass('tw-flex');
    expect(container.querySelector('svg')).toHaveClass('tw-animate-spin');
  });

  it('renders hidden with show false', () => {
    const { container } = render(<Spinner show={false} />);
    expect(container.querySelector('span')).toHaveClass('tw-hidden');
  });

  it('renders with custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);
    expect(container.querySelector('svg')).toHaveClass('custom-class');
  });

  it('renders children correctly', () => {
    const { getByText } = render(<Spinner>Loading...</Spinner>);
    expect(getByText('Loading...')).toBeInTheDocument();
  });
});
