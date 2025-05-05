// src/app/api/chat.ts
export interface ChatResponse {
    role: 'assistant' | 'user';
    content: string;
    type: 'text' | 'image';
}

/**
 * Where is the FastAPI server running?
 * ‑ You can set NEXT_PUBLIC_API_URL in .env.local (e.g. http://127.0.0.1:8000)
 * ‑ If not set, we fall back to localhost:8000.
 */
const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:8000';

export async function sendChatMessage(payload: {
    user_message: string;
}): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/send_request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_inquiry: payload.user_message }),
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as {
        response: string;
        type: 'text' | 'image';
    };

    return {
        role: 'assistant',
        content: data.response,
        type: data.type,
    };
}
