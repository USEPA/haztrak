import { z } from 'zod';

export const manifestSchema = z.object({
  manifestTrackingNumber: z.string().min(30),
});

export type ManifestSchema = z.infer<typeof manifestSchema>;
