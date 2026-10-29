import type {
  NativeIconEffect,
  NativeIconEffectTrigger,
  NativeIconName,
  NativeIconRenderingMode,
  NativeIconTransition,
} from '@hzblj/expo-native-icons'
import type {ColorToken, SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * One of the app's icons: a key of the global `NativeIcons`, which the config plugin writes into `native-icons.d.ts`
 * (`plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]`) or `npx kara-icons` does. Once it exists only
 * those names type-check, so an icon removed from the folder fails at every call site; before that, any string.
 */
export type IconName = NativeIconName

/** An SF Symbols effect for `Icon` and `RnIcon`: `{type: 'bounce'}`, `{type: 'variableColor', fill: 'iterative'}`… */
export type IconEffect = NativeIconEffect

/** How an icon's layers are coloured. */
export type IconRenderingMode = NativeIconRenderingMode

/** How an icon changes into another when its `name` changes. */
export type IconTransition = NativeIconTransition

/**
 * One of the app's icons, in a host: SwiftUI `Image` of its custom SF Symbol on iOS, Material's `Icon` with the vector
 * drawable on Android. `RnIcon` draws the same asset outside one. Both play the SF Symbols effects and transitions and
 * draw the rendering modes and variable values, on both platforms.
 */
export type IconProps = {
  /** What a screen reader says. Unset, the icon is decorative and hidden from it. */
  accessibilityLabel?: string
  /** The icon's tint, and the primary colour of the other rendering modes. `content.primary` by default. */
  color?: ColorToken
  /**
   * An SF Symbols effect: `bounce`, `pulse`, `variableColor`, `wiggle`, `rotate`, `breathe`, and the states `scale`,
   * `appear` and `disappear`. Plays once per change of `effectTrigger`, or while `effectActive`.
   */
  effect?: IconEffect
  /** Runs `effect` while true; without an `effectTrigger`, true by default. */
  effectActive?: boolean
  /** Plays `effect` once whenever this value changes, never on mount. */
  effectTrigger?: NativeIconEffectTrigger
  /** Shades each layer's colour into a soft gradient, as SF Symbols does on iOS 26. iOS 26 and Android. */
  gradient?: boolean
  /** Which of the app's icons: a key of `NativeIcons`, one per SVG in the icon folder. */
  name: IconName
  /**
   * How the layers are coloured: `monochrome` (the default) tints them all, `hierarchical` draws secondary and tertiary
   * layers fainter, `palette` gives them `secondaryColor` and `tertiaryColor`, `multicolor` keeps the SVG's own fills.
   */
  renderingMode?: IconRenderingMode
  /** The `palette` mode's colour for secondary layers. `color` by default. */
  secondaryColor?: ColorToken
  /** Its width and height, a spacing token. `s24` by default. */
  size?: SpaceSize
  /** The `palette` mode's colour for tertiary layers. `secondaryColor` by default. */
  tertiaryColor?: ColorToken
  /** Test identifier, forwarded to the native view on iOS. Android ignores it. */
  testID?: string
  /**
   * Animates a change of `name`: `replace`, `replaceUpUp`, `replaceOffUp`, `magicReplace` or `automatic`. With one set,
   * a new `variableValue` eases in too. Unset, the icon swaps at once.
   */
  transition?: IconTransition
  /** From 0 to 1: switches on the SVG's `data-variable` layers whose threshold it passes, the rest dimmed. */
  variableValue?: number
}

export type IconComponent = (props: IconProps) => ReactNode
