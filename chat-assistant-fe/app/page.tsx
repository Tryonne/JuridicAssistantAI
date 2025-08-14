'use client';

import { Navbar } from '@/components/navbar/navbar';
import { useEffect, useState, type FormEventHandler } from 'react';
import { tokens } from '@/lib/mocks';


import {
  AIInput,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from '@/components/ui/kibo-ui/ai/input';
import { AIConversation, AIConversationContent, AIConversationScrollButton } from '@/components/ui/kibo-ui/ai/conversation';

import { GlobeIcon, MicIcon, PlusIcon } from 'lucide-react';
import ChatMessages from '@/components/chat/chatMessages'; 
import { AIResponse } from '@/components/ui/kibo-ui/ai/response';




const models = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'openai.com' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai.com' },
  { id: 'claude-2', name: 'Claude 2', provider: 'anthropic.com' },
  { id: 'claude-instant', name: 'Claude Instant', provider: 'anthropic.com' },
  { id: 'palm-2', name: 'PaLM 2', provider: 'google.com' },
  { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'meta.com' },
  { id: 'llama-2-13b', name: 'Llama 2 13B', provider: 'meta.com' },
  { id: 'cohere-command', name: 'Command', provider: 'cohere.com' },
  { id: 'mistral-7b', name: 'Mistral 7B', provider: 'mistral.ai' },
];

type Citation = {
  file_name: string;
  page?: number;
  quote: string;
};


type Message = {
  from: 'user' | 'assistant';
  content: string;
  avatar: string;
  name: string;
  citations?: Citation[]; // para adicionar citações opcionais (?)
};

export default function Page() {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [status, setStatus] = useState<'submitted' | 'streaming' | 'ready' | 'error'>('ready');
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'assistant',
      content: 'Olá, como posso ajudar?',
      avatar: 'https://github.com/openai.png',
      name: 'OpenAI',
    },
  ]);


  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!text) return;
  
    const userMessage: Message = {
      from: 'user',
      content: text,
      avatar: 'https://github.com/shadcn.png',
      name: 'Tu',
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setText('');
    setStatus('submitted');


    
  
    try {
      // Faz o POST para o backend
      const response = await fetch('http://localhost:3000/assistant/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
  
      if (!response.ok) throw new Error('Erro na resposta do servidor');
  
      const data = await response.json();
      
      const botMessage: Message = {
        from: 'assistant',
        content: data.answer || 'Sem resposta.',
        avatar: 'https://github.com/openai.png',
        name: 'OpenAI',
        citations: data.citations || [], // <-- INCLUÍDO
      };
  
      setMessages((prev) => [...prev, botMessage]);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setMessages((prev) => [
        ...prev,
        {
          from: 'assistant',
          content: 'Erro ao comunicar com o backend!!!',
          avatar: 'https://github.com/openai.png',
          name: 'OpenAI',
        },
      ]);
    }
  };
  
 
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      {/* Mensagens no topo */}
      <AIConversation>
        <AIConversationContent>
          <ChatMessages messages={messages} />
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      

      {/* Input fixo em baixo */}
      <AIInput onSubmit={handleSubmit}>
        <AIInputTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreve a tua mensagem..."
        />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton>
              <PlusIcon size={16} />
            </AIInputButton>
            <AIInputButton>
              <MicIcon size={16} />
            </AIInputButton>
            <AIInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </AIInputButton>
           
          </AIInputTools>
          <AIInputSubmit disabled={!text} status={status} />
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}
