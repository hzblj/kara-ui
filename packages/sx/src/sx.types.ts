import type {ModifierConfig as AndroidModifier} from '@expo/ui/jetpack-compose/modifiers'
import type {ModifierConfig as IosModifier} from '@expo/ui/swift-ui/modifiers'
import type {ColorToken, OpacitySize, RadiiSize, ShadowName, SpaceSize, ZIndexSize} from '@hzblj/kara-theme'

/** A length React Native accepts: absolute points, or a percentage of the parent. */
export type SxDimension = `${number}%` | number

/**
 * The keys all three targets — SwiftUI modifiers, Compose modifiers and React Native styles — can
 * express with the same meaning. A key only belongs here if all three honour it; anything one of them
 * has to fake or ignore goes to `IosSx`, `AndroidSx` or `ViewSx` instead.
 */
export type SxCore = {
  bg?: ColorToken
  blur?: number
  borderColor?: ColorToken
  borderRadius?: RadiiSize
  borderWidth?: number
  h?: number
  minH?: number
  minW?: number
  offsetX?: number
  offsetY?: number
  opacity?: OpacitySize
  p?: SpaceSize
  pb?: SpaceSize
  pl?: SpaceSize
  pr?: SpaceSize
  pt?: SpaceSize
  px?: SpaceSize
  py?: SpaceSize
  /** Clockwise, in degrees. */
  rotate?: number
  /** Uniform, or per axis — an omitted axis stays at 1. */
  scale?: number | {x?: number; y?: number}
  shadow?: ShadowName
  tall?: boolean
  w?: number
  wide?: boolean
  zIndex?: ZIndexSize
}

/** Liquid Glass, as SwiftUI's `glassEffect` names its variants. */
export type GlassVariant = 'clear' | 'identity' | 'regular'

/**
 * Every declared value in a platform bucket is a primitive — or one flat object of primitives, for
 * modifiers that take several settings at once — because `sxKey` identifies an `sx` by flattening
 * its values into a string, one level deep. Anything deeper would collapse to `[object Object]` and
 * two different configs would share a cache entry. `modifiers` is the sole exception, keyed by
 * identity.
 */
export type SxBucketValue = boolean | number | string | undefined

/** One modifier's settings: a single flat level, so `sxKey`'s one-level walk captures all of it. */
export type SxBucketConfig = {[setting: string]: SxBucketValue}

/** Holds a bucket to `SxBucketValue`/`SxBucketConfig`, so a key breaking that rule refuses to compile. */
type Bucket<T extends {[K in keyof T]: K extends 'modifiers' ? T[K] : SxBucketConfig | SxBucketValue}> = T

/** What gets redacted: skeleton placeholder, privacy blur, or the "pending update" restyle. */
export type RedactionReason = 'invalidated' | 'placeholder' | 'privacy'

/**
 * SwiftUI modifiers with no honest Compose counterpart. Setting these on Android is inert rather than
 * a type error — a design system degrades gracefully instead of forcing every call site to branch.
 */
export type IosSx = Bucket<{
  /** Width over height, fitted within the proposed size. The escape hatch covers `fill`. */
  aspectRatio?: number
  brightness?: number
  clipped?: boolean
  colorInvert?: boolean
  /**
   * Sizes the box relative to the nearest container: split it into `count` columns `spacing` apart
   * and span `span` of them — SwiftUI's stand-in for a fractional width, which its `frame` lacks.
   */
  containerRelativeFrame?: {
    alignment?: FrameAlignment
    axes: 'both' | 'horizontal' | 'vertical'
    count?: number
    span?: number
    spacing?: number
  }
  /** How a content change animates when one is driven natively. `countsDown` is `numericText`'s. */
  contentTransition?: {
    countsDown?: boolean
    type: 'identity' | 'interpolate' | 'numericText' | 'opacity'
  }
  /** Cascades to every control in the subtree, the SwiftUI environment way. */
  controlSize?: 'extraLarge' | 'large' | 'mini' | 'regular' | 'small'
  contrast?: number
  fixedSize?: 'both' | 'horizontal' | 'vertical'
  /**
   * Liquid Glass: a bare variant, or the full config. `tint` takes a theme token, and without a
   * `shape` the glass traces the box's own `borderRadius`, the way strokes and shadows do.
   */
  glass?:
    | GlassVariant
    | {
        cornerRadius?: number
        interactive?: boolean
        shape?: 'capsule' | 'circle' | 'containerRelativeShape' | 'ellipse' | 'rectangle' | 'roundedRectangle'
        tint?: ColorToken
        variant: GlassVariant
      }
  grayscale?: number
  /** Invisible, but still taking up its layout space — unlike not rendering the box at all. */
  hidden?: boolean
  /** In degrees. */
  hueRotation?: number
  /** The height SwiftUI prefers when nothing constrains it — what `fixedSize` resolves to. */
  idealH?: number
  /** The width SwiftUI prefers when nothing constrains it — what `fixedSize` resolves to. */
  idealW?: number
  /** `true` extends into every safe area; the config narrows which regions and edges. */
  ignoreSafeArea?:
    | boolean
    | {
        edges?: 'all' | 'bottom' | 'horizontal' | 'leading' | 'top' | 'trailing' | 'vertical'
        regions?: 'all' | 'container' | 'keyboard'
      }
  /** Who gets space first when the parent runs short — *not* a proportional flex weight. */
  layoutPriority?: number
  luminanceToAlpha?: boolean
  /** Escape hatch, appended last. Pass a stable array — a fresh one every render defeats the memo. */
  modifiers?: IosModifier[]
  /** Redacts only when an ancestor applies the `privacy` reason — inert on its own. */
  privacySensitive?: boolean
  /**
   * Redacts this subtree — `placeholder` is SwiftUI's built-in skeleton. One reason here;
   * combining several is escape-hatch territory.
   */
  redacted?: RedactionReason
  saturation?: number
  /** Cascades to the controls and icons in the subtree. */
  tint?: ColorToken
  /** Exempts this subtree from an ancestor's `redacted`. */
  unredacted?: boolean
}>

/** Compose modifiers with no honest SwiftUI counterpart. Inert on iOS, by the same argument. */
export type AndroidSx = Bucket<{
  /** This box's own placement inside a `ZStack` parent — Compose's per-child `Modifier.align`. */
  align?:
    | 'bottom'
    | 'bottomCenter'
    | 'bottomEnd'
    | 'bottomStart'
    | 'center'
    | 'centerEnd'
    | 'centerHorizontally'
    | 'centerStart'
    | 'centerVertically'
    | 'end'
    | 'start'
    | 'top'
    | 'topCenter'
    | 'topEnd'
    | 'topStart'
  animateContentSize?: boolean
  /** Fraction of the parent's height (0–1). The whole of it is `tall`, which works on iOS too. */
  fillMaxHeight?: number
  /** Fraction of the parent's width (0–1). The whole of it is `wide`, which works on iOS too. */
  fillMaxWidth?: number
  imePadding?: boolean
  matchParentSize?: boolean
  /** Escape hatch, appended last. Pass a stable array — a fresh one every render defeats the memo. */
  modifiers?: AndroidModifier[]
  /** Proportional share of the leftover space in a Row or Column, the way `flexGrow` behaves. */
  weight?: number
  wrapContentHeight?: 'bottom' | 'centerVertically' | 'top' | boolean
  wrapContentWidth?: 'centerHorizontally' | 'end' | 'start' | boolean
}>

/**
 * The native modifier surface: what SwiftUI and Compose can both express, plus a bucket each for what
 * only one of them can. Both buckets exist on both platforms so a component's shared `*.types.ts`
 * contract — and the `contract.check.ts` that holds the two implementations to it — stays one type.
 */
export type Sx = SxCore & {
  android?: AndroidSx
  ios?: IosSx
}

/**
 * `SxCore` for the React Native style path, which — unlike the SwiftUI/Compose modifiers, where a
 * frame needs concrete points — can size a view as a percentage of its parent. Deliberately built
 * from `SxCore` and not `Sx`: React Native styles are identical on both platforms, so the `ios` and
 * `android` buckets would have nothing to resolve into and would silently swallow whatever was passed.
 */
export type StyleSx = Omit<SxCore, 'h' | 'minH' | 'minW' | 'w'> & {
  h?: SxDimension
  minH?: SxDimension
  minW?: SxDimension
  w?: SxDimension
}

export type FrameAlignment =
  | 'bottom'
  | 'bottomLeading'
  | 'bottomTrailing'
  | 'center'
  | 'leading'
  | 'top'
  | 'topLeading'
  | 'topTrailing'
  | 'trailing'

export type SxPadding = {
  bottom?: number
  leading?: number
  top?: number
  trailing?: number
}
