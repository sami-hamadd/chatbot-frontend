'use client';

import React, { useState } from 'react';
import {
    Tabs,
    TextInput,
    NavLink,
    Stack,
    ActionIcon,
    useComputedColorScheme,
    Group,
    NavLinkProps,
    Text,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import DatasetCard from '@/app/components/DatasetCard';
import NewChatButton from './NewChatButton';
import { theme } from 'theme';

function HoverableNavLink({
    isActive = false,
    ...props
}: NavLinkProps & { isActive?: boolean }) {
    const [hovered, setHovered] = useState(false);
    const computedColorScheme = useComputedColorScheme('light');
    const isDark = computedColorScheme === 'dark';

    const backgroundColor =
        isDark && (hovered || isActive) ? '#152f55' : 'transparent';

    const textColor = isActive ? '' : undefined;

    return (
        <NavLink
            {...props}
            active={isActive}
            style={{
                backgroundColor,
                transform: hovered ? 'translateY(-2px)' : 'none',
                transition: 'background-color 150ms ease, transform 100ms ease',
                cursor: 'pointer',
                color: textColor,
                fontWeight: isActive ? 600 : undefined,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        />
    );
}

const TABS = [
    {
        label: 'المحادثات',
        type: 'nav',
        links: ['تحليل السكان', 'إحصاءات التعليم', 'المرافق الصحية', 'المؤشرات الاقتصادية'],
    },
    {
        label: 'البيانات',
        type: 'dataset',
        datasets: [
            { title: 'Saudi Population Data 2023', source: 'data.gov.sa', format: 'CSV' },
            { title: 'Education Stats 2022', source: 'edu.gov.sa', format: 'CSV' },
            { title: 'Health Indicators', source: 'moh.gov.sa', format: 'CSV' },
        ],
    },
    {
        label: 'المشاريع',
        type: 'nav',
        links: ['مراجعة قطاع التعليم', 'تحليل التركيبة السكانية الإقليمية'],
    },
];

export default function TabsSidebar() {
    const computedColorScheme = useComputedColorScheme('light');
    const buttonColor = computedColorScheme === 'dark' ? theme?.colors?.goldAccent?.[7] : '#405276';

    // Separate states for active chat and active project
    // (Defaults: first chat = "تحليل السكان", first project = "مراجعة قطاع التعليم")
    const [activeChat, setActiveChat] = useState('تحليل السكان');
    const [activeProject, setActiveProject] = useState('مراجعة قطاع التعليم');

    return (
        <Tabs defaultValue={TABS[0].label} variant="default" w="100%">
            <Tabs.List grow mb="md">
                {TABS.map((tab) => (
                    <Tabs.Tab value={tab.label} key={tab.label}>
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {TABS.map((tab) => (
                <Tabs.Panel value={tab.label} key={tab.label}>
                    <Stack gap="xs" p={10}>
                        <Text fw="bold">المشروع الحالي: {activeProject}</Text>

                        <Group w="100%">
                            <TextInput
                                w="80%"
                                placeholder="بحث..."
                                leftSection={<IconSearch />}
                                styles={{
                                    input: {
                                        backgroundColor: computedColorScheme === 'dark' ? '#152f55' : '',
                                    },
                                }}
                            />

                            {tab.label === 'المحادثات' ? (
                                <NewChatButton />
                            ) : (
                                <ActionIcon size="md" variant="light" color={buttonColor}>
                                    <IconPlus />
                                </ActionIcon>
                            )}
                        </Group>

                        {/* Section Header based on Tab */}
                        {tab.label === 'المحادثات' && (
                            <Text size="sm" color="dimmed" mt="xs">
                                المحادثات السابقة
                            </Text>
                        )}

                        {tab.label === 'البيانات' && (
                            <Text size="sm" color="dimmed" mt="xs">
                                مصادر البيانات
                            </Text>
                        )}

                        {tab.label === 'المشاريع' && (
                            <Text size="sm" color="dimmed" mt="xs">
                                المشاريع
                            </Text>
                        )}

                        {/* Content Rendering */}
                        {tab.type === 'nav' &&
                            tab.links?.map((link) => {
                                const isActive =
                                    tab.label === 'المحادثات'
                                        ? link === activeChat
                                        : link === activeProject;

                                return (
                                    <HoverableNavLink
                                        key={link}
                                        label={link}
                                        isActive={isActive}
                                        onClick={() => {
                                            if (tab.label === 'المحادثات') {
                                                setActiveChat(link);
                                            } else if (tab.label === 'المشاريع') {
                                                setActiveProject(link);
                                            }
                                        }}
                                    />
                                );
                            })}

                        {tab.type === 'dataset' &&
                            tab.datasets?.map((ds) => (
                                <DatasetCard
                                    key={ds.title}
                                    title={ds.title}
                                    source={ds.source}
                                    format={ds.format}
                                />
                            ))}
                    </Stack>

                </Tabs.Panel>
            ))}
        </Tabs>
    );
}
