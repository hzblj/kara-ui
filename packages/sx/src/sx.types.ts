import type {ModifierConfig as AndroidModifier} from '@expo/ui/jetpack-compose/modifiers'
import type {ModifierConfig as IosModifier} from '@expo/ui/swift-ui/modifiers'
import type {ColorToken, OpacitySize, RadiiSize, ShadowName, SpaceSize, ZIndexSize} from '@hzblj/kara-theme'

/** A length React Native accepts: absolute points, or a percentage of the parent. */
export type SxDimension = `${number}%` | number

/**
 * The keys all three targets (SwiftUI modifiers, Compose modifiers and React Native styles) can
 * express with the same meaning. A key only belongs here if all three honour it; anything one of them
 * has to fake or ignore goes to `IosSx`, `AndroidSx` or `ViewSx` instead.
 */
export type SxCore = {
  /** The background colour, a palette token. */
  bg?: ColorToken
  /** A Gaussian blur over the whole box, its radius in points. */
  blur?: number
  /** The stroke colour, with `borderWidth`. */
  borderColor?: ColorToken
  /** Rounds the corners, and clips the content, the background and the stroke to them. */
  borderRadius?: RadiiSize
  /** A stroke inside the edge, in points. */
  borderWidth?: number
  /** A fixed height, in points. */
  h?: number
  /** The least height, in points. */
  minH?: number
  /** The least width, in points. */
  minW?: number
  /** Moves the box sideways after layout, in points. Its neighbours stay where they were. */
  offsetX?: number
  /** Moves the box up or down after layout, in points. Its neighbours stay where they were. */
  offsetY?: number
  /** How opaque the whole box is, an opacity token. */
  opacity?: OpacitySize
  /** Padding on every side. A side or an axis of its own wins over it. */
  p?: SpaceSize
  /** Bottom padding. */
  pb?: SpaceSize
  /** Left padding: the leading edge, on the native surface. */
  pl?: SpaceSize
  /** Right padding: the trailing edge, on the native surface. */
  pr?: SpaceSize
  /** Top padding. */
  pt?: SpaceSize
  /** Left and right padding. */
  px?: SpaceSize
  /** Top and bottom padding. */
  py?: SpaceSize
  /** Clockwise, in degrees. */
  rotate?: number
  /** Uniform, or per axis. An omitted axis stays at 1. */
  scale?: number | {x?: number; y?: number}
  /** One of the theme's shadows: a drop, an inset highlight and a hairline ring, as the token defines. */
  shadow?: ShadowName
  /** Takes all the height the parent offers. */
  tall?: boolean
  /** A fixed width, in points. */
  w?: number
  /** Takes all the width the parent offers. */
  wide?: boolean
  /** Draws the box above or below its siblings, a z-index token. */
  zIndex?: ZIndexSize
}

/** Liquid Glass, as SwiftUI's `glassEffect` names its variants. */
export type GlassVariant = 'clear' | 'identity' | 'regular'

/**
 * Every declared value in a platform bucket is a primitive (or one flat object of primitives, for
 * modifiers that take several settings at once) because `sxKey` identifies an `sx` by flattening
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
 * a type error: a design system degrades gracefully instead of forcing every call site to branch.
 */
export type IosSx = Bucket<{
  /**
   * Animates what changes in the subtree whenever `value` does. This is SwiftUI's `.animation(_:value:)`, the pairing
   * a `contentTransition` needs to play at all. `curve` is `default` unless set; `duration` is in seconds.
   */
  animation?: {
    curve?: 'bouncy' | 'default' | 'easeIn' | 'easeInOut' | 'easeOut' | 'linear' | 'smooth' | 'snappy' | 'spring'
    duration?: number
    value: boolean | number
  }
  /** Width over height, fitted within the proposed size. The escape hatch covers `fill`. */
  aspectRatio?: number
  /** Brightens (positive) or darkens (negative) the box, from -1 to 1. */
  brightness?: number
  /** Clips the content to the box's frame. */
  clipped?: boolean
  /** Inverts every colour in the box. */
  colorInvert?: boolean
  /**
   * Sizes the box relative to the nearest container: split it into `count` columns `spacing` apart
   * and span `span` of them. It is SwiftUI's stand-in for a fractional width, which its `frame` lacks.
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
  /** Scales the contrast: 1 leaves it, 0 is flat grey, above 1 sharpens it. */
  contrast?: number
  /** Holds the box at its ideal size on these axes, whatever its parent proposes. */
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
  /** Drains the colour, from 0 (none) to 1 (fully grey). */
  grayscale?: number
  /** Invisible, but still taking up its layout space, unlike not rendering the box at all. */
  hidden?: boolean
  /** In degrees. */
  hueRotation?: number
  /** The height SwiftUI prefers when nothing constrains it, which is what `fixedSize` resolves to. */
  idealH?: number
  /** The width SwiftUI prefers when nothing constrains it, which is what `fixedSize` resolves to. */
  idealW?: number
  /** `true` extends into every safe area; the config narrows which regions and edges. */
  ignoreSafeArea?:
    | boolean
    | {
        edges?: 'all' | 'bottom' | 'horizontal' | 'leading' | 'top' | 'trailing' | 'vertical'
        regions?: 'all' | 'container' | 'keyboard'
      }
  /** Who gets space first when the parent runs short, *not* a proportional flex weight. */
  layoutPriority?: number
  /** Turns brightness into transparency: dark becomes clear, light stays opaque. */
  luminanceToAlpha?: boolean
  /** Escape hatch, appended last. Pass a stable array: a fresh one every render defeats the memo. */
  modifiers?: IosModifier[]
  /** Digits of one width, so a number that changes does not shift what follows it. */
  monospacedDigit?: boolean
  /** Redacts only when an ancestor applies the `privacy` reason, and is inert on its own. */
  privacySensitive?: boolean
  /**
   * Redacts this subtree. `placeholder` is SwiftUI's built-in skeleton. One reason here;
   * combining several is escape-hatch territory.
   */
  redacted?: RedactionReason
  /** Scales the saturation: 1 leaves it, 0 is grey, above 1 intensifies it. */
  saturation?: number
  /** Cascades to the controls and icons in the subtree. */
  tint?: ColorToken
  /** Exempts this subtree from an ancestor's `redacted`. */
  unredacted?: boolean
}>

/** Compose modifiers with no honest SwiftUI counterpart. Inert on iOS, by the same argument. */
export type AndroidSx = Bucket<{
  /** This box's own placement inside a `ZStack` parent (Compose's per-child `Modifier.align`). */
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
  /** Escape hatch, appended last. Pass a stable array: a fresh one every render defeats the memo. */
  modifiers?: AndroidModifier[]
  /** Proportional share of the leftover space in a Row or Column, the way `flexGrow` behaves. */
  weight?: number
  wrapContentHeight?: 'bottom' | 'centerVertically' | 'top' | boolean
  wrapContentWidth?: 'centerHorizontally' | 'end' | 'start' | boolean
}>

/**
 * The native modifier surface: what SwiftUI and Compose can both express, plus a bucket each for what
 * only one of them can. Both buckets exist on both platforms so a component's shared `*.types.ts`
 * contract (and the `contract.check.ts` that holds the two implementations to it) stays one type.
 */
export type Sx = SxCore & {
  android?: AndroidSx
  ios?: IosSx
}

/**
 * `SxCore` for the React Native style path, which (unlike the SwiftUI/Compose modifiers, where a
 * frame needs concrete points) can size a view as a percentage of its parent. Deliberately built
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
