import {adaptive, MAX_CONTRAST_SURFACE, native, type PaletteColor} from '../primitives/color-source'
import {blackAlpha, gray, green, greenAlpha, orange, orangeAlpha, red, redAlpha, whiteAlpha} from '../primitives/colors'
import type {ShadowColors, ShadowTreeOf} from '../primitives/shadows'

type ColorTree = {[name: string]: ColorTree | PaletteColor}

/**
 * Deliberately loose about what sits inside each family — the value below is the source of truth, and every
 * token type derives from it. Only `shadow` has a fixed shape: it mirrors `shadowGeometry`, so a shadow's
 * colours and its geometry cannot drift apart.
 */
type PaletteShape = {
  border: ColorTree
  btn: ColorTree
  content: ColorTree
  fill: ColorTree
  shadow: ShadowTreeOf<ShadowColors>
  surface: ColorTree
}

/**
 * The theme, in one file — there is no longer a light one and a dark one, because no entry here chooses between the
 * two. The platform does, and where it cannot, the resolver does from the active variant.
 *
 * Read it the way a designer would: by what a colour is *for*. Whose colour it turns out to be is the value's
 * business, and three answers are possible:
 *
 * - `native({ios, android})` — the platform's own, on both sides. Most of the palette.
 * - `native({ios, light, dark})` — the platform's where it has a name for this, ours where it does not.
 * - `adaptive({light, dark})` — ours, still switched by the platform on iOS. For the colours we actually care about.
 * - a plain hex — identical in both appearances, so there is nothing to switch.
 */
export const palette = {
  border: {
    accent: orange[11],
    destructive: native({android: 'error', ios: 'systemRedColor'}),
    quinary: native({android: 'surfaceContainerHighest', ios: 'quaternarySystemFillColor'}),
    secondary: {
      base: native({android: 'outline', ios: 'opaqueSeparatorColor'}),
      muted: native({android: 'outlineVariant', ios: 'separatorColor'}),
    },
    tertiary: native({android: 'outlineVariant', ios: 'separatorColor'}),
  },
  btn: {
    bg: {
      glass: {base: whiteAlpha[6], disabled: whiteAlpha[2]},
      secondary: {
        base: native({android: 'secondaryContainer', ios: 'secondarySystemFillColor'}),
        disabled: native({android: 'surfaceContainerHighest', ios: 'quaternarySystemFillColor'}),
      },
    },
    content: {disabled: native({android: 'outline', ios: 'tertiaryLabelColor'})},
  },
  content: {
    accent: adaptive({dark: orange[13], light: orange[11]}),
    destructive: native({android: 'error', ios: 'systemRedColor'}),
    on: {
      /**
       * On the accent fill (`fill.accent.primary`). Contrast is against *our* fill, not a platform surface, and the same
       * colour in both variants.
       */
      accent: gray[0],
      /**
       * On `fill.destructive.primary`. That fill is Material's `error` on Android, which goes light in dark mode, so the
       * text on it has to be `onError` there — white on Material's dark-theme error would all but vanish.
       */
      destructive: native({android: 'onError', dark: gray[0], light: gray[0]}),
      high: {contrast: native({android: 'inverseOnSurface', ios: 'systemBackgroundColor'})},
    },
    primary: native({android: 'onSurface', ios: 'labelColor'}),
    quaternary: native({android: 'outlineVariant', ios: 'quaternaryLabelColor'}),
    secondary: native({android: 'onSurfaceVariant', ios: 'secondaryLabelColor'}),
    success: native({dark: green[13], ios: 'systemGreenColor', light: green[11]}),
    tertiary: native({android: 'outline', ios: 'tertiaryLabelColor'}),
  },
  fill: {
    accent: {
      base: adaptive({dark: orangeAlpha[5], light: orange[20]}),
      disabled: adaptive({dark: orangeAlpha[5], light: orange[19]}),
      primary: orange[11],
    },
    destructive: {
      base: adaptive({dark: redAlpha[5], light: red[20]}),
      disabled: adaptive({dark: redAlpha[5], light: red[19]}),
      primary: native({android: 'error', ios: 'systemRedColor'}),
    },
    quaternary: native({android: 'surfaceContainerHighest', ios: 'quaternarySystemFillColor'}),
    success: {
      base: adaptive({dark: greenAlpha[5], light: green[20]}),
      primary: native({dark: green[11], ios: 'systemGreenColor', light: green[10]}),
    },
    tertiary: native({android: 'surfaceVariant', ios: 'tertiarySystemFillColor'}),
  },
  shadow: {
    btn: {
      accent: {drop: blackAlpha[2], inset: whiteAlpha[16], ring: adaptive({dark: orangeAlpha[0], light: orange[8]})},
      destructive: {drop: blackAlpha[2], inset: whiteAlpha[16], ring: adaptive({dark: redAlpha[0], light: red[8]})},
      glass: {drop: blackAlpha[2], inset: whiteAlpha[8], ring: blackAlpha[3]},
      secondary: {
        drop: blackAlpha[2],
        inset: whiteAlpha[8],
        ring: adaptive({dark: blackAlpha[10], light: blackAlpha[5]}),
      },
    },
    card: {ring: native({android: 'outlineVariant', ios: 'separatorColor'})},
    input: {ring: native({android: 'outlineVariant', ios: 'separatorColor'})},
    snackbar: {
      drop: blackAlpha[5],
      inset: whiteAlpha[6],
      ring: native({android: 'outlineVariant', ios: 'separatorColor'}),
    },
  },
  surface: {
    base: native({android: 'surface', ios: 'systemGroupedBackgroundColor'}),
    depth: adaptive({dark: gray[23], light: gray[3], ...MAX_CONTRAST_SURFACE}),
    high: {contrast: native({android: 'inverseSurface', ios: 'labelColor'})},
    primary: native({android: 'surfaceContainerLow', ios: 'secondarySystemGroupedBackgroundColor'}),
    /** A step above `primary` — Material's `surfaceContainer`, what a top app bar fills with once content scrolls under it. */
    secondary: native({android: 'surfaceContainer', ios: 'tertiarySystemGroupedBackgroundColor'}),
  },
} as const satisfies PaletteShape

/** Derived from the value, so a colour added above gets its token without a second edit anywhere. */
export type Palette = typeof palette
