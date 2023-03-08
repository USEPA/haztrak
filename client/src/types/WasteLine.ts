/**
 * Represents waste information captures on EPA's hazardous waste manifest
 */
interface WasteLine {
  dotHazardous: boolean;
  epaWaste: boolean;
  pcb: boolean;
  lineNumber: number;
  dotInformation?: DotInformation;
  wasteDescription?: string;
  quantity?: Quantity;
  brInfo?: BrInfo;
  br: boolean;
  hazardousWaste?: HazardousWaste;
  pcbInfos?: PcbInfo[];
  discrepancyResidueInfo?: DiscrepancyResidueInfo;
  managementMethod?: CodeDescription;
  additionalInfo?: AdditionalInfo;
}

/**
 * Unites States Department of Transportation (DOT) information
 */
interface DotInformation {
  idNumber: Code;
  /**
   * Contains various information for DOT requirements such as
   * RQ Description, Technical Name, Hazard Class, Packing Group and any user edits
   */
  printedDotInformation: string;
}

interface Code {
  code: string;
}

/**
 * Biennial Report information for the hazardous waste manifest
 * https://www.epa.gov/hwgenerators/biennial-hazardous-waste-report
 */
interface BrInfo {
  density: number;
  densityUnitOfMeasurement: DensityUOM;
  formCode: CodeDescription;
  sourceCode: CodeDescription;
  wasteMinimizationCode: CodeDescription;
}

/**
 * Density Units of Measurement
 */
interface DensityUOM {
  code: string;
  description: string;
}

/**
 * Object representing hazardous waste handling codes and their descriptions.
 */
export interface CodeDescription {
  code: string;
  description?: string;
}

/**
 * Hazardous waste quantity information such as container, quantity, UOM data
 */
interface Quantity {
  containerNumber: number;
  containerType: ContainerType;
  quantity: number;
  unitOfMeasurement: QuantityUOM;
}

/**
 * Quantity Units of Measurement
 */
interface QuantityUOM {
  code: 'P' | 'T' | 'K' | 'M' | 'G' | 'L' | 'Y' | 'N';
  description?: QuantityDescription;
}

/**
 * Choices for different types of Quantity UOM
 */
enum QuantityDescription {
  P = 'Pounds',
  T = 'Tons (2000 Pounds)',
  K = 'Kilograms',
  M = 'Metric Tons (1000 Kilograms)',
  G = 'Gallons',
  L = 'Liters',
  Y = 'Cubic Yards',
  N = 'Cubic Meters',
}

interface ContainerType {
  code: 'BA' | 'DT' | 'CF' | 'DW' | 'CM' | 'HG' | 'CW' | 'TC' | 'CY' | 'TP' | 'DF' | 'TT' | 'DM';
  description?: ContainerDescription;
}

enum ContainerDescription {
  BA = 'Burlap, cloth, paper, or plastic bags',
  DT = 'Dump truck',
  CF = 'Fiber or plastic boxes, cartons, cases',
  DW = 'Wooden drums, barrels, kegs',
  CM = 'Metal boxes, cartons, cases (including roll offs)',
  HG = 'Hopper or gondola cars',
  CW = 'Wooden boxes, cartons, cases',
  TC = 'Tank cars',
  CY = 'Cylinders',
  TP = 'Portable tanks',
  DF = 'Fiberboard or plastic drums, barrels, kegs',
  TT = 'Cargo tanks (tank trucks)',
  DM = 'Metal drums, barrels, kegs',
}

interface HazardousWaste {
  federalWasteCodes?: CodeDescription[];
  tsdfStateWasteCodes?: CodeDescription[];
  txWasteCodes?: string;
  generatorStateWasteCodes?: CodeDescription[];
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
  newManifestDestination: 'OriginalGenerator' | 'Tsdf';
  consentNumber: string;
  comments: Comment[];
  handlingInstructions: string;
}

interface Comment {
  label: string;
  description: string;
  handlerId: string;
}

export type { WasteLine, ContainerType, ContainerDescription, QuantityDescription };
