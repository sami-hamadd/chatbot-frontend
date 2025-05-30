// src/app/components/ChatMessage.tsx
'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import {
    Card,
    Text,
    useComputedColorScheme,
    ActionIcon,
    Group,
    Tooltip,
} from '@mantine/core';
import {
    IconThumbUp,
    IconThumbDown,
    IconCopy,
    IconVolume2,
    IconPlayerStop,
    IconCheck,
} from '@tabler/icons-react';

import { MessageRole } from '@/app/components/types';
import DynamicTable from '@/app/components/DynamicTable';
import { parseFinalReply, convertJsonToTableData } from '@/app/utils/jsonParser';
import { theme } from 'theme';

/* ------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------*/
const isArabic = (txt: string) => /\p{Script=Arabic}/u.test(txt);

const pickVoice = (langPrefix: string): SpeechSynthesisVoice | undefined => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return undefined;
    const byLang = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    const local = byLang.find((v) => v.localService);
    if (local) return local;
    const google = byLang.find((v) => v.name.toLowerCase().includes('google'));
    if (google) return google;
    return byLang[0];
};

const getPlainText = (content: string): string => content;

const useVoicesReady = () => {
    const [, update] = useState({});
    useEffect(() => {
        const handler = () => update({});
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', handler);
        }
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handler);
        };
    }, []);
};

/* ------------------------------------------------------------------
   Component
-------------------------------------------------------------------*/
interface ChatMessageProps {
    role: MessageRole;
    content: string;       // plain text (may be empty if image)
    image?: string;        // base‑64 PNG/JPEG if backend returned an image
    children?: ReactNode;  // typing indicator, etc.
}

export default function ChatMessage({
    role,
    content,
    image,
    children,
}: ChatMessageProps) {
    const computedColorScheme = useComputedColorScheme('light');
    const bg =
        role === 'user'
            ? (computedColorScheme === 'light'
                ? theme?.colors?.mainColor?.[1]
                : theme?.colors?.mainColor?.[4])
            : (computedColorScheme === 'light'
                ? '#f1f3f5'
                : '#292929');


    // '#f1f3f5';
    const textColor =
        role === 'user'
            ? computedColorScheme === 'light'
                ? '#ffffff'
                : '#ffffff'
            : computedColorScheme === 'dark'
                ? '#ffffff'
                : '#000000';
    const isAssistant = role !== 'user';
    const [hovered, setHovered] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [copied, setCopied] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useVoicesReady();

    const tooltipStyles = {
        tooltip: {
            backgroundColor: computedColorScheme === 'light' ? '#e9ecef' : '#343a40',
            border: `1px solid ${computedColorScheme === 'light' ? '#ced4da' : '#495057'}`,
            color: computedColorScheme === 'light' ? '#212529' : '#f8f9fa',
        },
        arrow: {
            backgroundColor: computedColorScheme === 'light' ? '#e9ecef' : '#343a40',
            border: `1px solid ${computedColorScheme === 'light' ? '#ced4da' : '#495057'}`,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
        }
    };

    /* --------------------------- Clipboard --------------------------*/
    const handleCopy = () => {
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current);
            copyTimeoutRef.current = null;
        }
        navigator.clipboard
            .writeText(getPlainText(content))
            .then(() => {
                setCopied(true);
                copyTimeoutRef.current = setTimeout(() => {
                    setCopied(false);
                    copyTimeoutRef.current = null;
                }, 1000);
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
                setCopied(false);
            });
    };

    /* ------------------------- Text‑to‑speech -----------------------*/
    const speak = () => {
        console.log("Available Arabic Voices:", speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('ar')));
        const synth = window.speechSynthesis;
        const text = getPlainText(content).trim();
        console.log("Attempting to speak:", text);
        if (!text) return;
        const langPrefix = isArabic(text) ? 'ar' : 'en';
        console.log("Language prefix:", langPrefix);
        const utter = new SpeechSynthesisUtterance(text);
        const chosenVoice = pickVoice(langPrefix);
        console.log("Chosen voice:", chosenVoice);
        if (chosenVoice) {
            utter.voice = chosenVoice;
            utter.lang = chosenVoice.lang;
            console.log("Using voice:", chosenVoice.name, chosenVoice.lang);
        } else {
            console.log("No specific voice found, trying fallback lang:", langPrefix === 'ar' ? 'ar-SA' : 'en-US');
            utter.lang = langPrefix === 'ar' ? 'ar-SA' : 'en-US';
        }
        if (langPrefix === 'ar') utter.rate = 0.9;
        utter.onend = () => {
            console.log("Speech finished.");
            setSpeaking(false);
        };
        utter.onerror = (event) => {
            console.error("SpeechSynthesisUtterance.onerror - Error:", event.error, "Utterance:", utter);
            setSpeaking(false);
        };
        utteranceRef.current = utter;
        setSpeaking(true);
        try {
            synth.speak(utter);
        } catch (e) {
            console.error("Error calling synth.speak:", e);
            setSpeaking(false);
        }
    };
    const handleSpeakToggle = () => {
        const synth = window.speechSynthesis;
        if (speaking) {
            synth.cancel();
            setSpeaking(false);
        } else {
            synth.cancel();
            speak();
        }
    };

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, [content]);

    /* ------------------------ Rendering logic ----------------------*/
    const renderTextContent = () =>
        parseFinalReply(content).map((part, idx) => {
            if (part.type === 'text') {
                return (
                    <Text ta={"right"} dir="auto" key={idx} size="lg" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                        {part.content.split(/(\[https:\/\/[^\]]+\])/g).map((seg: string, i: number) => {
                            const match = seg.match(/\[(https:\/\/[^\]]+)\]/);
                            return match ? (
                                <a key={i} href={match[1]} target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>
                                    {match[1]}
                                </a>
                            ) : (
                                seg
                            );
                        })}
                    </Text>
                );
            }
            if (part.type === 'json') {
                return (
                    <DynamicTable
                        key={idx}
                        data={convertJsonToTableData(part.content)}
                    />
                );
            } else if (part.type === 'table') {
                // --- NEW: Markdown Table Rendering ---
                // The content should already be in the { data: [...] } format from parseMarkdownTable
                const tableData = part.content?.data || [];
                return tableData.length > 0 ? (
                    <DynamicTable
                        key={`md-table-${idx}`}
                        data={tableData}
                    />
                ) : null; // Don't render if Markdown table parsing failed or yielded no data
            }
            return null;
        });

    const actionGroupStyles = {
        // backgroundColor: computedColorScheme === 'light' ? '#f8f9fa' : '#00251c',
        // border: `1px solid ${computedColorScheme === 'light' ? '#ced4da' : '#495057'}`,
        borderRadius: 8,
        padding: 4,
        position: 'absolute' as const,
        bottom: '4px',
        left: '10px',
        zIndex: 1,
    };
    const actionColor = computedColorScheme === 'light' ? '' : 'white';

    return (
        <Card
            style={{
                position: 'relative',
                backgroundColor: bg,
                color: textColor,
                alignSelf: isAssistant ? 'flex-end' : 'flex-start',
                marginBottom: '0.1rem',
                paddingBottom: isAssistant && (content || image) ? '50px' : undefined,
                // minWidth: isAssistant ? 700 : 0,
                // maxWidth: '100%',
                maxWidth: '100%',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
            }}
            radius="xl"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Typing indicator takes precedence */}
            {children ? (
                children
            ) : image ? (
                /* Base‑64 image rendering */
                <img
                    src={`data:image/png;base64,${image}`}
                    alt="Generated by AI"
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: 8,
                        border: `1px solid ${computedColorScheme === 'light' ? '#ced4da' : '#495057'}`,
                    }}
                />

            ) : (
                /* Plain / rich‑parsed text */
                renderTextContent()
            )}

            {/* Assistant action buttons */}
            {isAssistant && hovered && !children && (
                <Group gap="xs" w="fit-content" style={actionGroupStyles} wrap='nowrap'>
                    {/* Thumb Up */}
                    <Tooltip
                        label="أعجبني"
                        withArrow
                        styles={tooltipStyles}
                        transitionProps={{ transition: 'pop', duration: 150 }}
                    >
                        <ActionIcon size="sm" variant="subtle" color={actionColor}>
                            <IconThumbUp size={16} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Thumb Down */}
                    <Tooltip
                        label="لم يعجبني"
                        withArrow
                        transitionProps={{ transition: 'pop', duration: 150 }}
                        styles={tooltipStyles}
                    >
                        <ActionIcon size="sm" variant="subtle" color={actionColor}>
                            <IconThumbDown size={16} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Copy */}
                    {!!content && (
                        <Tooltip
                            label="نسخ"
                            withArrow
                            transitionProps={{ transition: 'pop', duration: 150 }}
                            styles={tooltipStyles}
                        >
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                onClick={handleCopy}
                                color={actionColor}
                            >
                                {copied ? (
                                    <IconCheck size={16} color="green" />
                                ) : (
                                    <IconCopy size={16} />
                                )}
                            </ActionIcon>
                        </Tooltip>
                    )}

                    {/* Speak / Stop */}
                    {!!content && (
                        <Tooltip
                            label={speaking ? 'إيقاف' : 'قراءة'}
                            withArrow
                            transitionProps={{ transition: 'pop', duration: 150 }}
                            styles={tooltipStyles}
                        >
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                onClick={handleSpeakToggle}
                                color={actionColor}
                            >
                                {speaking ? <IconPlayerStop size={16} /> : <IconVolume2 size={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
            )}
        </Card>
    );
}