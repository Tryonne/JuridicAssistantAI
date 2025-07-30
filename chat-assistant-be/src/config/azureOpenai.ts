// src/config/azureOpenAI.js
require('dotenv/config');
const { AzureOpenAI } = require('openai');

const assistantsClient = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  apiVersion: "2024-05-01-preview"
});

module.exports = assistantsClient;
