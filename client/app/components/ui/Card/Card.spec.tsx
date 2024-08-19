import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Card />);
    expect(container.firstChild).toHaveClass(
      'tw-rounded-lg tw-border tw-bg-card tw-text-card-foreground tw-shadow-sm'
    );
  });

  it('applies additional class names', () => {
    const { container } = render(<Card className="additional-class" />);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});

describe('CardHeader Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CardHeader />);
    expect(container.firstChild).toHaveClass('tw-flex tw-flex-col tw-space-y-1.5 tw-p-6');
  });

  it('applies additional class names', () => {
    const { container } = render(<CardHeader className="additional-class" />);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});

describe('CardTitle Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CardTitle />);
    expect(container.firstChild).toHaveClass(
      'tw-text-xl tw-font-semibold tw-leading-none tw-tracking-tight'
    );
  });

  it('applies additional class names', () => {
    const { container } = render(<CardTitle className="additional-class" />);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});

describe('CardDescription Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CardDescription />);
    expect(container.firstChild).toHaveClass('tw-text-sm tw-text-muted-foreground');
  });

  it('applies additional class names', () => {
    const { container } = render(<CardDescription className="additional-class" />);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});

describe('CardContent Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CardContent />);
    expect(container.firstChild).toHaveClass('tw-p-6 tw-pt-0');
  });

  it('applies additional class names', () => {
    const { container } = render(<CardContent className="additional-class" />);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});

describe('CardFooter Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CardFooter />);
    expect(container.firstChild).toHaveClass('tw-flex tw-items-center tw-p-6 tw-pt-0');
  });

  it('applies additional class names', () => {
    const { container } = render(<CardFooter className="additional-class" />);
    expect(container.firstChild).toHaveClass('additional-class');
  });
});
