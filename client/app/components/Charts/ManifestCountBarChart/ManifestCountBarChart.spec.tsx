import { render } from '@testing-library/react';
import { ManifestCountBarChart } from './ManifestCountBarChart';
import { describe, it } from 'vitest';

// This is a awful, dummy test we're using to run out dummy charts
describe('ManifestCountBarChart', () => {
  it('renders without crashing', () => {
    render(<ManifestCountBarChart />);
  });
});
