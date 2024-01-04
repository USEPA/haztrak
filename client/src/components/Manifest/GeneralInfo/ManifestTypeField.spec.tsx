import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { setupServer } from 'msw/node';
import { userApiMocks } from 'test-utils/mock';
import { ManifestTypeSelect } from 'components/Manifest/GeneralInfo/ManifestTypeSelect';

const server = setupServer(...userApiMocks);
afterEach(() => cleanup());
beforeAll(() => server.listen());
afterAll(() => server.close()); // Disable API mocking after the tests are done.

interface TestComponentProps {
  isDraft?: boolean;
  readOnly?: boolean;
}

const TestComponent = ({ isDraft, readOnly }: TestComponentProps) => {
  const isDraftVal = isDraft !== undefined ? isDraft : true;
  const readOnlyVal = readOnly !== undefined ? readOnly : false;
  return (
    <>
      <ManifestTypeSelect isDraft={isDraftVal} readOnly={readOnlyVal} />
    </>
  );
};

describe('Manifest Type Field', () => {
  test('renders', () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />);
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
  });
});
