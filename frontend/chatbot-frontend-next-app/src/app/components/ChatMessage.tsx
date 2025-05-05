'use client';

import React, { useState, useRef, useEffect } from 'react';
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
const getPlainText = (content: React.ReactNode): string =>
    typeof content === 'string' ? content : '';
const useVoicesReady = () => {
    const [, update] = useState({});
    useEffect(() => {
        const handler = () => update({});
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', handler);
        }
        // Cleanup listener on unmount
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handler);
        }
    }, []);
};


/* ------------------------------------------------------------------
   Component
-------------------------------------------------------------------*/
interface ChatMessageProps {
    role: MessageRole;
    content: React.ReactNode;
    visualization?: React.ReactNode;
}

export default function ChatMessage({ role, content, visualization }: ChatMessageProps) {
    const computedColorScheme = useComputedColorScheme('light');
    const bg =
        role === 'user'
            ? computedColorScheme === 'light'
                ? '#f1f3f5'
                : '#00251c'
            : 'transparent';

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
                console.error("Failed to copy text: ", err);
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
        console.log("Calling synth.speak() with utterance:", utter);
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

    /* --------------------------- Render -----------------------------*/
    const renderContent = () => {
        if (typeof content !== 'string') return content;
        return parseFinalReply(content).map((part, idx) => {
            if (part.type === 'text') {
                return (
                    <Text dir="auto" key={idx} size="lg" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
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
                    <div key={idx}>
                        <DynamicTable data={convertJsonToTableData(part.content)} />
                    </div>
                );
            }
            return null;
        });
    };
    const actionGroupStyles = {
        backgroundColor: computedColorScheme === 'light' ? '#f8f9fa' : '#212529',
        border: `1px solid ${computedColorScheme === 'light' ? '#ced4da' : '#495057'}`,
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
                alignSelf: 'flex-start',
                marginBottom: '0.1rem',
                paddingBottom: isAssistant ? '50px' : undefined,
            }}
            radius={'lg'}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {renderContent()}

            {visualization && <div>{visualization}</div>}

            {isAssistant && hovered && (
                <Group
                    gap="xs"
                    w="fit-content"
                    style={{
                        ...actionGroupStyles,
                    }}
                >            {/* Thumb Up */}
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
                        styles={tooltipStyles}
                        transitionProps={{ transition: 'pop', duration: 150 }}
                    >
                        <ActionIcon size="sm" variant="subtle" color={actionColor}>
                            <IconThumbDown size={16} />
                        </ActionIcon>
                    </Tooltip>

                    {/* Copy Button */}
                    <Tooltip
                        label="نسخ"
                        withArrow
                        styles={tooltipStyles}
                        transitionProps={{ transition: 'pop', duration: 150 }}
                    >
                        <ActionIcon
                            size="sm"
                            variant="subtle"
                            onClick={handleCopy}
                            color={actionColor}
                        >
                            {copied ? <IconCheck size={16} color="green" /> : <IconCopy size={16} />}
                        </ActionIcon>
                    </Tooltip>

                    {/* Speak/Stop Button */}
                    <Tooltip
                        label={speaking ? 'إيقاف' : 'قراءة'}
                        withArrow
                        styles={tooltipStyles}
                        transitionProps={{ transition: 'pop', duration: 150 }}
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
                </Group>
            )}
        </Card>
    );
}