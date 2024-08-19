import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManifestContext, ManifestContextType } from '~/components/Manifest/ManifestForm';
import { WasteLine } from '~/components/Manifest/WasteLine';
import { WasteLineTable } from '~/components/Manifest/WasteLine/WasteLineTable/WasteLineTable';
import { useReadOnly } from '~/hooks/manifest';
import { createMockWaste } from '~/mocks/fixtures/mockWaste';

vi.mock('~/hooks/manifest', () => ({
  useReadOnly: vi.fn(),
}));

const mockContextValue: ManifestContextType = {
  setGeneratorStateCode: vi.fn(),
  setTsdfStateCode: vi.fn(),
  setEditWasteLineIndex: vi.fn(),
};

const mockWasteForm = {
  fields: [],
  append: vi.fn(),
  remove: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  swap: vi.fn(),
  move: vi.fn(),
  replace: vi.fn(),
  prepend: vi.fn(),
};

const mockWastes: WasteLine[] = [
  createMockWaste({
    lineNumber: 1,
    wasteDescription: 'Waste Description 1',
    dotInformation: { idNumber: { code: 'foo' }, printedDotInformation: 'DOT Info 1' },
    epaWaste: true,
    dotHazardous: true,
    pcb: false,
    hazardousWaste: { federalWasteCodes: [{ code: 'F001' }] },
    quantity: {
      containerNumber: 2,
      containerType: { code: 'BA' },
      quantity: 100,
      unitOfMeasurement: { code: 'P' },
    },
  }),
];

describe('WasteLineTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing when wastes are provided', () => {
    vi.mocked(useReadOnly).mockReturnValue([false, (_newReadOnly) => {}]);
    render(
      <ManifestContext.Provider value={mockContextValue}>
        <WasteLineTable wastes={mockWastes} toggleWLModal={vi.fn()} wasteForm={mockWasteForm} />
      </ManifestContext.Provider>
    );
    expect(screen.getByText('Waste Description 1')).toBeInTheDocument();
  });

  it('renders nothing when wastes are empty', () => {
    vi.mocked(useReadOnly).mockReturnValue([false, (_newReadOnly) => {}]);
    render(
      <ManifestContext.Provider value={mockContextValue}>
        <WasteLineTable wastes={[]} toggleWLModal={vi.fn()} wasteForm={mockWasteForm} />
      </ManifestContext.Provider>
    );
    expect(screen.queryByText('Waste Description 1')).not.toBeInTheDocument();
  });

  it('renders CustomToggle when readOnly is true', () => {
    vi.mocked(useReadOnly).mockReturnValue([true, (_newReadOnly) => {}]);
    render(
      <ManifestContext.Provider value={mockContextValue}>
        <WasteLineTable wastes={mockWastes} toggleWLModal={vi.fn()} wasteForm={mockWasteForm} />
      </ManifestContext.Provider>
    );
    expect(screen.getByTitle('more info')).toBeInTheDocument();
  });
});
