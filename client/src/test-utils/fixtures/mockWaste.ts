import { WasteLine } from 'types/wasteLine';

const DEFAULT_WASTELINE: WasteLine = {
  dotHazardous: false,
  epaWaste: true,
  br: false,
  pcb: false,
  lineNumber: 1,
};

export function createMockWaste(overWrites?: Partial<WasteLine>): WasteLine {
  return {
    ...DEFAULT_WASTELINE,
    ...overWrites,
  };
}
