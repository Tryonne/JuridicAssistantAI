import { AzureOpenAI } from "openai";
import { env } from "./env";

export const openai = new AzureOpenAI({
  endpoint: env.AZURE_OPENAI_ENDPOINT,
  apiVersion: '2024-05-01-preview',
  apiKey: env.AZURE_OPENAI_KEY,
});
