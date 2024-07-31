import { Code, WasteLine } from '~/components/Manifest/WasteLine/wasteLineSchema';

const DEFAULT_WASTELINE: WasteLine = {
  dotHazardous: false,
  epaWaste: true,
  quantity: {
    quantity: 1,
    unitOfMeasurement: { code: 'P' },
    containerNumber: 1,
    containerType: { code: 'BA' },
  },
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

export const mockFederalWasteCodes: Code[] = [
  { code: 'D001', description: 'Ignitable' },
  { code: 'D002', description: 'Corrosive' },
  { code: 'P003', description: 'something something poly-propel' },
];

export const mockDotIdNumbers: string[] = [
  'ID8000',
  'NA0027',
  'NA0124',
  'NA0276',
  'NA0323',
  'NA0331',
  'NA0337',
  'NA0494',
  'NA1057',
  'NA1270',
  'NA1325',
  'NA1350',
  'NA1361',
  'NA1365',
  'NA1556',
];
