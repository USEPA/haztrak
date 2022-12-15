import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test';
import { MOCK_HANDLER } from 'test/fixtures';
import HandlerDetails from './HandlerDetails';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('HandlerDetails', () => {
  test('displays the handlers information', () => {
    renderWithProviders(<HandlerDetails handler={MOCK_HANDLER} />);
    expect(screen.getByText(MOCK_HANDLER.name)).toBeInTheDocument();
    expect(screen.getByText(MOCK_HANDLER.epaSiteId)).toBeInTheDocument();
  });
});
