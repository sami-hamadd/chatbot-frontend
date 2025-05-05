'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Alert,
    Box,
    ScrollArea,
    Stack,
    Center,
} from '@mantine/core';
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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userInput,
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setLoading(true);

        try {
            const lastSix = messages.slice(-6).map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));

            const requestPayload = {
                user_message: userInput,
                history: lastSix,
            };

            const response: ChatResponse = await sendChatMessage(requestPayload);

            const figureObject = response.figure ? JSON.parse(response.figure) : null;

            const newAssistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: response.role,
                content: response.content,
                figure: figureObject,
            };

            setMessages((prev) => [...prev, newAssistantMessage]);
        } catch (error: any) {
            console.error('Error:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const isEmpty = messages.length === 0;

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {isEmpty ? (
                <Center style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack align="center" gap="lg" px="md" maw={'1200px'}>
                        <AnimatedTitle />
                        <ChatInput onSend={handleSend} isEmpty />
                    </Stack>
                </Center>
            ) : (
                <>
                    <ScrollArea style={{ flexGrow: 1, }} scrollbarSize={20} mt="lg">
                        <Stack
                            gap="md"
                            style={{
                                paddingLeft: '1rem',
                                paddingRight: '5rem',
                                paddingTop: '1rem',
                                paddingBottom: '1rem',
                                maxWidth: '1200px',
                                margin: '0 auto',
                                width: '50%',
                                boxSizing: 'border-box',
                            }}
                        >
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    role={msg.role}
                                    content={msg.content}
                                    visualization={msg.figure}
                                />
                            ))}
                            {loading && (
                                <ChatMessage key="waiting" role="assistant" content={<TypingIndicator />} />
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
                            width: '70%',
                            padding: '1rem',
                            maxWidth: '1200px',
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
