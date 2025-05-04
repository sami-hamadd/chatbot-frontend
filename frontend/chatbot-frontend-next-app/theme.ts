"use client";

import { MantineColorsTuple, MantineThemeOverride } from '@mantine/core';
import localFont from 'next/font/local'

export const arabicFont = localFont({ src: './style/fonts/Lina sans Regular.otf' })

const mainColor: MantineColorsTuple = ["#005D45", "#00543E", "#004A37", "#004130", "#003829", "#002F23", "#00251C", "#001C15", "#00130E", "#000907", "#00000"]


export const theme: MantineThemeOverride = {
    colors: {
        mainColor,
    },
    primaryColor: 'mainColor',
    fontFamily: 'arabicFont, ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol',

    headings: {
        fontFamily: 'arabicFont, ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol'
    },
};



