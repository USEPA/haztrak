import userEvent from '@testing-library/user-event';
import { ManifestTypeSelect } from '~/components/Manifest/GeneralInfo/ManifestTypeSelect';
import { setupServer } from 'msw/node';
import React from 'react';
import { cleanup, renderWithProviders, screen } from 'app/mocks';
import { createMockHandler } from '~/mocks/fixtures';
import { mockUserEndpoints } from 'app/mocks/handlers';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

const server = setupServer(...mockUserEndpoints);
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
  test('is never editable if past draft status', async () => {
    renderWithProviders(<TestComponent isDraft={false} readOnly={false} />, {
      useFormProps: {
        values: {
          status: 'Scheduled',
          generator: createMockHandler({
            canEsign: true,
            siteType: 'Generator',
          }),
        },
      },
    });
    expect(screen.getByLabelText(/Type/i)).toBeDisabled();
  });
});
