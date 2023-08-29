import { z } from 'zod';

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

export const containerTypeSchema = z.object({
  code: z.enum(['BA', 'DT', 'CF', 'DW', 'CM', 'HG', 'CW', 'TC', 'CY', 'TP', 'DF', 'TT', 'DM']),
  description: z.string().optional(),
});

export const quantityUOMSchema = z.object({
  code: z.enum(['P', 'T', 'K', 'M', 'G', 'L', 'Y', 'N']),
  description: z.string().optional(),
});

const quantitySchema = z.object({
  containerNumber: z.number(),
  containerType: containerTypeSchema,
  quantity: z.number(),
  unitOfMeasurement: quantityUOMSchema,
});

const codeSchema = z.object({
  code: z.string(),
  description: z.string().optional(),
});

/**
 * EPA defined generic interface for codes of various types and their description
 * such as density UOM, waste codes, form codes, and more.
 */
export type Code = z.infer<typeof codeSchema>;

const hazardousWasteSchema = z.object({
  federalWasteCodes: z.array(codeSchema).optional(),
  tsdfStateWasteCodes: z.array(codeSchema).optional(),
  txWasteCodes: z.string().optional(),
  generatorStateWasteCodes: z.array(codeSchema).optional(),
});

const dotInformationSchema = z.object({
  idNumber: codeSchema,
  printedDotInformation: z.string(),
});

/**
 * Object containing DOT information for the manifest
 * If the manifest contains DOT hazardous material, both these fields are required
 */
export type DotInformation = z.infer<typeof dotInformationSchema>;

export const wasteLineSchema = z
  .object({
    lineNumber: z.number(),
    dotHazardous: z.boolean(),
    epaWaste: z.boolean(),
    pcb: z.boolean(),
    dotInformation: dotInformationSchema.optional(),
    wasteDescription: z.string().optional(),
    quantity: quantitySchema,
    brInfo: z.any().optional(),
    br: z.boolean(),
    hazardousWaste: hazardousWasteSchema.optional(),
    pcbInfos: z.any().optional(),
    discrepancyResidueInfo: z.any().optional(),
    managementMethod: z.any().optional(),
    additionalInfo: z.any().optional(),
  })
  .refine(
    (wasteLine) => {
      if (wasteLine.dotHazardous) {
        if (
          !wasteLine.dotInformation?.printedDotInformation ||
          !wasteLine.dotInformation?.idNumber
        ) {
          return false;
        }
      }
      return true;
    },
    {
      path: ['dotInformation.idNumber', 'dotInformation.printedDotInformation'],
      message: 'DOT info is required when shipment is DOT hazardous',
    }
  );

export type WasteLine = z.infer<typeof wasteLineSchema>;

// /**
//  * Represents waste information captures on EPA's hazardous waste manifest
//  */
// interface WasteLine {
//   dotHazardous: boolean;
//   epaWaste: boolean;
//   pcb: boolean;
//   lineNumber: number;
//   dotInformation?: DotInformation;
//   wasteDescription?: string;
//   quantity?: Quantity;
//   brInfo?: BrInfo;
//   br: boolean;
//   hazardousWaste?: HazardousWaste;
//   pcbInfos?: PcbInfo[];
//   discrepancyResidueInfo?: DiscrepancyResidueInfo;
//   managementMethod?: Code;
//   additionalInfo?: AdditionalInfo;
// }

// /**
//  * United States Department of Transportation (DOT) information
//  */
// interface DotInformation {
//   idNumber: Code;
//   /**
//    * Contains various information for DOT requirements such as
//    * RQ Description, Technical Name, Hazard Class, Packing Group and any user edits
//    */
//   printedDotInformation: string;
// }

/**
 * Biennial Report information for the hazardous waste manifest
 * https://www.epa.gov/hwgenerators/biennial-hazardous-waste-report
 */
interface BrInfo {
  density: number;
  densityUnitOfMeasurement: Code;
  formCode: Code;
  sourceCode: Code;
  wasteMinimizationCode: Code;
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

interface HazardousWaste {
  federalWasteCodes?: Code[];
  tsdfStateWasteCodes?: Code[];
  txWasteCodes?: string;
  generatorStateWasteCodes?: Code[];
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

export type { ContainerType, ContainerDescription, QuantityDescription };
