import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { AdditionalInfoForm } from 'components/AdditionalInfo/AdditionalInfoForm';

afterEach(() => {
  cleanup();
});

describe('AdditionalInfoForm', () => {
  test('renders with basic information inputs', () => {
    renderWithProviders(<AdditionalInfoForm readOnly={false} />);
    expect(screen.getByLabelText(/Special Handling Instructions/i)).toBeInTheDocument();
  });
  test('initially has zero comments and Adds on click', async () => {
    renderWithProviders(<AdditionalInfoForm readOnly={false} />);
    expect(screen.queryAllByTitle(/Remove/i, { exact: false }).length).toBe(0);
    const numberButtonClick = 3;
    for (let i = 0; i < numberButtonClick; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Add Reference/i }));
    }
    expect(
      await screen
        .findAllByTestId(/additionalInfoRemoveButton/i, { exact: false })
        .then((v) => v.length)
    ).toBe(numberButtonClick);
  });
});
