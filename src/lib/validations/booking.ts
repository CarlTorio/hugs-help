import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must only contain letters'),
  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^[0-9+\s()-]+$/, 'Invalid phone format'),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal(''))
});
