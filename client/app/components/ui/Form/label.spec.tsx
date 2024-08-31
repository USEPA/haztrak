import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Label } from './label';

describe('Label component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Label>Test Label</Label>);
    expect(container.firstChild).toHaveClass('tw-text-sm tw-font-medium tw-leading-none');
  });

  it('applies additional class names', () => {
    const { container } = render(<Label className="extra-class">Test Label</Label>);
    expect(container.firstChild).toHaveClass('extra-class');
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test Label</Label>);
    expect(ref.current).not.toBeNull();
  });
});
