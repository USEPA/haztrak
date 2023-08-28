import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManifestForm } from 'components/Manifest';
import React from 'react';
import { cleanup, renderWithProviders } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('ManifestForm', () => {
  test('renders a Draft manifest', () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    expect(screen.getByText(/Draft Manifest/i)).toBeInTheDocument();
  });
  test('Can open Transporter search form', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const addTransporterBtn = screen.getByText(/Add Transporter/i);
    fireEvent.click(addTransporterBtn);
    expect(screen.getByText(/EPA ID Number/i)).toBeInTheDocument();
  });
  test('Can open waste line form', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const addWasteBtn = screen.getByText(/Add Waste/i);
    fireEvent.click(addWasteBtn);
    expect(screen.getByText(/Add Waste Line/i)).toBeInTheDocument();
  });
  test('Can open TSDF search form', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const addTsdfBtn = screen.getByText(/Add TSDF/i);
    fireEvent.click(addTsdfBtn);
    expect(screen.getByText(/Add Designated Facility/i)).toBeInTheDocument();
  });
  test('only has "edit manifest" button when readonly', async () => {
    // ToDo: to test when readOnly={true}, we need manifestData as prop
  });
});

describe('ManifestForm validation', () => {
  test('a generator is required', async () => {
    // Arrange
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getByRole('button', { name: /Save/i });
    // Act
    await userEvent.click(saveBtn);
    // Assert
    expect(await screen.findByText(/Generator is required/i)).toBeInTheDocument();
  });
  test('at least one transporter is required', async () => {
    // Arrange
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getByRole('button', { name: /Save/i });
    // Act
    await userEvent.click(saveBtn);
    // Assert
    expect(
      await screen.findByText(/A manifest requires at least 1 transporters/i)
    ).toBeInTheDocument();
  });
  test('at least one waste line is required', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveBtn);
    expect(
      await screen.findByText(/A manifest requires at least 1 waste line/i)
    ).toBeInTheDocument();
  });
  test('a TSDF is required', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveBtn);
    expect(
      await screen.findByText(/Designated receiving facility is required/i)
    ).toBeInTheDocument();
  });
});
