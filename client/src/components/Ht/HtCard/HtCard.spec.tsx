import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, render, screen } from 'test-utils';
import HtCard from 'components/Ht/HtCard/HtCard';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('HtCard', () => {
  test('renders', () => {
    render(
      <HtCard>
        <HtCard.Header id={'this_!$/the_ID'} title="This is my title" />
        <HtCard.Body>
          <p>Hello, world</p>
        </HtCard.Body>
      </HtCard>
    );
    // debug(undefined, Infinity);
    expect(screen.getByText('Hello, world')).toBeInTheDocument();
  });
});
