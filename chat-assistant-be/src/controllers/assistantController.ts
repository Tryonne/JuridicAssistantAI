import { Request, Response } from 'express';
import { getClient} from '../utils/openai';

const assistantsClient = getClient();

// configs do assitentes

const options = {
    model: "gpt-4o-2",
    name: "baltazar",
    instructions: 

    `

   
    `, 


    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: { vector_store_ids: ["vs_xNXzE5uu1lqCTA2h5ofnxHyo"] }
    },
    temperature: 0.02,
    top_p: 1
};

let assistantId: string | undefined = undefined;



// para criar oo baltazar apenas uma vez em vez de crear sempre um quando .assitant.create
export const ensureAssistant = async () => {
    if (assistantId) return assistantId;
    const response = await assistantsClient.beta.assistants.create(options as any);
    assistantId = response.id; // para guardar o id do assistant
    return assistantId;
}

export const askAssistant = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        const assistantId = await ensureAssistant();

        // Criar Thread
        const thread = await assistantsClient.beta.threads.create({});

        // Adicionar mensagem   

        await assistantsClient.beta.threads.messages.create(thread.id, {
            role: "user",
            content: message,
        });

        // Dar run do assistente na thread

        const run = await assistantsClient.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Poll até run acabar
        let runStatus = run.status;

    while (runStatus === "queued" || runStatus === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s
      const statusRes = await assistantsClient.beta.threads.runs.retrieve(
        run.id,
        { thread_id: thread.id }
      );
      runStatus = statusRes.status;
    }

    if (runStatus === "completed") {
      const msgs = await assistantsClient.beta.threads.messages.list(thread.id);
      const assistantMessage = msgs.data.reverse().find(m => m.role === "assistant");

      // log para debbug 
      console.log(JSON.stringify(assistantMessage, null, 2));

      let answer = "Sem resposta.";
      
      let citations: any[] = [];

      if (assistantMessage && Array.isArray(assistantMessage.content)) {
        const texts = assistantMessage.content
          .filter((c: any) => c.type === "text" && c.text && c.text.value)
          .map((c: any) => c.text.value);
        if (texts.length > 0) {
          answer = texts.join('\n');
        }
        // para extrair as citações/anotations, se houver

        assistantMessage?.content.forEach((c: any) => {
          if (Array.isArray(c.annotations)) {
            c.annotations.forEach((annotation: any) => {
              if (annotation.type === "file_citation") {
                citations.push(annotation.file_citation);
              }
            });
          }
       
        }
        );

      }

      if (assistantMessage && Array.isArray(assistantMessage.content)) {
        const texts = assistantMessage.content
          .filter((c: any) => c.type === "text" && c.text && c.text.value)
          .map((c: any) => c.text.value);
        if (texts.length > 0) {
          answer = texts.join('\n');
        }
      }
      res.json({ answer, citations });
    } else {
      res.status(500).json({ error: "Assistant não respondeu a tempo." });
    }

   




    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }

  


};

        


    
