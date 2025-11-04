import { z } from 'zod';

const envSchema = z.object ({
    NODE_ENV: z.enum (['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    FRONTEND_ORIGIN: z.string().url().optional(),
    AZURE_OPENAI_KEY: z.string().min(1, 'AZURE_OPENAI_KEY is required'),
    AZURE_OPENAI_ENDPOINT: z.string().url('AZURE_OPENAI_ENDPOINT must be a valid URL').min(1, 'AZURE_OPENAI_ENDPOINT is required'),
});

export const env = envSchema.parse(process.env);
