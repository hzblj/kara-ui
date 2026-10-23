import type {Sx, SxCore} from './sx.types'

/**
 * A `Record` rather than a bare array, because `satisfies` on an array only checks membership —
 * here the compiler holds the list to `SxCore` in both directions, so a key added to the type but
 * missing from this list (which `split` would then leak into `rest`) refuses to compile.
 */
const SX_CORE_KEY_RECORD = {
  bg: true,
  blur: true,
  borderColor: true,
  borderRadius: true,
  borderWidth: true,
  h: true,
  minH: true,
  minW: true,
  offsetX: true,
  offsetY: true,
  opacity: true,
  p: true,
  pb: true,
  pl: true,
  pr: true,
  pt: true,
  px: true,
  py: true,
  rotate: true,
  scale: true,
  shadow: true,
  tall: true,
  w: true,
  wide: true,
  zIndex: true,
} as const satisfies Record<keyof SxCore, true>

/** The keys every target shares. The React Native style path takes these and none of the buckets. */
export const SX_CORE_KEYS = Object.keys(SX_CORE_KEY_RECORD) as readonly (keyof SxCore)[]

const SX_BUCKET_KEY_RECORD = {
  android: true,
  ios: true,
} as const satisfies Record<Exclude<keyof Sx, keyof SxCore | 'animate'>, true>

/** Kept apart from `SX_CORE_KEYS` so the React Native path can take the core without them. */
export const SX_BUCKET_KEYS = Object.keys(SX_BUCKET_KEY_RECORD) as readonly Exclude<
  keyof Sx,
  keyof SxCore | 'animate'
>[]

/** Every key of the native surface: the core, `animate` and the two buckets. */
export const SX_KEYS: readonly (keyof Sx)[] = [...SX_CORE_KEYS, 'animate', ...SX_BUCKET_KEYS]
