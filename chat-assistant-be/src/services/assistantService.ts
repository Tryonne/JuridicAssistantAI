import { getClient } from "../config/openai";

// Read optional configuration from environment
const MODEL_ID = process.env.MODEL_ID || "gpt-4o-2";
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID;
let assistantId: string | undefined = process.env.ASSISTANT_ID;

const client = getClient();

// Base instructions moved from controller
const instructions = `

      És um assistente jurídico PT especializado em urbanismo/arquitetura. Responde exclusivamente com base nos documentos do vector store (RJUE, RGEU, etc.).
      Se a informação não estiver nos documentos, responde apenas:
      "A informação solicitada não está explicitamente presente nos documentos disponíveis."

      Obrigatório:
      - Inclui SEMPRE os artigos correspondentes à informação pedida (Artigo, n.º, alínea e diploma).
      - Não entregues resposta sem a secção "Fontes". Caso não consigas citar pelo menos um artigo, usa a mensagem acima.
      - Linguagem técnica, clara e objetiva; estrutura com títulos e listas quando útil; sem opiniões.

      Formato de saída:
      ## Resposta
      [texto]
      ## Fontes
      - RJUE: Artigo X.º[, n.º Y, alínea Z]
      - RGEU: Artigo ...
`;

type AskResult = { answer: string; citations: any[] };

export async function ensureAssistant(): Promise<string> {
  if (assistantId) return assistantId;

  const options: any = {
    model: MODEL_ID,
    name: "baltazar",
    instructions,
    tools: [{ type: "file_search" }],
  };

  if (VECTOR_STORE_ID) {
    options.tool_resources = {
      file_search: { vector_store_ids: [VECTOR_STORE_ID] },
    };
  }

  const response = await client.beta.assistants.create(options);
  assistantId = response.id;
  return assistantId;
}

export async function askAssistant(message: string, timeoutMs = 60_000): Promise<AskResult> {
  const aId = await ensureAssistant();

  // Create thread
  const thread = await client.beta.threads.create({});

  // Add user message
  await client.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });

  // Start run
  const run = await client.beta.threads.runs.create(thread.id, {
    assistant_id: aId,
  });

  // Poll until completion or timeout
  const start = Date.now();
  let runStatus = run.status as string;
  while (runStatus === "queued" || runStatus === "in_progress") {
    if (Date.now() - start > timeoutMs) {
      throw new Error("RUN_TIMEOUT");
    }
    await new Promise((r) => setTimeout(r, 1000));
    const statusRes = await client.beta.threads.runs.retrieve(run.id, {
      thread_id: thread.id,
    });
    runStatus = statusRes.status as string;
  }

  if (runStatus !== "completed") {
    throw new Error(`RUN_${String(runStatus).toUpperCase()}`);
  }

  // Collect assistant response
  const msgs = await client.beta.threads.messages.list(thread.id);
  const assistantMessage = msgs.data.reverse().find((m: any) => m.role === "assistant");

  let answer = "Sem resposta.";
  const citations: any[] = [];

  if (assistantMessage && Array.isArray(assistantMessage.content)) {
    const texts = assistantMessage.content
      .filter((c: any) => c.type === "text" && c.text?.value)
      .map((c: any) => c.text.value as string);
    if (texts.length > 0) {
      answer = texts.join("\n");
    }

    assistantMessage.content.forEach((c: any) => {
      if (Array.isArray(c.annotations)) {
        c.annotations.forEach((annotation: any) => {
          if (annotation.type === "file_citation") {
            citations.push(annotation.file_citation);
          }
        });
      }
    });
  }

  return { answer, citations };
}

