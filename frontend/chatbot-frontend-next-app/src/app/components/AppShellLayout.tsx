'use client';

import React from 'react';
import {
    AppShell,
    ActionIcon,
    Group,
    Image,
    Tooltip,
    useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLayoutSidebarLeftExpand,
    IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';
import NextImage from 'next/image';
import DarkLogo from 'public/dark_logo.png';
import LightLogo from 'public/light_logo.png';
import ToggleThemeButton from '@/app/components/ToggleThemeButton';
import NewChatButton from '@/app/components/NewChatButton';
import TabsSidebar from '@/app/components/TabsSidebar';
import { theme } from 'theme';

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const computedColorScheme = useComputedColorScheme('light');
    const buttonColor = computedColorScheme === 'dark' ? '' : '#405276';

    return (
        <AppShell
            // navbar={{
            //     width: 300,
            //     breakpoint: 'sm',
            //     collapsed: {
            //         mobile: !mobileOpened,
            //         desktop: !desktopOpened,
            //     },
            // }}
            styles={{
                main: {
                    paddingTop: 100,
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: computedColorScheme === 'dark' ? theme?.colors?.mainColor?.[7] : '',
                    transition: 'padding-left 0.5s ease-in-out'

                },
                header: {
                    //height: 10,
                    backgroundColor: computedColorScheme === 'dark' ? theme?.colors?.mainColor?.[7] : '',
                },
                // navbar: {
                //     backgroundColor: computedColorScheme === 'dark' ? theme?.colors?.mainColor?.[7] : '',
                // },
            }}
            transitionDuration={500}
            transitionTimingFunction="ease-in-out"
        >
            <AppShell.Header withBorder={false} p={10} pr={30} pl={30} h={50}>
                <Group justify="space-between" align="flex-start" style={{ width: '100%' }}>
                    {/* <Group gap="xs" mt={40} mr={40}>
                        <Tooltip label="إظهار القائمة الجانبية">
                            <ActionIcon
                                onClick={toggleMobile}
                                hiddenFrom="sm"
                                size="md"
                                variant="light"
                                color={buttonColor}
                            >
                                <IconLayoutSidebarRightExpand />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="إظهار القائمة الجانبية">
                            <ActionIcon
                                onClick={toggleDesktop}
                                visibleFrom="sm"
                                size="md"
                                variant="light"
                                color={buttonColor}
                            >
                                <IconLayoutSidebarRightExpand />
                            </ActionIcon>
                        </Tooltip>
                    </Group> */}
                    {/* <Image
                        component={NextImage}
                        src={computedColorScheme === 'dark' ? DarkLogo : LightLogo}
                        alt="Chatbot Logo"
                        width={450}
                        height={150}
                    // style={{ alignSelf: 'flex-start' }}
                    /> */}
                    <Group mt={40}
                    >
                        <ToggleThemeButton />
                        <NewChatButton />
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main>{children}</AppShell.Main>

            {/* <AppShell.Navbar
                p="xs"
                withBorder
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Group justify="space-between" pt={20} pb={20} pl={10} pr={10} mt={20} w="100%" >
                    <Group>
                        <Tooltip label="إغلاق القائمة الجانبية">
                            <ActionIcon
                                onClick={toggleMobile}
                                hiddenFrom="sm"
                                size="md"
                                variant="light"
                                color={buttonColor}
                            >
                                <IconLayoutSidebarLeftExpand />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="إغلاق القائمة الجانبية">
                            <ActionIcon
                                onClick={toggleDesktop}
                                visibleFrom="sm"
                                size="md"
                                variant="light"
                                color={buttonColor}
                            >
                                <IconLayoutSidebarLeftExpand />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                <div style={{ flex: 1, width: '100%' }}>
                    <TabsSidebar />
                </div>

            </AppShell.Navbar> */}
        </AppShell>
    );
}