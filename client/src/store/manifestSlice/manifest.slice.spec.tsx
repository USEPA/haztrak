import { afterEach, describe, expect, test } from 'vitest';
import reducer, { ManifestSlice, setStatus } from 'store/manifestSlice/manifest.slice';

afterEach(() => {});

const TestComponent = () => {
  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};

describe('Manifest slice', () => {
  test('setStatus placeholder test', () => {
    const state: ManifestSlice = reducer(undefined, setStatus('NotAssigned'));
    expect(state.status).toBe('NotAssigned');
  });
});
