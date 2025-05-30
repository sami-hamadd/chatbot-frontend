import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { theme } from "theme";

export default function ToggleThemeButton() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light');
    const buttonColor = theme?.colors?.mainColor?.[0];

    const toggleColorScheme = () =>
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');

    return (
        <Tooltip label="تغيير الوضع الليلي / النهاري ">
            <ActionIcon
                radius={"lg"}
                onClick={toggleColorScheme}
                size="lg"
                variant={computedColorScheme === "dark" ? "filled" : "outline"}
                color={buttonColor}
            >
                {computedColorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
        </Tooltip>
    );
}
