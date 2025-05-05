'use client';

import React from 'react';
import { Button, Modal, Text, Group, useComputedColorScheme, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMessageCirclePlus, IconPlus } from '@tabler/icons-react';
import { theme } from 'theme';

export default function NewChatButton() {
    // Modal state for confirming a new chat
    const [opened, { open, close }] = useDisclosure(false);
    const computedColorScheme = useComputedColorScheme('light');
    const buttonColor = theme?.colors?.mainColor?.[1];
    // Clear chat event
    const clearChat = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('clear-chat'));
        }
        close();
    };

    return (
        <>
            <Button radius={"xl"} onClick={open} leftSection={<IconMessageCirclePlus size={20} />} variant={computedColorScheme === "dark" ? "filled" : "outline"} color={buttonColor}
            >
                محادثة جديدة
            </Button>
            {/* <ActionIcon size="md" variant="light" onClick={open} color={buttonColor}>
                <IconPlus />
            </ActionIcon> */}

            {/* Confirmation Modal */}
            <Modal dir="rtl" centered opened={opened} onClose={close} title="تأكيد بدأ محادثة جديدة">
                <Text>هل انت متأكد من انك تريد حذف المحادثة؟</Text>
                <Text>المحادثة لا يمكن استرجاعها.</Text>
                <Group mt="md" justify="center">
                    <Button variant="default" onClick={close}>الغاء</Button>
                    <Button color="red" onClick={clearChat}>تأكيد</Button>
                </Group>
            </Modal>
        </>
    );
}
