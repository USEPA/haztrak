import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HtTooltip } from 'components/Ht';

afterEach(() => {
  cleanup();
});

describe('HtTooltip', () => {
  test('renders', async () => {
    render(
      <HtTooltip text={'Chicken butt!'}>
        <p>Guess what?</p>
      </HtTooltip>
    );
    expect(screen.getByText('Guess what?')).toBeInTheDocument();
    fireEvent.mouseOver(screen.getByText('Guess what?'));
    expect(await screen.findByText('Chicken butt!')).toBeInTheDocument();
  });
});
