import { render } from '@testing-library/react';
import { GeneratorStatusAreaChart } from './GeneratorStatusAreaChart';
import { describe, it } from 'vitest';

// This is a awful, dummy test we're using to run out dummy charts
describe('GeneratorStatusAreaChart', () => {
  it('renders without crashing', () => {
    render(<GeneratorStatusAreaChart />);
  });
});
