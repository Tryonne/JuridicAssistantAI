import { AzureOpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const azureOpenAIKey = process.env.AZURE_OPENAI_KEY;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIVersion = "2024-05-01-preview";

if (!azureOpenAIKey || !azureOpenAIEndpoint) {
  throw new Error("AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT must be set");
}

export const assistantsClient = new AzureOpenAI({
  endpoint: azureOpenAIEndpoint,
  apiVersion: azureOpenAIVersion,
  apiKey: azureOpenAIKey,
});

export const assistantOptions: AssistantCreateParams = {
  // ... aqui vai o objeto de configuração do seu assistant!
};
