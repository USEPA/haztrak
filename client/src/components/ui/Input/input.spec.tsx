import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input component', () => {
  it('renders correctly with default props', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('custom-class');
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('disables the input when disabled prop is passed', () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });

  it('renders with additional props', () => {
    render(<Input placeholder="Enter text" />);
    const inputElement = screen.getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
  });
});
