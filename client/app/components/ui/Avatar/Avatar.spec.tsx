import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar component', () => {
  it('renders with default props', () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).toHaveClass(
      'tw-relative tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-overflow-hidden tw-rounded-full'
    );
  });

  it('applies additional class names', () => {
    const { container } = render(<Avatar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
