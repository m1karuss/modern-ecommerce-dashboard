import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  notifications: z.object({
    newOrders: z.boolean().optional(),
    lowStock: z.boolean().optional(),
    customerMessages: z.boolean().optional(),
    paymentUpdates: z.boolean().optional(),
    weeklyReports: z.boolean().optional(),
  }).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

export type UpdatePreferencesDto = z.infer<typeof updatePreferencesSchema>;
