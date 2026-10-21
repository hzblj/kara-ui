import {type MaterialRole, native, type PaletteColor} from '../primitives/color-source'
import type {Palette} from './palette'

/**
 * Which Material role each accent token takes under `dynamicColor`, on Android. Paired the way Material pairs them: a
 * fill with the content drawn on it (`primary` / `onPrimary`), a tinted container with the accent text that sits in
 * it (`primaryContainer` / `primary`). A disabled accent goes neutral, as a disabled Material control does.
 */
const DYNAMIC_ACCENT_ROLES = [
  ['border.accent', 'primary'],
  ['content.accent', 'primary'],
  ['content.on.bg', 'onPrimary'],
  ['fill.accent.base', 'primaryContainer'],
  ['fill.accent.disabled', 'surfaceContainerHighest'],
  ['fill.accent.primary', 'primary'],
  ['shadow.btn.accent.ring', 'primary'],
] as const satisfies readonly (readonly [string, MaterialRole])[]

type PaletteNode = PaletteColor | {[segment: string]: PaletteNode}

/**
 * Android takes the role; iOS keeps whatever the entry already said — the palette's own accent or the app's override —
 * so iOS is untouched. An entry of ours becomes a reference that leaves iOS to us, which keeps every `:oNN` token
 * built on it valid: Android hands Material roles back as hexes.
 */
const handToMaterial = (color: PaletteColor, role: MaterialRole): PaletteColor => {
  if (typeof color === 'string') {
    return native({android: role, dark: color, light: color})
  }

  if ('adaptive' in color) {
    return native({...color.adaptive, android: role})
  }

  const source = color.native

  return 'light' in source ? native({...source, android: role}) : native({android: role, ios: source.ios})
}

const replaceAt = (node: PaletteNode, [segment, ...rest]: string[], role: MaterialRole): PaletteNode => {
  const group = node as {[segment: string]: PaletteNode}
  const child = group[segment] as PaletteNode

  return {
    ...group,
    [segment]: rest.length === 0 ? handToMaterial(child as PaletteColor, role) : replaceAt(child, rest, role),
  }
}

/**
 * The palette with its accent handed to Material on Android — what `dynamicColor` means for the tokens. Applied after
 * the app's own overrides, so an overridden accent keeps its iOS value and still follows the wallpaper on Android.
 */
export const withDynamicAccent = (palette: Palette): Palette =>
  DYNAMIC_ACCENT_ROLES.reduce<PaletteNode>(
    (current, [path, role]) => replaceAt(current, path.split('.'), role),
    palette as unknown as PaletteNode
  ) as unknown as Palette
