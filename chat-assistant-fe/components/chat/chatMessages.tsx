'use client';

import {
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from '@/components/ui/kibo-ui/ai/message';
import { AIResponse } from '@/components/ui/kibo-ui/ai/response';

interface Message {
  from: 'user' | 'assistant';
  content: string;
  avatar: string;
  name: string;
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
          </AIMessageContent>
        </AIMessage>
      ))}
    </div>
  );
};

export default ChatMessages;