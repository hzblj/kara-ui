import {adaptive, defineTheme, type ThemeConfig} from '@hzblj/kara-ui'

/**
 * Two brand accents written the way an app would write its own theme: every accent token overridden in one place, and
 * the Android seed moved with them so Material controls grow from the same hue. The default accent needs no entry —
 * `undefined` is the library's own palette.
 */
const indigo = defineTheme({
  colors: {
    border: {accent: '#4f46e5'},
    content: {accent: adaptive({dark: '#a5b4fc', light: '#4338ca'})},
    fill: {
      accent: {
        base: adaptive({dark: '#6366f133', light: '#eef2ff'}),
        disabled: adaptive({dark: '#6366f11f', light: '#e0e7ff'}),
        primary: '#4f46e5',
      },
    },
    shadow: {btn: {accent: {ring: adaptive({dark: '#4f46e500', light: '#c7d2fe'})}}},
  },
  materialSeed: '#4f46e5',
})

const teal = defineTheme({
  colors: {
    border: {accent: '#0d9488'},
    content: {accent: adaptive({dark: '#5eead4', light: '#0f766e'})},
    fill: {
      accent: {
        base: adaptive({dark: '#14b8a633', light: '#f0fdfa'}),
        disabled: adaptive({dark: '#14b8a61f', light: '#ccfbf1'}),
        primary: '#0d9488',
      },
    },
    shadow: {btn: {accent: {ring: adaptive({dark: '#0d948800', light: '#99f6e4'})}}},
  },
  materialSeed: '#0d9488',
})

/**
 * Material You: on Android 12+ the scheme and the accent follow the wallpaper. iOS has no wallpaper colours, so there
 * it is the default accent.
 */
const wallpaper = defineTheme({dynamicColor: true})

export const ACCENTS = {default: undefined, indigo, teal, wallpaper} as const satisfies Record<
  string,
  ThemeConfig | undefined
>

export type Accent = keyof typeof ACCENTS

export const ACCENT_ORDER = ['default', 'indigo', 'teal', 'wallpaper'] as const satisfies readonly Accent[]

export const ACCENT_LABELS = ['Orange', 'Indigo', 'Teal', 'Wallpaper']
