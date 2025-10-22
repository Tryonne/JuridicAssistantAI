'use client';

import {
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from '@/components/ui/kibo-ui/ai/message';
import { AIResponse } from '@/components/ui/kibo-ui/ai/response';

interface Citation {
  file_name: string;
  page?: number;
  quote: string;
}

interface Message {
  from: 'user' | 'assistant';
  content: string;
  avatar: string;
  name: string;
  citations?: Citation[];
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <AIMessage key={index} from={message.from}>
          <AIMessageAvatar src={message.avatar} name={message.name} />
          <AIMessageContent>
            <AIResponse>{message.content}</AIResponse>
            {/* Adiciona as citações, se existirem e só para o assistant */}
            {message.from === 'assistant' && message.citations && message.citations.length > 0 && (
              <div className="mt-2 bg-gray-100 p-2 rounded text-xs shadow">
                <strong>Fonte{message.citations.length > 1 ? 's' : ''}:</strong>
                {message.citations.map((citation, idx) => (
                  <div key={idx} className="mt-1">
                    <span className="text-xs text-gray-600">
                      {citation.file_name}
                      {citation.page ? ` (pág. ${citation.page})` : ''}
                    </span>
                    <blockquote className="italic border-l-2 pl-2 my-1 text-sm">
                      {citation.quote}
                    </blockquote>
                  </div>
                ))}
              </div>
            )}
          </AIMessageContent>
        </AIMessage>
      ))}
    </div>
  );
};

export default ChatMessages;
