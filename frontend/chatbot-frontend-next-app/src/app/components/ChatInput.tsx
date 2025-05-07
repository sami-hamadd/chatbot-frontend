import React, { useState, useEffect } from 'react';
import { Textarea, Group, ActionIcon, useComputedColorScheme, Button } from '@mantine/core';
import { IconArrowUp, IconListSearch, IconSearch, IconMicrophone } from '@tabler/icons-react';
import { theme } from 'theme';

interface ChatInputProps {
    onSend: (message: string) => void;
    isEmpty?: boolean;
}

export default function ChatInput({ onSend, isEmpty = false }: ChatInputProps) {
    const [messageText, setMessageText] = useState('');
    const computedColorScheme = useComputedColorScheme('light');
    const isDark = computedColorScheme === 'dark';
    const [deepSearchActive, setDeepSearchActive] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Initialize recognition objects
    const [recognition, setRecognition] = useState<any>(null);
    const [speechRecognitionList, setSpeechRecognitionList] = useState<any>(null);

    const customColor = isDark ? '#00251c' : '#f1f3f5';
    const buttonColor = theme?.colors?.mainColor?.[1];

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                const speechRecognitionList = new SpeechGrammarList();

                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'ar-SA'; // Arabic Saudi Arabia

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setMessageText(prev => prev + ' ' + transcript);
                    setIsListening(false);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                setRecognition(recognition);
                setSpeechRecognitionList(speechRecognitionList);
            }
        }
    }, []);

    const handleSend = () => {
        if (messageText.trim() === '') return;
        onSend(messageText.trim());
        setMessageText('');
    };

    const handleStartListening = () => {
        if (recognition) {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
            setIsListening(!isListening);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const textAreaBgColor = customColor;
    const borderColor = isDark ? '1px solid grey' : '1px solid grey';
    return (
        <div
            style={{
                width: '600px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
            }}
        >
            <Textarea

                dir='auto'
                variant="unstyled"
                placeholder="...اسألني أي شيء"
                value={messageText}
                onChange={(e) => setMessageText(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                autosize
                minRows={isEmpty ? 1 : 1}
                maxRows={isEmpty ? 2 : 2}
                radius="xl"
                styles={{
                    input: {
                        backgroundColor: textAreaBgColor,
                        color: isDark ? 'white' : undefined,
                        textAlign: 'right',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        // border: 'transparent',
                        borderTop: borderColor,
                        borderLeft: borderColor,
                        borderRight: borderColor,
                        padding: isEmpty ? 40 : 15,
                        overflowY: 'auto',
                        '::placeholder': {
                            fontSize: '28px !important',
                        },
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
                    borderBottom: borderColor,
                    borderLeft: borderColor,
                    borderRight: borderColor,
                    width: '100%',
                    // border: 'none',
                }}
            >
                <Group justify="space-between" w="100%">
                    <Group>
                        <ActionIcon
                            size={30}
                            radius="xl"
                            variant={messageText.trim() === '' ? "outline" : "filled"}
                            onClick={handleSend}
                            // disabled={messageText.trim() === ''}
                            color={buttonColor}
                            mr={10}
                            mb={10}
                        >
                            <IconArrowUp />
                        </ActionIcon>
                        {recognition ? (
                            <ActionIcon
                                size={30}
                                radius="xl"
                                variant="filled"
                                onClick={handleStartListening}
                                color={isListening ? 'red' : buttonColor}
                                // mr={10}
                                mb={10}
                            >
                                <IconMicrophone size={20} color={isListening ? 'white' : undefined} />
                            </ActionIcon>
                        ) : (
                            <ActionIcon
                                size={30}
                                radius="xl"
                                variant="filled"
                                disabled
                                color="gray"
                                // mr={10}
                                mb={10}
                            >
                                <IconMicrophone size={20} />
                            </ActionIcon>
                        )}
                    </Group>

                    {/* <Button
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
                    </Button> */}
                </Group>
            </div>
        </div>
    );
}