import React from 'react';
import {render, cleanup, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import HtCard from './HtCard';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('HtCard renders', () => {
  test('renders with title', () => {
    render(
      <HtCard>
        <HtCard.Header title="hello"/>
      </HtCard>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
