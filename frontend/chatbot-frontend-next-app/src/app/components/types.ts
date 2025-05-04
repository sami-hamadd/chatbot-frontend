export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;        // local unique identifier
    role: MessageRole; // 'user' or 'assistant'
    content: string;
    figure?: any;      // optional plotly figure
}

export interface ChatResponse {
    role: 'assistant' | 'user';
    content: string;
    type: 'text' | 'image';
}