import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UseFieldArrayReturn } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { Manifest } from '~/components/Manifest';
import { WasteRowActions } from '~/components/Manifest/WasteLine/WasteLineTable/WasteRowActions';

describe('WasteRowActions', () => {
  // @ts-expect-error - mock object
  const mockWasteForm: UseFieldArrayReturn<Manifest, 'wastes'> = {
    remove: vi.fn(),
  };

  const mockSetEditWasteLine = vi.fn();
  const mockToggleWLModal = vi.fn();

  const defaultProps = {
    index: 0,
    wasteForm: mockWasteForm,
    setEditWasteLine: mockSetEditWasteLine,
    toggleWLModal: mockToggleWLModal,
    eventKey: '0',
  };

  it('renders dropdown with actions', () => {
    render(<WasteRowActions {...defaultProps} />);
    expect(screen.getByTitle('transporter 1 actions')).toBeInTheDocument();
  });

  it('calls wasteForm.remove when Remove is clicked', async () => {
    const user = userEvent.setup();
    render(<WasteRowActions {...defaultProps} />);
    await user.click(screen.getByTitle('transporter 1 actions'));
    await user.click(screen.getByTitle('remove waste line 0'));
    expect(mockWasteForm.remove).toHaveBeenCalledWith(0);
  });

  it('calls setEditWasteLine and toggleWLModal when Edit is clicked', async () => {
    const user = userEvent.setup();
    render(<WasteRowActions {...defaultProps} />);
    await user.click(screen.getByTitle('transporter 1 actions'));
    await user.click(screen.getByTitle('edit waste line 0'));
    expect(mockSetEditWasteLine).toHaveBeenCalled();
    expect(mockToggleWLModal).toHaveBeenCalled();
  });

  it('toggles details view when Details/Close is clicked', async () => {
    const user = userEvent.setup();

    render(<WasteRowActions {...defaultProps} />);

    await user.click(screen.getByTitle('transporter 1 actions'));
    await user.click(screen.getByTitle('view waste line 0 details'));
    expect(screen.getByTitle('view waste line 0 details')).toHaveTextContent('Close');
    await user.click(screen.getByTitle('view waste line 0 details'));
    expect(screen.getByTitle('view waste line 0 details')).toHaveTextContent('Details');
  });
});
