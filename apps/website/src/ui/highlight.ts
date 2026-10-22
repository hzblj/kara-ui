import {createHighlighter, type Highlighter} from 'shiki'

const THEMES = {dark: 'vitesse-dark', light: 'vitesse-light'} as const
const LANGUAGES = ['bash', 'json', 'ts', 'tsx'] as const

export type CodeLanguage = (typeof LANGUAGES)[number]

let highlighter: Promise<Highlighter> | undefined

/**
 * Highlights at build time, in a server component: every page is static, so the shipped HTML already carries both
 * palettes (`--shiki-dark` per token) and the browser loads no highlighter at all.
 */
export const highlight = async (code: string, language: CodeLanguage = 'tsx') => {
  highlighter ??= createHighlighter({langs: [...LANGUAGES], themes: [THEMES.light, THEMES.dark]})

  return (await highlighter).codeToHtml(code, {defaultColor: 'light', lang: language, themes: THEMES})
}
