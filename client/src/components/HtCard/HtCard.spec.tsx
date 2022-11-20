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
        <HtCard.Header id={'this_!$/the_ID'} title="hello"/>
      </HtCard>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
  test('Catches errors and still renders', () => {
    render(
      <HtCard>
        <HtCard.Header id={'this_!$/the_ID'} title="hello"/>
      </HtCard>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
