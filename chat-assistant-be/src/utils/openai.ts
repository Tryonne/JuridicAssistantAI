import { AzureOpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const azureOpenAIKey = process.env.AZURE_OPENAI_KEY!;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const azureOpenAIVersion = "2024-05-01-preview";


export const getClient = () => {
    return new AzureOpenAI({
      endpoint: azureOpenAIEndpoint,
      apiVersion: azureOpenAIVersion,
      apiKey: azureOpenAIKey,
    });
  };