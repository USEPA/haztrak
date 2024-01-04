import '@testing-library/jest-dom';
import { afterEach, describe, expect, test } from 'vitest';
import reducer, {
  ManifestSlice,
  selectManifestReadOnly,
  setManifestStatus,
} from 'store/manifestSlice/manifest.slice';
import { useAppSelector } from 'store';
import { renderWithProviders, screen } from 'test-utils';

afterEach(() => {});

const TestComponent = () => {
  const readOnly = useAppSelector(selectManifestReadOnly);
  return (
    <div>
      <h1>Test</h1>
      <p>{readOnly ? 'Read Only' : 'Not Read Only'}</p>
    </div>
  );
};

describe('Manifest slice', () => {
  test('sets the manifest status', () => {
    const state: ManifestSlice = reducer(undefined, setManifestStatus('NotAssigned'));
    expect(state.status).toBe('NotAssigned');
  });
  test('manifest slice is read only be default', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText(/Read Only/i)).toBeInTheDocument();
  });
});
