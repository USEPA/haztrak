import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import AdditionalInfoForm from './AdditionalInfoForm';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('AdditionalInfoForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<AdditionalInfoForm />);
    expect(screen.getByLabelText(/Special Handling Instructions/i)).toBeInTheDocument();
  });
  test('initially has zero comments and Adds on click', async () => {
    renderWithProviders(<AdditionalInfoForm />);
    expect(screen.queryAllByTitle(/Remove/i, { exact: false }).length).toBe(0);
    const numberButtonClick = 3;
    for (let i = 0; i < numberButtonClick; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Add Reference/i }));
    }
    expect(
      await screen.findAllByTitle(/Remove/i, { exact: false }).then((v) => v.length)
    ).toBe(numberButtonClick);
  });
});
