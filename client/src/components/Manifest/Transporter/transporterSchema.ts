import { z } from 'zod';
import { handlerSchema } from 'components/Manifest/Handler';

export const transporterSchema = handlerSchema.extend({
  order: z.number(),
  manifest: z.number().optional(),
});

/**
 *  The Transporter type extends the Handler schema and adds transporter
 *  specific data, such as their order on the manifest
 */
export type Transporter = z.infer<typeof transporterSchema>;
