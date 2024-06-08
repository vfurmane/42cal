import { z } from 'zod';

export const findEventsResponseSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    campus_ids: z.array(z.number()),
    cursus_ids: z.array(z.number()),
    description: z.string(),
    location: z.string(),
    kind: z.string(),
    begin_at: z.string(),
    end_at: z.string(),
  }),
);

export type FindEventsResponseDto = z.infer<typeof findEventsResponseSchema>;
