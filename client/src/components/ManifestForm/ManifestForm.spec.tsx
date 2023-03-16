import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders } from 'test';
import ManifestForm from './ManifestForm';
import { fireEvent, screen } from '@testing-library/react';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
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
    expect(screen.getByText(/Transporter Search/i)).toBeInTheDocument();
  });
  test('Can open wasteline form', async () => {
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
  test('usable cancel save buttons editable', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const cancelBtn = screen.getByText(/Cancel/i);
    const saveBtn = screen.getByText(/Save/i);
    const editBtn = screen.getByText(/Edit/i);
    expect(cancelBtn).not.toHaveAttribute('disabled');
    expect(saveBtn).not.toHaveAttribute('disabled');
    expect(editBtn).toHaveAttribute('disabled');
  });
  test('only has "edit manifest" button when readonly', async () => {
    // ToDo: to test when readOnly={true}, we need manifestData to pass as prop
  });
});
