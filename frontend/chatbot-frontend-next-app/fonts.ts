import localFont from 'next/font/local';

/**
 * Lina Sans – Arabic
 * (otf files in /public/fonts/lina-sans/)
 */
export const linaSans = localFont({
    src: [
        { path: '../public/fonts/lina-sans/Lina sans Light.otf', weight: '300', style: 'normal' },
        { path: '../public/fonts/lina-sans/Lina sans Regular.otf', weight: '400', style: 'normal' },
        { path: '../public/fonts/lina-sans/Lina sans Medium.otf', weight: '500', style: 'normal' },
        { path: '../public/fonts/lina-sans/Lina sans SemiBold.otf', weight: '600', style: 'normal' },
        { path: '../public/fonts/lina-sans/Lina sans Bold.otf', weight: '700', style: 'normal' },
    ],
    display: 'swap',
    preload: true,
});

/**
 * IBM Plex Sans – Latin
 * (ttf files in /public/fonts/ibm-plex-sans/)
 */
export const ibmPlexSans = localFont({
    src: [
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-Thin.ttf', weight: '100', style: 'normal' },
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-ExtraLight.ttf', weight: '200', style: 'normal' },
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-Light.ttf', weight: '300', style: 'normal' },
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal' },
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal' },
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal' },
        { path: '../public/fonts/ibm-plex-sans/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal' },
    ],
    display: 'swap',
    preload: true,
});

/** helper – returns the correct font family for a locale */
export const fontForLocale = (locale: string | undefined) =>
    locale?.startsWith('ar') ? linaSans.style.fontFamily : ibmPlexSans.style.fontFamily;
