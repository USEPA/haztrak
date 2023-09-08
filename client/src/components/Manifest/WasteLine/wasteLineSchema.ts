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

export type HazardousWaste = z.infer<typeof hazardousWasteSchema>;

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
      // if DOT hazardous, then just DOT information is required
      // else, if a federal waste (epaWaste), then waste description is required
      return wasteLine.dotHazardous || wasteLine.wasteDescription;
    },
    {
      path: ['wasteDescription'],
      message: 'Required',
    }
  )
  .refine(
    (wasteLine) => {
      // If material is DOT hazardous, then dotInformation.idNumber.code is required
      return !(wasteLine.dotHazardous && !wasteLine.dotInformation?.idNumber.code);
    },
    {
      path: ['dotInformation.idNumber.code'],
      message: 'DOT ID number is required',
    }
  )
  .refine(
    (wasteLine) => {
      // If waste is EPA federal hazardous, an EPA waste code is required
      if (wasteLine.epaWaste) {
        if (wasteLine.hazardousWaste?.federalWasteCodes) {
          return wasteLine.hazardousWaste?.federalWasteCodes?.length > 0;
        }
        return false;
      }
      return true;
    },
    {
      path: ['hazardousWaste.federalWasteCodes'],
      message: 'Federal waste code is required if the waste is EPA Waste',
    }
  )
  .refine(
    (wasteLine) => {
      // If material is DOT hazardous, then dotInformation.idNumber.code is required
      return !(wasteLine.dotHazardous && !wasteLine.dotInformation?.printedDotInformation);
    },
    {
      path: ['dotInformation.printedDotInformation'],
      message: 'DOT description is required',
    }
  );

/**
 * WasteLine is the interface for the waste line object in the manifest
 */
export type WasteLine = z.infer<typeof wasteLineSchema>;
export type { ContainerDescription };
