'use client';

import React, { useState } from 'react';
import { Card, Text, Badge, Group, Anchor, Stack, useComputedColorScheme } from '@mantine/core';

interface DatasetCardProps {
    title: string;
    source: string;
    format: string;
}

export default function DatasetCard({ title, source, format }: DatasetCardProps) {
    const [hovered, setHovered] = useState(false);
    const computedColorScheme = useComputedColorScheme('light');
    const isDark = computedColorScheme === 'dark';

    const backgroundColor = hovered
        ? isDark
            ? '#152f55' // Dark theme hover
            : '#f1f3f5' // Light theme hover (light gray from Mantine)
        : 'transparent';

    return (
        <Card
            withBorder
            radius="md"
            padding="xs"
            shadow="sm"
            style={{
                backgroundColor,
                cursor: 'pointer',
                transition: 'background-color 150ms ease, transform 100ms ease',
                transform: hovered ? 'translateY(-2px)' : 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Stack gap="xs">
                <Text fw={500}>{title}</Text>
                <Group align="apart">
                    <Anchor size="sm" color="dimmed">
                        {source}
                    </Anchor>
                    <Badge variant="light" color="gray">
                        {format}
                    </Badge>
                </Group>
            </Stack>
        </Card>
    );
}
