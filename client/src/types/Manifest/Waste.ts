export interface Waste {
  dotHazardous: boolean;
  dotInformation?: DotInformation;
  wasteDescription?: string;
  quantity?: Quantity;
  brInfo?: BrInfo;
  br: boolean;
  // hazardousWaste?:
  pcb: boolean;
  // pcbInfo?:
  // discrepancyResidueInfo?:
  // managementMethod?:
  // additionalInfo?:
  lineNumber: number;
  epaWaste: boolean;
}

interface DotInformation {
  idNumber: Code;
  printedDotInformation: string;
}

interface Code {
  code: string;
}

interface BrInfo {
  density: number;
  densityUnitOfMeasurement: DensityUnitOfMeasurement;
  formCode: CodeDescription;
  sourceCode: CodeDescription;
  wasteMinimizationCode: CodeDescription;
}

interface DensityUnitOfMeasurement {
  code: string;
  description: string;
}

interface CodeDescription {
  code: string;
  description?: string;
}

interface Quantity {
  containerNumber: number;
  // containerType: ContainerType;
  quantity: number;
  unitOfMeasurement: QuantityUnitsOfMeasurement;
}

interface QuantityUnitsOfMeasurement {
  code: QuantityCode;
  description?: QuantityDescription;
}

enum QuantityCode {
  BA,
  DT,
  CF,
  DW,
  CM,
  HG,
  CW,
  TC,
  CY,
  TP,
  DF,
  TT,
  DM,
}

enum QuantityDescription {
  'Pounds',
  'Tons (2000 Pounds)',
  'Kilograms',
  'Metric Tons (1000 Kilograms)',
  'Gallons',
  'Liters',
  'Cubic Yards',
  'Cubic Meters',
}
