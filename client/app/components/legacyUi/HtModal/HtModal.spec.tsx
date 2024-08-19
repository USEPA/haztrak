import { HtModal } from './HtModal';
import { cleanup, render, screen } from '~/mocks';

import { afterEach, describe, expect, test, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

describe('HtModal', () => {
  test('renders', () => {
    const handleClose = vi.fn();
    render(
      <HtModal showModal={true} handleClose={handleClose}>
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
