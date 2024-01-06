import '@testing-library/jest-dom';
import { useAppSelector } from 'store';
import reducer, {
  ManifestSlice,
  selectManifestReadOnly,
  setManifestReadOnly,
  setManifestStatus,
} from 'store/manifestSlice/manifest.slice';
import { renderWithProviders, screen } from 'test-utils';
import { afterEach, describe, expect, test } from 'vitest';

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
  test('sets read only', () => {
    const readOnlyState: ManifestSlice = reducer(undefined, setManifestReadOnly(true));
    expect(readOnlyState.readOnly).toBe(true);
    const editableState: ManifestSlice = reducer(undefined, setManifestReadOnly(false));
    expect(editableState.readOnly).toBe(false);
  });
});
