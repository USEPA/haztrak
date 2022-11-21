import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './index';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('Home', () => {
  test('renders', () => {
    render(<Home />);
    expect(screen.getByText('Hello, world')).toBeInTheDocument();
  });
});
