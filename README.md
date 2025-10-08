

# Legal AI Assistant  

> *Retrieval-Augmented Legal Assistant built with Azure OpenAI, RAG and advanced Prompt Engineering.*

---

![Vdeosemttulo-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/3c1370ed-274a-49ee-9670-ba74df21e1e5)



## Overview

The **Zumer Legal AI Assistant** is a web-based application that demonstrates how **Large Language Models (LLMs)** and **Retrieval-Augmented Generation (RAG)** can be used to improve access to **technical and regulatory documentation** — specifically, Portuguese legislation related to the architecture and construction sector (RJUE and RGEU).
Developed during my internship at **Zumer**, a technology company operating in the **Architecture, Engineering and Construction (AEC)** domain, the project aimed to create an **AI-powered assistant** capable of answering legal and technical questions accurately, transparently, and with proper source citation.
The solution combines **Prompt Engineering**, **vector-based retrieval**, and **LLM orchestration**, aligning perfectly with **Complear’s mission** to build AI tools that transform how regulated industries manage and generate technical documentation.

---

## Core Objectives

-  Apply **LLM-based reasoning** to regulatory documentation.  
-  Build a **retrieval-grounded question–answering system (RAG)**.  
-  Use **Prompt Engineering** to ensure consistent and citation-based responses.  
-  Format files to better use **vector databases**.
-  Design a **modular, full-stack web app** deployable in real environments.  
-  Demonstrate technical and methodological alignment with regulated software workflows (traceability, transparency, evidence-based answers).

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React.js, TypeScript, Shadcn-UI, Kibo-UI | Chat interface with modern component design |
| **Backend** | Node.js, Express, TypeScript | API integration with Azure OpenAI |
| **AI Engine** | Azure AI Foundry (GPT-4.0,GPT-4.1,GPT-5...) | LLM orchestration, RAG and tool calling |
| **Vector Store** | Azure File Search | Embedding-based document retrieval |
| **Prompt Design** | Modular system & few-shot structure | Legal-context grounding and source citation |
| **Development Tools** | Postman, Git, VSCode | Testing and debugging |

---

## Retrieval-Augmented Generation (RAG)

RAG integration ensures traceable and verifiable outputs:

1. The user asks a question (e.g. “Which works are exempt from license under RJUE?”).

2. The system retrieves the most relevant chunks from RJUE/RGEU via vector embeddings.

3. The model generates a citation-based answer grounded in the retrieved context.

## Possible Future Enhancements

- Deploy containerized version (Docker + CI/CD pipeline).
- Fine tuning a model for this specific project.
- Introduce feedback scoring (“useful / not useful”) to improve model performance.
- Transition towards AI Agents with reasoning and memory (long-term context tracking).
- Add source preview pane with dynamic legal text expansion at the side bar.

## Author

Guilherme do Carmo Nunes
BSc in Computer Science – Escola Superior de Gestão e Tecnologia (IPSantarém)
Developed at Zumer (2025)

linkedin: www.linkedin.com/in/guilherme-nunes-8b38352ba
github: https://github.com/Tryonne

---

## TO RUN 

- RUN BACKEND: npx ts-node src/app.ts
- RUN FRONTEND: npm run dev

#### .env:
- AZURE_OPENAI_KEY='#####'
- AZURE_OPENAI_ENDPOINT='######'
