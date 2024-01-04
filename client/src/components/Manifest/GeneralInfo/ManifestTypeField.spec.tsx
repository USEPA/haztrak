import '@testing-library/jest-dom';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'test-utils';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { setupServer } from 'msw/node';
import { userApiMocks } from 'test-utils/mock';
import { ManifestTypeSelect } from 'components/Manifest/GeneralInfo/ManifestTypeSelect';
import userEvent from '@testing-library/user-event';
import { createMockHandler } from 'test-utils/fixtures';

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
  test('hybrid is default option', () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />);
    expect(screen.getByText(/Hybrid/i)).toBeInTheDocument();
  });
  test('Full Electronic is disabled if no generator selected', async () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />);
    await userEvent.click(screen.getByLabelText(/Type/i));
    expect(screen.getByRole('option', { name: 'Electronic' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
  test('Full Electronic is enabled if generator can e-Sign', async () => {
    renderWithProviders(<TestComponent isDraft={true} readOnly={false} />, {
      useFormProps: {
        values: {
          generator: createMockHandler({
            canEsign: true,
            siteType: 'Generator',
          }),
        },
      },
    });
    await userEvent.click(screen.getByLabelText(/Type/i));
    expect(screen.getByRole('option', { name: 'Electronic' })).toHaveAttribute(
      'aria-disabled',
      'false'
    );
  });
});
