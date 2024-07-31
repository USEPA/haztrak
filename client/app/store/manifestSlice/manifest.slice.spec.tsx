import '@testing-library/jest-dom';
import { useAppSelector } from '~/store';
import reducer, {
  ManifestSlice,
  selectManifestReadOnly,
  setHandlerSearchConfigs,
  setManifestReadOnly,
  setManifestStatus,
} from '~/store/manifestSlice/manifest.slice';
import { renderWithProviders, screen } from '~/test-utils';
import { describe, expect, test } from 'vitest';

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
  test('openHandlerSearch sets open to true and site type to argument', () => {
    const state: ManifestSlice = reducer(
      undefined,
      setHandlerSearchConfigs({
        siteType: 'generator',
        open: true,
      })
    );
    expect(state.handlerSearch?.open).toBe(true);
    expect(state.handlerSearch?.siteType).toBe('generator');
  });
});
