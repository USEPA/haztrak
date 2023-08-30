import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { WasteLineForm } from './WasteLineForm';

describe('WasteLineForm', () => {
  test('renders', () => {
    renderWithProviders(
      <WasteLineForm
        appendWaste={() => console.log('waste appended')}
        handleClose={() => console.log('close action handled')}
      />,
      {}
    );
    expect(screen.getByText(/General/i)).toBeInTheDocument();
    // screen.debug(undefined, Infinity);
  });
  test('New waste lines set DOT haz material and EPA haz waste to true by default', () => {
    // Arrange
    renderWithProviders(
      <WasteLineForm
        appendWaste={() => console.log('waste appended')}
        handleClose={() => console.log('close action handled')}
      />,
      {}
    );
    const epaWasteSwitch = screen.getByRole('checkbox', { name: /EPA Hazardous Waste?/i });
    const dotHazSwitch = screen.getByRole('checkbox', { name: /DOT Hazardous/i });
    expect(epaWasteSwitch).toBeChecked();
    expect(dotHazSwitch).toBeChecked();
  });
  test('Setting DOT hazardous to false automatically set EPA waste to false', async () => {
    // Arrange
    renderWithProviders(
      <WasteLineForm
        appendWaste={() => console.log('waste appended')}
        handleClose={() => console.log('close action handled')}
      />,
      {}
    );
    const epaWasteSwitch = await screen.findByRole('checkbox', { name: /EPA Hazardous Waste?/i });
    const dotHazSwitch = await screen.findByRole('checkbox', { name: /DOT Hazardous/i });
    // Act
    await userEvent.click(dotHazSwitch);
    // Assert
    expect(epaWasteSwitch).not.toBeChecked();
    expect(dotHazSwitch).not.toBeChecked();
  });
  test('Setting EPA waste to true automatically set DOT Hazardous to true', async () => {
    // Arrange
    renderWithProviders(
      <WasteLineForm
        appendWaste={() => console.log('waste appended')}
        handleClose={() => console.log('close action handled')}
      />,
      {}
    );
    const epaWasteSwitch = await screen.findByRole('checkbox', { name: /EPA Hazardous Waste?/i });
    const dotHazSwitch = await screen.findByRole('checkbox', { name: /DOT Hazardous/i });
    // first set both switches to false
    await userEvent.click(epaWasteSwitch);
    await userEvent.click(dotHazSwitch);
    // Check they are both false (unchecked)
    expect(epaWasteSwitch).not.toBeChecked();
    expect(dotHazSwitch).not.toBeChecked();
    // Act
    await userEvent.click(epaWasteSwitch);
    // Assert
    expect(epaWasteSwitch).toBeChecked();
    expect(dotHazSwitch).toBeChecked();
  });
});
