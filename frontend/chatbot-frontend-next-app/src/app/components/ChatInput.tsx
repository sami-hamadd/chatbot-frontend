'use client';

import React, { useState } from 'react';
import { Textarea, Group, ActionIcon, useComputedColorScheme, Button } from '@mantine/core';
import { IconArrowUp, IconListSearch, IconSearch } from '@tabler/icons-react';
import { theme } from 'theme';

interface ChatInputProps {
    onSend: (message: string) => void;
    // A boolean flag to indicate if the conversation is empty
    isEmpty?: boolean;
}

export default function ChatInput({ onSend, isEmpty = false }: ChatInputProps) {
    const [messageText, setMessageText] = useState('');
    const computedColorScheme = useComputedColorScheme('light');
    const isDark = computedColorScheme === 'dark';
    const [deepSearchActive, setDeepSearchActive] = useState(false);

    // Customize as needed
    const customColor = isDark ? '#00251c' : '#f1f3f5';
    const buttonColor = theme?.colors?.mainColor?.[1];

    const handleSend = () => {
        if (messageText.trim() === '') return;
        onSend(messageText.trim());
        setMessageText('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };
    const textAreaBgColor = customColor;

    return (
        <div
            style={{
                width: '600px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
                // direction: 'rtl',
                scrollMargin: 0,
            }}
        >
            <Textarea
                dir='auto'
                variant="filled"
                placeholder="...اسألني أي شيء"
                value={messageText}
                onChange={(e) => setMessageText(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                autosize
                minRows={isEmpty ? 5 : 1}
                maxRows={isEmpty ? 5 : 2}
                radius="xl"
                styles={{
                    input: {
                        backgroundColor: textAreaBgColor,
                        color: isDark ? 'white' : undefined,
                        textAlign: 'right',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        border: 'none',
                        padding: isEmpty ? 40 : 15,
                        overflowY: 'auto',
                    },
                }}
                style={{
                    minHeight: isEmpty ? 100 : 0,
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${textAreaBgColor} transparent`,
                }}
            />

            <div
                style={{
                    backgroundColor: textAreaBgColor,
                    padding: '8px',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 35,
                    borderBottomRightRadius: 35,
                    width: '100%',
                    border: 'none',
                }}
            >
                <Group justify="space-between" w="100%">

                    <ActionIcon
                        size={40}
                        radius="xl"
                        variant="filled"
                        onClick={handleSend}
                        disabled={messageText.trim() === ''}
                        color={buttonColor}
                        mr={10}
                        mb={10}
                    >
                        <IconArrowUp />
                    </ActionIcon>
                    <Button
                        size="compact-sm"
                        radius="xl"
                        variant={deepSearchActive ? 'filled' : 'outline'}
                        color={theme?.colors?.mainColor?.[1]}
                        onClick={() => setDeepSearchActive(prev => !prev)}
                        style={{ fontSize: '10px' }}
                        rightSection={<IconSearch size={15} />}
                        ml={10}
                        mb={10}
                    >
                        Deep Search
                    </Button>

                </Group>
            </div>
        </div>
    );
}
