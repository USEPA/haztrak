import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CopyButton } from '~/components/CopyButton/CopyButton';
import { renderWithProviders } from '~/mocks';
import { addAlert } from '~/store';

vi.mock('react-icons/lu', () => ({
  LuCopy: () => <svg data-testid="copy-icon" />,
}));

vi.mock('~/store', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/store')>()),
  addAlert: vi.fn(),
  useAppDispatch: () => vi.fn(),
}));

describe('CopyButton', () => {
  it('renders the button with children and icon', () => {
    render(<CopyButton copyText="test text">Copy</CopyButton>);
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });

  it('copies text to clipboard when clicked', () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CopyButton copyText="test text">Copy</CopyButton>);
    fireEvent.click(screen.getByText('Copy'));
    expect(writeTextMock).toHaveBeenCalledWith('test text');
  });

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <CopyButton ref={ref} copyText="test text">
        Copy
      </CopyButton>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies additional props to the button', () => {
    render(
      <CopyButton copyText="test text" className="extra-class">
        Copy
      </CopyButton>
    );
    expect(screen.getByText('Copy')).toHaveClass('extra-class');
  });
  it('copies text to clipboard and dispatches success alert', () => {
    vi.mocked(addAlert).mockReturnValue({
      type: 'notification/addAlert',
      payload: { id: 'copy-success-test text' },
    });

    renderWithProviders(<CopyButton copyText="test text">Copy</CopyButton>);
    fireEvent.click(screen.getByText('Copy'));
    expect(addAlert).toHaveBeenCalled();
  });
});
