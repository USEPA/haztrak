import { HtCard } from './HtCard';
import { cleanup, render, screen } from '~/mocks';
import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
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
    expect(screen.getByText('Hello, world')).toBeInTheDocument();
  });
});
