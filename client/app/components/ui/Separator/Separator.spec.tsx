import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild;
    expect(separator).toHaveClass('tw:h-[1px]');
    expect(separator).toHaveClass('tw:w-full');
  });

  it('renders vertical separator when orientation is vertical', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild;
    expect(separator).toHaveClass('tw:h-full');
    expect(separator).toHaveClass('tw:w-[1px]');
  });

  it('applies additional class names', () => {
    const { container } = render(<Separator className="custom-class" />);
    const separator = container.firstChild;
    expect(separator).toHaveClass('custom-class');
  });

  it('can be non-decorative', () => {
    const { container } = render(<Separator decorative={false} />);
    const separator = container.firstChild;
    expect(separator).not.toHaveAttribute('data-decorative', 'true');
  });
});
