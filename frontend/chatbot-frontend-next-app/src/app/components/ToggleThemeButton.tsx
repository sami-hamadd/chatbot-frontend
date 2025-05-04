import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ToggleThemeButton() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');
    const buttonColor = '#337d6a';

    const toggleColorScheme = () =>
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');

    return (
        <Tooltip label="تغيير الوضع الليلي / النهاري ">
            <ActionIcon
                radius={"lg"}
                onClick={toggleColorScheme}
                size="lg"
                mt={20}
                variant="light"
                color={buttonColor}
            >
                {computedColorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
        </Tooltip>
    );
}
