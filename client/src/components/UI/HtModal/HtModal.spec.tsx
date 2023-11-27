import '@testing-library/jest-dom';
import { HtModal } from 'components/UI';
import React from 'react';
import { cleanup, render, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('HtModal', () => {
  test('renders', () => {
    render(
      <HtModal showModal={true} handleClose={() => {}}>
        <HtModal.Header>
          <HtModal.Title title="Hello world" />
        </HtModal.Header>
        <HtModal.Body>
          <p>This is a sample modal</p>
        </HtModal.Body>
      </HtModal>
    );
    // debug(undefined, Infinity);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });
});
