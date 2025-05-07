// src/app/components/ChatContainer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Alert, Box, ScrollArea, Stack, Center } from '@mantine/core';
import ChatMessage from '@/app/components/ChatMessage';
import ChatInput from '@/app/components/ChatInput';
import { Message } from '@/app/components/types';
import { sendChatMessage, ChatResponse } from '@/app/api/chat';
import { TypingIndicator } from '@/app/components/TypingIndicator';
import { IconAlertCircle } from '@tabler/icons-react';
import AnimatedTitle from '@/app/components/AnimatedTitle';

export default function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const handleClearChat = () => {
            setMessages([]);
            setError(null);
        };
        window.addEventListener('clear-chat', handleClearChat);
        return () => window.removeEventListener('clear-chat', handleClearChat);
    }, []);

    const handleSend = async (userInput: string) => {
        setError(null);
        // 1) add user bubble
        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userInput,
        };
        setMessages((prev) => [...prev, newUserMessage]);

        setLoading(true);
        try {
            // 2) call backend
            const response: ChatResponse = await sendChatMessage({ user_message: userInput });

            // 3) build assistant bubble
            const newAssistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                // if it's text, show in content; if it's image, put base64 in `image`
                content: response.type === 'text' ? response.content : '',
                image: response.type === 'image' ? response.content : undefined,
            };

            setMessages((prev) => [...prev, newAssistantMessage]);
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message ?? 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const isEmpty = messages.length === 0;

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {isEmpty ? (
                <Center style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack w={"100%"} align="center" gap="lg" px="lg" maw={'1200px'}>
                        <AnimatedTitle />
                        <ChatInput onSend={handleSend} isEmpty />
                    </Stack>
                </Center>
            ) : (
                <>
                    <ScrollArea style={{ flexGrow: 1 }} scrollbarSize={20} mt="lg">
                        <Stack
                            gap="md"
                            style={{
                                // padding: '1rem 5rem 1rem 1rem',
                                // maxWidth: '1200px',
                                // margin: '0 auto',
                                // width: '50%',
                                // boxSizing: 'border-box',
                                padding: '1.5rem',
                                margin: '0 auto',
                                width: '100%',
                                maxWidth: 900,
                                [`@media (min-width: 62em)`]: {
                                    width: '50%',
                                },
                            }}
                        >
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    role={msg.role}
                                    content={msg.content}
                                    image={msg.image}
                                />
                            ))}
                            {loading && (
                                <ChatMessage
                                    key="waiting"
                                    role="assistant"
                                    content=""
                                    image={undefined}
                                >
                                    <TypingIndicator />
                                </ChatMessage>
                            )}
                            {error && (
                                <Alert icon={<IconAlertCircle size={16} />} color="red">
                                    {error}
                                </Alert>
                            )}
                            <div ref={messagesEndRef} />
                        </Stack>
                    </ScrollArea>
                    <Box
                        style={{
                            position: 'sticky',
                            bottom: 0,
                            width: '100%',
                            maxWidth: 1200,
                            [`@media (min-width: 62em)`]: {
                                width: '70%',
                            },
                            // width: '70%',
                            padding: '1rem',
                            // maxWidth: '1200px',
                            margin: '0 auto',
                        }}
                    >
                        <ChatInput onSend={handleSend} isEmpty={false} />
                    </Box>
                </>
            )}
        </Box>
    );
}