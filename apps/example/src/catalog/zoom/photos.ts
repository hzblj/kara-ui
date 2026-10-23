import type {DurationSize} from '@hzblj/kara-ui'
import type {ZoomTransitionEnablerProps} from '@hzblj/kara-ui/router'

export type Photo = {
  caption: string
  id: string
  title: string
  uri: string
}

/** Remote photos at fixed seeds, so the card, the menu preview and the page all load the same, cached URL. */
export const PHOTOS: readonly Photo[] = [1, 2, 3, 4].map(index => ({
  caption: 'A photo that grows into its own page and shrinks back into the card it came from.',
  id: String(index),
  title: `Look ${String(index).padStart(2, '0')}`,
  uri: `https://picsum.photos/seed/kara-look-${index}/900/1200`,
}))

export const photo = (id: string | undefined) => PHOTOS.find(entry => entry.id === id)

export const photoTitle = (id: string | undefined) => photo(id)?.title ?? ''

/** What the demo lets you change, carried to the pushed page as route params (strings). */
export type ZoomSettings = {
  background: 'blurred' | 'default' | 'tinted'
  dismiss: 'any' | 'none' | 'vertical'
  path: 'arc' | 'linear'
  speed: 'default' | 'quick' | 'slow'
}

export const DEFAULT_SETTINGS: ZoomSettings = {background: 'default', dismiss: 'any', path: 'arc', speed: 'default'}

/** Unset is Material's own 450 ms; quick is `fast` (250 ms), slow the scale's longest, `verySlow` (500 ms). */
const SPEEDS: Record<ZoomSettings['speed'], DurationSize | undefined> = {
  default: undefined,
  quick: 'fast',
  slow: 'verySlow',
}

export const parseSettings = (params: Partial<Record<keyof ZoomSettings, string>>): ZoomSettings => ({
  background: (params.background as ZoomSettings['background']) ?? DEFAULT_SETTINGS.background,
  dismiss: (params.dismiss as ZoomSettings['dismiss']) ?? DEFAULT_SETTINGS.dismiss,
  path: (params.path as ZoomSettings['path']) ?? DEFAULT_SETTINGS.path,
  speed: (params.speed as ZoomSettings['speed']) ?? DEFAULT_SETTINGS.speed,
})

/** The settings as the props they stand for — shared at the top, the rest under `ios` and `android`. */
export const enablerProps = (settings: ZoomSettings): Omit<ZoomTransitionEnablerProps, 'sourceIdentifier'> => ({
  android: {duration: SPEEDS[settings.speed], path: settings.path},
  ios: {blur: settings.background === 'blurred' ? 'thin' : undefined, dismissGesture: settings.dismiss},
  scrim: settings.background === 'tinted' ? 'fill.accent.primary:o20' : undefined,
})
