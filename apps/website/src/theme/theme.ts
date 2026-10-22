export type Theme = 'dark' | 'light'
export type Platform = 'android' | 'ios'

/** The cookie the toggle writes and {@link HEAD_SCRIPT} reads back before the first paint. */
export const THEME_COOKIE = 'kara-theme'
/** Which platform's screenshots the reader last picked — iOS until they pick Android. */
export const PLATFORM_COOKIE = 'kara-platform'

const MAX_AGE = 60 * 60 * 24 * 365

/**
 * Resolves the root's appearance and platform before the body is parsed, so the first paint is already right — the
 * palette, and which of each pair of device images is shown. An inline `<script>` in `<head>`: `next/script` queues even
 * `beforeInteractive` code behind the client runtime, which lands after the page has painted.
 */
export const HEAD_SCRIPT = `try{var r=document.documentElement,c=document.cookie,m=c.match(/(?:^|; *)${THEME_COOKIE}=(dark|light)/),d=m?m[1]==="dark":matchMedia("(prefers-color-scheme: dark)").matches;r.classList.toggle("dark",d);r.classList.toggle("light",!d);var p=c.match(/(?:^|; *)${PLATFORM_COOKIE}=(ios|android)/);r.dataset.platform=p?p[1]:"ios"}catch(e){}`

const read = (name: string) => document.cookie.match(new RegExp(`(?:^|; *)${name}=([a-z]+)`))?.[1]

const write = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${MAX_AGE}; samesite=lax`
}

const systemTheme = (): Theme => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

/** The pinned choice wins; the OS answers only in its absence. */
export const resolvedTheme = (): Theme => {
  const stored = read(THEME_COOKIE)

  return stored === 'dark' || stored === 'light' ? stored : systemTheme()
}

/** Both classes, always: a root pinning neither would leave the shiki palette on `prefers-color-scheme`. */
export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.classList.toggle('light', theme === 'light')
}

export const storeTheme = (theme: Theme) => write(THEME_COOKIE, theme)

export const applyPlatform = (platform: Platform) => {
  document.documentElement.dataset.platform = platform
  write(PLATFORM_COOKIE, platform)
}
