import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders, screen } from '~/mocks';
import { afterEach, describe, expect, it } from 'vitest';
import { useReadOnly } from './useReadOnly';

const TestChildComponent = () => {
  const [readOnly] = useReadOnly();
  return (
    <>
      <p>child editable: {readOnly ? 'no' : 'yes'}</p>
    </>
  );
};

const TestComponent = ({ propReadOnly }: { propReadOnly?: boolean }) => {
  const [readOnly, setReadOnly] = useReadOnly(propReadOnly);
  return (
    <>
      <p>editable: {readOnly ? 'no' : 'yes'}</p>
      <button onClick={() => setReadOnly(false)}>edit</button>
      <TestChildComponent />
    </>
  );
};

afterEach(() => cleanup());

describe('useReadOnly', () => {
  it('TestComponent renders', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/^editable: /i)).toBeInTheDocument();
  });
  it('state is set if initial value is true ', () => {
    renderWithProviders(<TestComponent propReadOnly={true} />);
    expect(screen.getByText(/^editable: no/i)).toBeInTheDocument();
  });
  it('state is set initial value is false', () => {
    renderWithProviders(<TestComponent propReadOnly={false} />);
    expect(screen.getByText(/^editable: yes/i)).toBeInTheDocument();
  });
  it('returns redux state if no initial value is passed', () => {
    renderWithProviders(<TestComponent />, { preloadedState: { manifest: { readOnly: false } } });
    expect(screen.getByText(/^editable: yes/i)).toBeInTheDocument();
  });
  it('updates the global state', async () => {
    renderWithProviders(<TestComponent propReadOnly={true} />);
    expect(screen.queryByText(/^child editable: yes/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByText(/^edit$/i));
    expect(screen.getByText(/^child editable: yes/i)).toBeInTheDocument();
  });
});
