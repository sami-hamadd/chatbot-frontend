// src/app/components/types.ts

export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;                 // local unique identifier
    role: MessageRole;          // 'user' or 'assistant'
    content: string;            // plain text
    image?: string;             // base64-encoded image, if any
}

export interface ChatResponse {
    role: 'assistant' | 'user';
    content: string;
    type: 'text' | 'image';
}
