import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransporterRowActions } from './TransporterRowActions';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe('TransporterRowActions', () => {
  test('renders disabled buttons', () => {
    const { debug } = render(
      <TransporterRowActions
        index={0}
        length={1}
        removeTransporter={() => console.log('remove')}
        swapTransporter={() => console.log('swap')}
      />
    );
    screen.getAllByRole('button').forEach((button) => {
      if (button.classList.contains('text-secondary')) {
        expect(button).toBeDisabled();
      } else {
        expect(button).not.toBeDisabled();
      }
    });
  });
});
