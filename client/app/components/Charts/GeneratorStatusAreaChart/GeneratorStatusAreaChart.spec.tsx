import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { GeneratorStatusAreaChart } from './GeneratorStatusAreaChart';

// This is a awful, dummy test we're using to run out dummy charts
describe('GeneratorStatusAreaChart', () => {
  it('renders without crashing', () => {
    render(<GeneratorStatusAreaChart />);
  });
});
