import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

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

describe('AvatarImage component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<AvatarImage />);
    expect(container.firstChild).toHaveClass('tw-aspect-square tw-h-full tw-w-full');
  });

  it('applies additional class names to image', () => {
    const { container } = render(<AvatarImage className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('AvatarFallback component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<AvatarFallback />);
    expect(container.firstChild).toHaveClass(
      'tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-rounded-full tw-bg-muted'
    );
  });

  it('applies additional class names', () => {
    const { container } = render(<AvatarFallback className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
