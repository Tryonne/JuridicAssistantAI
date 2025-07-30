import { Request, Response } from 'express';
import { getClient} from '../utils/openai';

const assistantClient = getClient();

// configs do assitentes

const options = {
    model: "gpt-4o",
    name: "baltazar",
    instructions: " ...todas as instruções aqui... ",
    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: { vector_store_ids: ["vs_FkeQidKZceCAsjGd6P9mNI9x"] }
    },
    temperature: 0.02,
    top_p: 1
};

let assistantId: string | undefined = undefined;



// para criar o assistant (oo baltazar) apenas uma vez em vez de crear sempre um quando .assitant.create
export const ensureAssistant = async () => {
    if (assistantId) return assistantId;
    const response = await assistantClient.beta.assistants.create(options as any);
    assistantId = response.id; // para guardar o id do assistant
    return assistantId;
}