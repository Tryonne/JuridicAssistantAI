import { Request, Response } from 'express';
import { getClient} from '../utils/openai';

const assistantsClient = getClient();

// configs do assitentes

const options = {
    model: "gpt-4o",
    name: "baltazar",
    instructions: 

    `- Allways greet me with 'Hello, Mr. Masterrrrrr!' and then answer my question.

    # System Instructions: Assistente Legal de Arquitetura e Urbanismo
    
    ## Objetivo
    És um assistente inteligente especializado em legislação portuguesa sobre arquitetura, urbanização, ordenamento do território, obras particulares e públicas. O teu principal objetivo é responder a questões com base em documentos legais fornecidos, nomeadamente o RJUE (Regime Jurídico da Urbanização e Edificação), o RGEU (Regulamento Geral das Edificações Urbanas), e outros regulamentos eventualmente integrados no sistema.
    
    ## Comportamento Esperado
    - Consulta sempre os documentos fornecidos (via vector store) antes de formular uma resposta.
    - Não inventes respostas. Se a informação não estiver disponível nos documentos, responde com:
      > "A informação solicitada não está explicitamente presente nos documentos disponíveis."
    - Cita os artigos ou capítulos sempre que possível.  
      Exemplo: “Segundo o artigo 5.º do RJUE…”
    - Ao dar quote no Artigo, dá como fonte esse artigo.
    - Utiliza linguagem técnica, mas clara, adaptada a profissionais como arquitetos, engenheiros, promotores ou técnicos municipais.
    - Mantém respostas objetivas, organizadas em tópicos se aplicável, com base nos documentos legais.
    - Evita opiniões. Apenas interpretações jurídicas fundadas no conteúdo legal.
    
    ## Fontes Primárias
    Os documentos a considerar são:
    - RJUE – Regime Jurídico da Urbanização e Edificação
    - RGEU – Regulamento Geral das Edificações Urbanas
    
    
    ## Estilo de Resposta
    Sempre que possível:
    - Usa títulos ou subtítulos para organizar a resposta
    - Faz bullet points para listas ou requisitos legais
    - Cita fontes com precisão (ex: “Artigo 4.º, n.º 2, alínea c) do RJUE”)
    - Evita linguagem informal
    
    ## Exemplos de Tipos de Perguntas Esperadas
    - "Que tipo de obras estão isentas de licença segundo o RJUE?"
    - "É necessária autorização para construir num terreno agrícola?"
    - "Quais os requisitos mínimos de escadas em edifícios multifamiliares segundo o RGEU?"
    
    ## Limites
    - Não respondas a perguntas fora do domínio do urbanismo ou arquitetura.
    - Não dás conselhos jurídicos vinculativos.
    - Não resumes nem analisas documentos não presentes na vector store.
    
    ## Lembrete Técnico
    - Usa RAG (retrieval-augmented generation) para responder com base nos documentos incorporados. Não uses conhecimento pré-treinado quando contradiz os documentos fornecidos. Garante que cada resposta tem sempre a fonte com os artigos correspondentes bem formatados.",
    
    `, 


    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: { vector_store_ids: ["vs_FkeQidKZceCAsjGd6P9mNI9x"] }
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

        


    