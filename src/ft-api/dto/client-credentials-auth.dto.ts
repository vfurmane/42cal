import { z } from 'zod';

export const clientCredentialsAuthSchema = z
  .object({
    access_token: z.string(),
    token_type: z.string(),
  })
  .transform((o) => ({
    accessToken: o.access_token,
    tokenType: o.token_type,
  }));

export type ClientCredentialsAuthDto = z.infer<typeof clientCredentialsAuthSchema>;
