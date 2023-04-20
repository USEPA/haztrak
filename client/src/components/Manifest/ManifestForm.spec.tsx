import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders } from 'test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createMockManifest } from 'test-utils/fixtures';
import { ManifestForm } from 'components/Manifest';

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
  test('only has "edit manifest" button when readonly', async () => {
    // ToDo: to test when readOnly={true}, we need manifestData as prop
  });
  test('potential ship date cannot be in past', async () => {
    renderWithProviders(<ManifestForm readOnly={false} />);
    const potentialShipDateInput = screen.getByLabelText(/potential ship date/i);
    fireEvent.change(potentialShipDateInput, { target: { value: '2021-04-21' } });
    const saveBtn = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(potentialShipDateInput).toHaveClass('is-invalid');
    });
  });
  test('displays e-Manifest managed dates', async () => {
    const manifestDate = new Date();
    const expectedDateValue = manifestDate.toISOString().slice(0, 10);
    const myManifest = createMockManifest({
      status: 'InTransit',
      createdDate: manifestDate.toISOString(),
      updatedDate: manifestDate.toISOString(),
      shippedDate: manifestDate.toISOString(),
    });
    renderWithProviders(<ManifestForm manifestData={myManifest} readOnly={false} />);
    expect(screen.getByLabelText(/Created Date/i)).toHaveValue(expectedDateValue);
    expect(screen.getByLabelText(/Last Update Date/i)).toHaveValue(expectedDateValue);
    expect(screen.getByLabelText(/Shipped Date/i)).toHaveValue(expectedDateValue);
  });
});
