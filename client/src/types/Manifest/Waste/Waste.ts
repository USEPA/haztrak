export interface Waste {
  dotHazardous: boolean;
  dotInformation?: DotInformation;
  wasteDescription?: string;
  quantity?: Quantity;
  brInfo?: BrInfo;
  br: boolean;
  hazardousWaste?: HazardousWaste;
  pcb: boolean;
  pcbInfos?: PcbInfo[];
  discrepancyResidueInfo?: DiscrepancyResidueInfo;
  managementMethod?: CodeDescription;
  additionalInfo?: AdditionalInfo;
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
  containerType: ContainerType;
  quantity: number;
  unitOfMeasurement: QuantityUnitsOfMeasurement;
}

interface QuantityUnitsOfMeasurement {
  code: QuantityCode;
  description?: QuantityDescription;
}

enum QuantityCode {
  P,
  T,
  K,
  M,
  G,
  L,
  Y,
  N,
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

interface ContainerType {
  code: ContainerCode;
  description?: ContainerDescription;
}

enum ContainerCode {
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

enum ContainerDescription {
  'Burlap, cloth, paper, or plastic bags',
  'Dump truck',
  'Fiber or plastic boxes, cartons, cases',
  'Wooden drums, barrels, kegs',
  'Metal boxes, cartons, cases (including roll offs)',
  'Hopper or gondola cars',
  'Wooden boxes, cartons, cases',
  'Tank cars',
  'Cylinders',
  'Portable tanks',
  'Fiberboard or plastic drums, barrels, kegs',
  'Cargo tanks (tank trucks)',
  'Metal drums, barrels, kegs',
}

interface HazardousWaste {
  federalWasteCodes: CodeDescription[];
  tsdfStateWasteCodes: CodeDescription[];
  txWasteCodes: string;
  generatorStateWasteCodes: CodeDescription[];
}

interface PcbInfo {
  loadType: Code;
  articleContainerId: string;
  dateOfRemoval: string;
  weight: number;
  wasteType: string;
  bulkIdentity: string;
}

interface DiscrepancyResidueInfo {
  wasteQuantity: boolean;
  wasteType: boolean;
  discrepancyComments: string;
  residue: boolean;
  residueComments: string;
}

interface AdditionalInfo {
  originalManifestTrackingNumbers: string[];
  newManifestDestination: NewDestination;
  consentNumber: string;
  comments: Comment[];
  handlingInstructions: string;
}

enum NewDestination {
  OriginalGenerator,
  Tsdf,
}

interface Comment {
  label: string;
  description: string;
  handlerId: string;
}
