import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ManifestCountBarChart } from './ManifestCountBarChart';

// This is a awful, dummy test we're using to run out dummy charts
describe('ManifestCountBarChart', () => {
  it('renders without crashing', () => {
    render(<ManifestCountBarChart />);
  });
});
