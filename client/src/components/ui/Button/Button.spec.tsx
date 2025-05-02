import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';

describe('Button component', () => {
  it('renders with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('tw:bg-destructive tw:text-destructive-foreground');
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: /outline/i });
    expect(button).toHaveClass('tw:border tw:border-input');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('tw:bg-secondary tw:text-secondary-foreground');
  });

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button', { name: /ghost/i });
    expect(button).toHaveClass('tw:hover:bg-accent tw:hover:text-accent-foreground');
  });

  it('renders with link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button', { name: /link/i });
    expect(button).toHaveClass('tw:text-primary tw:underline-offset-4');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('tw:h-9 tw:rounded-md tw:px-3');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('tw:h-11 tw:rounded-md tw:px-8');
  });

  it('renders with rounded true', () => {
    render(<Button rounded>Rounded</Button>);
    const button = screen.getByRole('button', { name: /rounded/i });
    expect(button).toHaveClass('tw:rounded-full');
  });

  it('renders with asChild prop', () => {
    render(
      <Button asChild={true}>
        <span>Child</span>
      </Button>
    );
    const button = screen.getByText(/child/i);
    expect(button.tagName).toBe('SPAN');
  });

  it('applies additional class names', () => {
    render(<Button className="extra-class">Extra Class</Button>);
    const button = screen.getByRole('button', { name: /extra class/i });
    expect(button).toHaveClass('extra-class');
  });
});
