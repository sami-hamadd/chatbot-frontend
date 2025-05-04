'use client';

import React from 'react';
import { Card, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { MessageRole } from '@/app/components/types';
// import ChatVisualization from '@/app/components/ChatVisualzation';
import DynamicTable from '@/app/components/DynamicTable';
import { parseFinalReply, convertJsonToTableData } from '@/app/utils/jsonParser';

interface ChatMessageProps {
    role: MessageRole;
    content: React.ReactNode;
    visualization?: any;
}

export default function ChatMessage({ role, content, visualization }: ChatMessageProps) {
    const computedColorScheme = useComputedColorScheme('light');
    const backgroundColor = role === 'user' ? (computedColorScheme === 'light' ? '#f1f3f5' : '#00251c') : 'transparent';
    const alignSelf = role === 'user' ? 'flex-start' : 'flex-start';

    return (
        <Card
            p={role === 'user' ? "15px" : ''}
            radius="xl"
            w={role === 'user' ? 'fit-content' : '100%'}
            maw={role === 'user' ? '70%' : '95%'}
            style={{
                backgroundColor,
                alignSelf,
                marginBottom: '0.1rem',
            }}
        >
            {typeof content === 'string' ? (
                parseFinalReply(content).map((part, index) => {
                    if (part.type === 'text') {
                        return (
                            <Text dir="auto" key={index} size="lg" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                                {part.content.split(/(\[https:\/\/[^\]]+\])/g).map((segment: string, i: number) => {
                                    const match = segment.match(/\[(https:\/\/[^\]]+)\]/);
                                    return match ? (
                                        <a
                                            key={i}
                                            href={match[1]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#007BFF', textDecoration: 'underline' }}
                                        >
                                            {match[1]}
                                        </a>
                                    ) : (
                                        segment
                                    );
                                })}
                            </Text>
                        );
                    }

                    if (part.type === 'json') {
                        const tableData = convertJsonToTableData(part.content);
                        return (
                            <div key={index}>
                                <DynamicTable data={tableData} />
                            </div>
                        );
                    }

                    return null;
                })
            ) : (
                content
            )}

            {visualization && (
                <div>
                    {/* <ChatVisualization generatedChart={visualization} /> */}
                </div>
            )}
        </Card>
    );
}
