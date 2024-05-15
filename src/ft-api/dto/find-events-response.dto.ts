import { z } from 'zod';

export const findEventsResponseSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
    location: z.string(),
    begin_at: z.string(),
    end_at: z.string(),
  }),
);

export type FindEventsResponseDto = z.infer<typeof findEventsResponseSchema>;