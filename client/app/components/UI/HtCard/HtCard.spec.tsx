import '@testing-library/jest-dom';
import { HtCard } from '~/components/UI';
import React from 'react';
import { cleanup, render, screen } from '~/test-utils';
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
    // debug(undefined, Infinity);
    expect(screen.getByText('Hello, world')).toBeInTheDocument();
  });
});
