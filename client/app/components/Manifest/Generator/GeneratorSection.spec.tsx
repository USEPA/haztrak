import { cleanup, renderWithProviders, screen } from '~/mocks';
import { createMockHandler } from '~/mocks/fixtures';
import { afterEach, describe, expect, test } from 'vitest';
import { GeneratorSection } from './GeneratorSection';

afterEach(() => cleanup());

const TestComponent = () => {
  return <GeneratorSection setupSign={() => undefined} signAble={true} />;
};

describe('GeneratorSection', () => {
  test('renders', () => {
    renderWithProviders(<TestComponent />, {
      useFormProps: {
        values: {
          status: 'NotAssigned',
          generator: createMockHandler({ epaSiteId: 'VATEST123' }),
        },
      },
    });
    expect(screen.getByText(/vatest123/i)).toBeInTheDocument();
  });
});
