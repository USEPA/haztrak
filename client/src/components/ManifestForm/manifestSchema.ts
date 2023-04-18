import { rcraSite } from 'types/site/sites';
import { z } from 'zod';

export const manifestSchema = z
  .object({
    manifestTrackingNumber: z.string().optional(),
    /**
     * The date-time the manifest was created in the e-Manifest system.
     * Managed by EPA's systems.
     */
    createdDate: z.string().optional(),
    /**
     * The last date-time manifest was updated in the e-Manifest system.
     * Managed by EPA's systems.
     */
    updatedDate: z.string().optional(),
    /**
     * The date-time the hazardous waste shipment departed (was signed by) the generator.
     * Managed by EPA's systems, but not present on pre-shipment manifests.
     */
    shippedDate: z.string().optional(),
    import: z.boolean().optional(),
    rejection: z.boolean().optional(),
    potentialShipDate: z
      .string()
      .optional()
      .transform((val) => {
        if (val === '' || val === undefined) {
          // If empty string or undefined, return undefined
          return undefined;
        } else {
          return new Date(val).toISOString();
        }
      }),
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
  })
  .refine(
    // Check potential ship date is greater than today if the manifest is still in a pre-shipment phase
    (manifest) => {
      if (manifest.status === 'Pending' || manifest.status === 'NotAssigned') {
        if (manifest.potentialShipDate && new Date(manifest.potentialShipDate) < new Date()) {
          return false;
        }
      }
      return true;
    },
    { path: ['potentialShipDate'], message: 'Date must be after today' }
  );

export type Manifest = z.infer<typeof manifestSchema>;
/**
 * Used to specify whether a handler is a generator, transporter, or
 * designated receiving facility (AKA Treatment, Storage and Disposal Facility or TSDF for short).
 */
export const HandlerType = z.enum(['generator', 'designatedFacility', 'transporter']);

export type HandlerTypeEnum = z.infer<typeof HandlerType>;
const rejectionInfoSchema = z.object({
  rejectionType: z.enum(['FullRejection', 'PartialRejection']),
  alternateDesignatedFacilityType: z.enum(['Generator', 'Tsdf']),
  // generatorPaperSignature: ???
  // generatorElectronicSignature: ???
  alternateDesignatedFacility: rcraSite,
  newManifestTrackingNumber: z.string(),
  rejectionComments: z.string(),
});
export type RejectionInfo = z.infer<typeof rejectionInfoSchema>;
