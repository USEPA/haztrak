import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { ManifestStatus } from 'components/Manifest/manifestSchema';
import React from 'react';
import { renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { useReadOnly } from './useReadOnly';

const TestComponent = ({ propStatus }: { propStatus?: ManifestStatus }) => {
  const [readOnly, setReadOnly] = useReadOnly();
  return (
    <>
      <p>editable: {readOnly ? 'no' : 'yes'}</p>
      <button onClick={() => setReadOnly(false)}>edit</button>
    </>
  );
};

afterEach(() => cleanup());

describe('useReadOnly', () => {
  it('TestComponent renders', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/^editable: /i)).toBeInTheDocument();
  });
});
