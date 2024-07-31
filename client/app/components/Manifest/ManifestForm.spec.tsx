import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManifestForm } from '~/components/Manifest';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders } from 'app/mocks';
import { mockUserEndpoints, mockWasteEndpoints } from 'app/mocks/api';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

const server = setupServer(...mockUserEndpoints, ...mockWasteEndpoints);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close());

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
    const saveBtn = screen.getAllByRole('button', { name: /Save/i })[0];
    // Act
    await userEvent.click(saveBtn);
    // Assert
    expect(await screen.findByText(/Generator is required/i)).toBeInTheDocument();
  });
  test('at least one transporter is required', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getAllByRole('button', { name: /Save/i })[0];
    await userEvent.click(saveBtn);
    expect(
      await screen.findByText(/A manifest requires at least 1 transporters/i)
    ).toBeInTheDocument();
  });
  test('at least one waste line is required', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getAllByRole('button', { name: /Save/i })[0];
    await userEvent.click(saveBtn);
    expect(
      await screen.findByText(/A manifest requires at least 1 waste line/i)
    ).toBeInTheDocument();
  });
  test('a TSDF is required', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const saveBtn = screen.getAllByRole('button', { name: /Save/i })[0];
    await userEvent.click(saveBtn);
    expect(
      await screen.findByText(/Designated receiving facility is required/i)
    ).toBeInTheDocument();
  });
});
