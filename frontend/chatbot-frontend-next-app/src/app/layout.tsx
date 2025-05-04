'use client';

import '@mantine/core/styles.css';
import React from 'react';
import {
  MantineProvider,
  ColorSchemeScript,
} from '@mantine/core';
import { theme } from 'theme';
import AppShellLayout from '@/app/components/AppShellLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mantine-color-scheme="dark" dir='rtl'>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
        <title>Chatbot</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Signika:wght@300..700&display=swap" rel="stylesheet" />
        {/* <style>
          {`html, body {
          margin: 0;
          padding: 0;
          max-width: 100vw;
          overflow-x: hidden;
          }`}
        </style> */}
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <AppShellLayout>{children}</AppShellLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
