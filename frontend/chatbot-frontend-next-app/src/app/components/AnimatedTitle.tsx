'use client';

import { Title } from '@mantine/core';
import React, { useState, useEffect } from 'react';

const AnimatedTitle: React.FC = () => {
    const text = "مرحباً، كيف يمكنني مساعدتك اليوم؟";
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!isDeleting && index < text.length) {
            // Typing: add one character at a time (faster: 100ms instead of 150ms)
            timeout = setTimeout(() => {
                setDisplayedText(text.substring(0, index + 1));
                setIndex(index + 1);
            }, 50);
        } else if (!isDeleting && index === text.length) {
            // // Pause before deleting (faster: 1000ms instead of 2000ms)
            // timeout = setTimeout(() => {
            //     setIsDeleting(true);
            // }, 1500);
        } else if (isDeleting && index > 0) {
            // timeout = setTimeout(() => {
            //     setDisplayedText(text.substring(0, index - 1));
            //     setIndex(index - 1);
            // }, 50);
        } else if (isDeleting && index === 0) {
            // // Pause before typing again (faster: 300ms instead of 500ms)
            // timeout = setTimeout(() => {
            //     setIsDeleting(false);
            // }, 200);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, index, isDeleting, text]);

    return <Title order={3} mb={0}>{displayedText}</Title>;
};

export default AnimatedTitle;
