import { ManifestStatusPieChart } from '~/components/Charts';
import { describe, it } from 'vitest';
import { renderWithProviders } from '~/mocks';

// This is a awful, dummy test we're using to run out dummy charts
describe('ManifestStatusPieChart', () => {
  it('renders the pie without crashing', async () => {
    renderWithProviders(<ManifestStatusPieChart />);
  });
});
