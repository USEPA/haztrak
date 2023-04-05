import { z } from 'zod';

export const manifestSchema = z.object({
  manifestTrackingNumber: z.string().optional(),
  createdDate: z.date().optional(),
  updatedDate: z.date().optional(),
  shippedDate: z.date().optional(),
  import: z.boolean().optional(),
  rejection: z.boolean().optional(),
  potentialShipDate: z.date().optional(),
  status: z.enum([
    'NotAssigned',
    'Pending',
    'Scheduled',
    'InTransit',
    'ReadyForSignature',
    'Signed',
    'Corrected',
    'UnderCorrection',
    'MtnValidationFailed',
  ]),
  /**
   * Whether the manifest is publicly available through EPA
   */
  isPublic: z.boolean().optional(),
  generator: z.any().optional(),
  transporters: z.array(z.any()),
  wastes: z.array(z.any()),
  designatedFacility: z.any().optional(),
  submissionType: z.enum(['FullElectronic', 'DataImage5Copy', 'Hybrid', 'Image']),
});

export type Manifest = z.infer<typeof manifestSchema>;
